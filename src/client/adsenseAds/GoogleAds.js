import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { isMobile } from '../../common/helpers/apiHelpers';
import { getSettingsAds } from '../../store/websiteStore/websiteSelectors';
import './GoogleAds.less';

const parseInsTagAttributes = str => {
  const attrs = Object.fromEntries(
    [...str.matchAll(/(\S+)=["']([^"']+)["']/g)].map(([, key, value]) => [
      key === 'class' ? 'className' : key,
      value,
    ]),
  );

  if (attrs.style) {
    attrs.style = Object.fromEntries(
      attrs.style
        .split(';')
        .map(s => s.trim())
        .filter(Boolean)
        .map(s => {
          const [k, v] = s.split(':').map(x => x.trim());
          const camelKey = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

          return [camelKey, v];
        }),
    );
  }

  return attrs;
};

const GoogleAds = ({
  inPost = false,
  listItem = false,
  inFeed = false,
  inShop = false,
  inList = false,
  limitWidth = false,
}) => {
  const adRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

  const unitCode = useSelector(getSettingsAds)?.displayUnitCode || '';
  const insTagMatch = unitCode?.match(/<ins\s[^>]*class=["']adsbygoogle["'][^>]*><\/ins>/i);

  let insAttributes = {};

  if (Array.isArray(insTagMatch) && insTagMatch?.[0]) {
    insAttributes = parseInsTagAttributes(insTagMatch?.[0]);
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      const ins = adRef.current;

      if (window.adsbygoogle && adRef.current) {
        try {
          window.adsbygoogle.push({});
          // eslint-disable-next-line no-console
          console.log('✅ Adsense pushed');

          setTimeout(() => {
            const adElement = adRef.current;
            const adStatus = adElement?.getAttribute('data-ad-status');

            if (adStatus === 'unfilled' || !ins.innerHTML.trim()) {
              setVisible(false);
              ins.parentElement?.classList.add('hidden-ad');
            } else if (adStatus === 'filled') {
              // eslint-disable-next-line no-console
              console.log('✅ Ad filled');
              setVisible(true);
              ins.parentElement?.classList.remove('hidden-ad');
            } else {
              // eslint-disable-next-line no-console
              console.log(adStatus, '❓ Ad status');
              const iframe = adElement?.querySelector('iframe');

              if (!iframe) {
                // eslint-disable-next-line no-console
                console.log('⚠️ No iframe found — hiding ad block');
                setVisible(false);
              }
              const status = ins.getAttribute('data-ad-status');

              // eslint-disable-next-line no-console
              console.log('Ad status checked:', status);
            }
          }, 2500);
        } catch (e) {
          console.error('❌ AdSense error', e);
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [adRef.current]);

  if (!visible || !insAttributes || isEmpty(unitCode)) return null;

  const wrapperClass = classNames('google-ads', {
    'in-post': inPost,
    'list-item': listItem,
    'in-feed': inFeed,
    'in-shop': inShop,
    'in-list': inList,
    'limit-width': limitWidth,
    'mobile-feed': inFeed && isMobile(),
    localhost: isLocalhost,
  });

  return (
    <div className={wrapperClass}>
      <ins
        {...insAttributes}
        className={classNames(insAttributes.className, { 'list-item': listItem })}
        {...(isLocalhost ? { 'data-adtest': 'on' } : {})}
        ref={adRef}
      />
    </div>
  );
};

GoogleAds.propTypes = {
  inPost: PropTypes.bool,
  inFeed: PropTypes.bool,
  inShop: PropTypes.bool,
  inList: PropTypes.bool,
  listItem: PropTypes.bool,
  limitWidth: PropTypes.bool,
};

export default GoogleAds;

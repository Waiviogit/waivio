import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
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
    const hideEmptyAds = () => {
      document.querySelectorAll('.google-ads').forEach(ad => {
        const ins = ad.querySelector('ins');
        const iframe = ins?.querySelector('iframe');

        if (!ins || !iframe) {
          // eslint-disable-next-line no-param-reassign
          ad.style.display = 'none';
        }
      });
    };

    const timer = setTimeout(() => {
      if (window.adsbygoogle && adRef.current && adRef.current.offsetWidth > 0) {
        try {
          window.adsbygoogle.push({});
          // eslint-disable-next-line no-console
          console.log('✅ Adsense pushed');

          setTimeout(() => {
            const adElement = adRef.current;
            const iframe = adElement?.querySelector('iframe');
            const adStatus = adElement?.getAttribute('data-ad-status');

            if (!iframe || adStatus === 'unfilled') {
              setVisible(false);
            }

            hideEmptyAds();
          }, 2500);
        } catch (e) {
          console.error('AdSense error', e);
          setVisible(false);
        }
      }
    }, 300);

    window.addEventListener('resize', () => {
      setTimeout(() => {
        hideEmptyAds();
      }, 1000);
    });

    return () => clearTimeout(timer);
  }, []);

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
        {...(isLocalhost ? { 'data-adtest': 'on' } : {})}
        {...(listItem ? { className: 'list-item' } : {})}
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

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
    if (!adRef.current || !window.adsbygoogle) return;

    try {
      window.adsbygoogle.push({});
      // eslint-disable-next-line no-console
      console.log('✅ Adsense pushed');
    } catch (e) {
      console.error('AdSense error', e);
      setVisible(false);
    }

    const ins = adRef.current;

    const observer = new MutationObserver(() => {
      const status = ins.getAttribute('data-ad-status');

      if (status === 'unfilled' || !ins.innerHTML.trim()) {
        setVisible(false);
        ins.parentElement?.classList.add('hidden-ad');
      } else {
        setVisible(true);
        ins.parentElement?.classList.remove('hidden-ad');
      }

      // eslint-disable-next-line no-console
      console.log('Ad status changed:', status);
    });

    observer.observe(ins, { attributes: true, attributeFilter: ['data-ad-status'] });

    // eslint-disable-next-line consistent-return
    return () => observer.disconnect();
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

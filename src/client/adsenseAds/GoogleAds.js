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
        const isInsEmpty = !ins || ins.childNodes.length === 0 || ins.innerHTML.trim() === '';

        if (isInsEmpty || !iframe) {
          ad.classList.add('hidden-ad');
        }
      });

      // document.querySelectorAll('.slick-slide').forEach(slide => {
      //   const ad = slide.querySelector('.google-ads');
      //   const ins = ad?.querySelector('ins');
      //   const iframe = ins?.querySelector('iframe');
      //   const isInsEmpty = !ins || ins.childNodes.length === 0 || ins.innerHTML.trim() === '';
      //
      //   if (isInsEmpty || !iframe) {
      //     slide.classList.add('hidden-ad');
      //   }
      // });
    };

    const timer = setTimeout(() => {
      if (window.adsbygoogle && adRef.current && adRef.current.offsetWidth > 0) {
        try {
          window.adsbygoogle.push({});
          // eslint-disable-next-line no-console
          console.log('✅ Adsense pushed');

          setTimeout(() => {
            const adElement = adRef.current;
            const ins = adElement?.querySelector('ins');
            const iframe = ins?.querySelector('iframe');
            const adStatus = adElement?.getAttribute('data-ad-status');

            const isInsEmpty = !ins || ins.childNodes.length === 0 || ins.innerHTML.trim() === '';

            if (isInsEmpty || !iframe || adStatus === 'unfilled') {
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

    const resizeHandler = () => {
      setTimeout(() => {
        hideEmptyAds();
      }, 1000);
    };

    window.addEventListener('resize', resizeHandler);

    const observer = new MutationObserver(() => {
      hideEmptyAds();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', resizeHandler);
      observer.disconnect();
    };
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

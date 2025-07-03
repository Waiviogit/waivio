import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getSettingsAds } from '../../store/websiteStore/websiteSelectors';

const GoogleAds = ({ isNewsfeed = false }) => {
  const adRef = useRef();
  const [visible, setVisible] = useState(true);
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  const adSense = useSelector(getSettingsAds)?.code;

  const ADSENSE_CLIENT_ID = useMemo(() => {
    if (!adSense || typeof adSense !== 'string') return '';

    const match = adSense.match(/client=([\w-]+)/);

    return match ? match[1] : '';
  }, [adSense]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.adsbygoogle && adRef.current) {
        try {
          window.adsbygoogle.push({});
          // eslint-disable-next-line no-console
          console.log('✅ Adsense pushed');

          setTimeout(() => {
            const adElement = adRef.current;
            const adStatus = adElement?.getAttribute('data-ad-status');

            if (adStatus === 'unfilled') {
              // eslint-disable-next-line no-console
              console.log('🚫 No ad filled — hiding ad block');
              setVisible(false);
            } else if (adStatus === 'filled') {
              // eslint-disable-next-line no-console
              console.log('✅ Ad filled');
            } else {
              // eslint-disable-next-line no-console
              console.log(adStatus, '❓ Ad status');

              const iframe = adRef.current?.querySelector('iframe');

              if (!iframe) {
                // eslint-disable-next-line no-console
                console.log('⚠️ No iframe found — hiding ad block');
                setVisible(false);
              }
            }
          }, 2500);
        } catch (e) {
          console.error('❌ AdSense error', e);
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  if (isNewsfeed && visible)
    return (
      <div style={{ minWidth: '250px', minHeight: '250px' }}>
        <ins
          {...(isLocalhost ? { 'data-adtest': 'on' } : {})}
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'inline-block', width: '300px', height: '250px' }}
          data-ad-format="fluid"
          data-ad-layout-key="-6t+ed+2i-1n-4w"
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot="6608674711"
        />
      </div>
    );

  return null;
};

GoogleAds.propTypes = {
  isNewsfeed: PropTypes.bool,
  isPostText: PropTypes.bool,
};

export default GoogleAds;

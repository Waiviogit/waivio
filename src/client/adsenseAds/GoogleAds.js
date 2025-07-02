import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const GoogleAds = ({ isNewsfeed, isPostText }) => {
  const adRef = useRef();
  const [visible, setVisible] = useState(true);
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.adsbygoogle && adRef.current) {
        try {
          window.adsbygoogle.push({});
          // eslint-disable-next-line no-console
          console.log('Adsense pushed');

          setTimeout(() => {
            const hasContent =
              adRef.current?.offsetHeight > 0 && adRef.current?.innerHTML.trim().length > 0;

            if (!hasContent) {
              // eslint-disable-next-line no-console
              console.log('Adsense block empty');
              setVisible(false);
            }
          }, 2000);
        } catch (e) {
          console.error('AdSense error', e);
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  if (isNewsfeed)
    return (
      <div style={{ minWidth: '250px', minHeight: '250px' }}>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'inline-block', width: '300px', height: '250px' }}
          data-ad-format="fluid"
          data-ad-layout-key="-6t+ed+2i-1n-4w"
          data-ad-client="ca-pub-4624906456940175"
          data-ad-slot="6608674711"
          {...(isLocalhost ? { 'data-adtest': 'on' } : {})}
        />
      </div>
    );

  if (isPostText)
    return (
      <div style={{ minWidth: '250px', minHeight: '250px' }}>
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-format="fluid"
          data-ad-layout-key="-gw-3+1f-3d+2z"
          data-ad-client="ca-pub-4624906456940175"
          data-ad-slot="5593107956"
          {...(isLocalhost ? { 'data-adtest': 'on' } : {})}
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

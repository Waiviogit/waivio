import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const GoogleAds = ({ isNewsfeed = false, isPostText = false }) => {
  const adRef = useRef();
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

  useEffect(() => {
    if (adRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error', e);
      }
    }
  }, []);

  if (isNewsfeed)
    return (
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: 'block',
        }}
        data-ad-client="ca-pub-4624906456940175"
        data-ad-slot="1450952461"
        data-ad-format="auto"
        data-full-width-responsive="true"
        {...(isLocalhost ? { 'data-adtest': 'on' } : {})}
      />
    );

  if (isPostText)
    return (
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-layout-key="-gw-3+1f-3d+2z"
        data-ad-client="ca-pub-4624906456940175"
        data-ad-slot="5593107956"
        {...(isLocalhost ? { 'data-adtest': 'on' } : {})}
      />
    );

  return null;
};

GoogleAds.propTypes = {
  isNewsfeed: PropTypes.bool,
  isPostText: PropTypes.bool,
};
export default GoogleAds;

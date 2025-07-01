import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const GoogleAds = ({ isNewsfeed, isPostText }) => {
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
      <div style={{ minWidth: '250px', minHeight: '250px' }}>
        <ins
          className="adsbygoogle"
          style={{ display: 'inline-block', width: '300px', height: '250px' }}
          data-ad-client="ca-pub-4624906456940175"
          data-ad-slot="1450952461"
          {...(isLocalhost ? { 'data-adtest': 'on' } : {})}
        />

        {/* <ins */}
        {/*    ref={adRef} */}
        {/*    className="adsbygoogle" */}
        {/*    style={{display: 'inline-block'}} */}
        {/*    data-ad-client="ca-pub-4624906456940175" */}
        {/*    data-ad-slot="6608674711" */}
        {/*    data-ad-format="fluid" */}
        {/*    data-ad-layout-key="-6t+ed+2i-1n-4w" */}
        {/*    {...(isLocalhost ? {'data-adtest': 'on'} : {})} */}
        {/* /> */}
      </div>
    );

  if (isPostText)
    return (
      <div style={{ minWidth: '250px', minHeight: '250px' }}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-format="fluid"
          data-ad-layout-key="-gw-3+1f-3d+2z"
          data-ad-client="ca-pub-4624906456940175"
          data-ad-slot="5593107956"
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

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const GoogleAds = ({ isNewsfeed, isPostText }) => {
  const adRef = useRef();
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

  useEffect(() => {
    if (adRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        // eslint-disable-next-line no-console
        console.log('Adsense started');
      } catch (e) {
        console.error('AdSense error', e);
      }
    }
  }, []);

  if (isNewsfeed)
    return (
      <div style={{ minWidth: '250px', minHeight: '250px' }}>
        {/* <ins */}
        {/*  ref={adRef} */}
        {/*  className="adsbygoogle" */}
        {/*  style={{ display: 'inline-block', width: '300px', height: '250px' }} */}
        {/*  data-ad-format="fluid" */}
        {/*  data-ad-layout-key="-6t+ed+2i-1n-4w" */}
        {/*  data-ad-client="ca-pub-4624906456940175" */}
        {/*  data-ad-slot="6608674711" */}
        {/*  {...(isLocalhost ? { 'data-adtest': 'on' } : {})} */}
        {/* /> */}
        <ins
          className="adsbygoogle"
          style={{ display: 'inline-block', width: '300px', height: '250px' }}
          data-ad-client="ca-pub-3940256099942544"
          data-ad-slot="6300978111"
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

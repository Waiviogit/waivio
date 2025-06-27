import React, { useEffect, useRef } from 'react';

const NewsfeedAd = () => {
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

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{ display: 'inline-block', width: 300, height: 250 }}
      data-ad-client="ca-pub-4624906456940175"
      data-ad-slot="6608674711"
      data-ad-format="fluid"
      data-ad-layout-key="-6t+ed+2i-1n-4w"
      {...(isLocalhost ? { 'data-adtest': 'on' } : {})}
    />
  );
};

export default NewsfeedAd;

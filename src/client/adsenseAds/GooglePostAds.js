import React, { useEffect, useRef } from 'react';

const GooglePostAds = () => {
  const adRef = useRef();
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (adRef.current) {
      const loadAd = () => {
        if (
          typeof window !== 'undefined' &&
          window.adsbygoogle &&
          adRef.current &&
          !adRef.current.dataset.loaded
        ) {
          try {
            window.adsbygoogle.push({});
            adRef.current.dataset.loaded = 'true';
            // eslint-disable-next-line no-console
            console.log('✅ AdSense post ad pushed');
          } catch (e) {
            console.error('❌ AdSense push error', e);
          }
        }
      };

      const timeout = setTimeout(loadAd, 500);

      return () => clearTimeout(timeout);
    }
  }, []);

  return (
    <div style={{ minWidth: '250px', minHeight: '200px' }}>
      <ins
        {...(isLocalhost ? { 'data-adtest': 'on' } : {})}
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'inline-block' }}
        data-ad-client="ca-pub-4624906456940175"
        data-ad-slot="6623791043"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default GooglePostAds;

import React, { useEffect, useRef } from 'react';

const NewsfeedAd = () => {
  const adRef = useRef();

  useEffect(() => {
    if (!adRef.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense push error:', e);
    }
  }, []);

  return (
    <div style={{ width: '100%', minHeight: 250, textAlign: 'center', background: '#f9f9f9' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4624906456940175"
        data-ad-slot="6608674711"
        data-ad-format="auto"
        data-full-width-responsive="true"
        // data-adtest="on"
      />
    </div>
  );
};

export default NewsfeedAd;

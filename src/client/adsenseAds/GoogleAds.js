import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { getSettingsAds } from '../../store/websiteStore/websiteSelectors';

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

const GoogleAds = () => {
  const adRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

  const unitCode = useSelector(getSettingsAds)?.displayUnitCode || '';
  const insTagMatch = unitCode?.match(/<ins\s[^>]*class=["']adsbygoogle["'][^>]*><\/ins>/i);

  // eslint-disable-next-line no-console
  console.log(insTagMatch, 'insTagMatch');
  let insAttributes = {};

  if (Array.isArray(insTagMatch) && insTagMatch?.[0]) {
    insAttributes = parseInsTagAttributes(insTagMatch?.[0]);
  }

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
              const iframe = adElement?.querySelector('iframe');

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

  if (!visible || !insAttributes) return null;

  return (
    <div style={{ minWidth: '250px', minHeight: '100px' }}>
      <ins {...insAttributes} {...(isLocalhost ? { 'data-adtest': 'on' } : {})} ref={adRef} />
    </div>
  );
};

GoogleAds.propTypes = {};

export default GoogleAds;

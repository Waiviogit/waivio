import React, { useEffect, useState } from 'react';
import { ReactSVG } from 'react-svg';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { useHistory } from 'react-router';
import Cookie from 'js-cookie';
import './CookieNotice.less';

const CookieNotice = () => {
  const [visible, setVisible] = useState(false);
  const history = useHistory();

  const hostname = typeof window !== 'undefined' ? window?.location?.hostname : 'default';
  const cookieKey = `cookie_accepted_${hostname}`;

  const isWaivio = hostname.includes('waivio');
  const signInPage = history?.location?.pathname?.includes('sign-in');
  const showNotice = isWaivio || !signInPage;

  useEffect(() => {
    if (Cookie.get(cookieKey) !== 'accepted' && showNotice) {
      setVisible(true);
    }
  }, [cookieKey, showNotice]);

  const handleAccept = () => {
    // ✅ set cookie with expiration (e.g., 1 year)
    Cookie.set(cookieKey, 'accepted', { expires: 365 });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-notice-box">
      <div className="cookie-wrap">
        <span>
          <ReactSVG wrapper="span" src="/images/icons/cookies-icon.svg" className="cookie-icon" />
        </span>
        <div>
          <div className="cookie-title">Cookies policy</div>
          <div className="cookie-description">
            This website uses cookies to ensure you get the best experience. For details, see our{' '}
            <Link to="/object/uid-cookies-policy">Cookies Policy</Link>.
          </div>
        </div>
      </div>
      <div className="cookie-buttons">
        <Button onClick={() => window.open('/object/uid-cookies-policy', '_self')}>
          Learn more
        </Button>
        <Button type="primary" onClick={handleAccept}>
          Accept
        </Button>
      </div>
    </div>
  );
};

export default CookieNotice;

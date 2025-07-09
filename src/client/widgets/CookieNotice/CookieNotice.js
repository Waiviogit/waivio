import React, { useEffect, useState } from 'react';
import { ReactSVG } from 'react-svg';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import Cookie from 'js-cookie';
import './CookieNotice.less';

const CookieNotice = () => {
  const [visible, setVisible] = useState(false);
  const cookieKey = `cookie_accepted_${window?.location?.hostname}`;

  useEffect(() => {
    const accepted = Cookie.get(cookieKey);

    if (!accepted) {
      setVisible(true);
    }
  }, [cookieKey]);

  const handleAccept = () => {
    Cookie.set(cookieKey, 'true', {
      expires: 365,
      sameSite: 'Lax',
    });
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

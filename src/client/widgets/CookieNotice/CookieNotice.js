import React, { useEffect, useState } from 'react';
import { ReactSVG } from 'react-svg';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import Cookie from 'js-cookie';
import './CookieNotice.less';

const CookieNotice = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = Cookie.get('cookie_accepted');

    if (!accepted) setVisible(true);
  }, []);

  const handleAccept = () => {
    Cookie.set('cookie_accepted', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-notice-box">
      <div className={'cookie-wrap'}>
        {' '}
        <div>
          {' '}
          <span>
            {' '}
            <ReactSVG
              wrapper="span"
              src="/images/icons/cookies-icon.svg"
              className={'cookie-icon'}
            />
          </span>
        </div>
        <div>
          <div className="cookie-title">Cookies policy</div>
          <div className="cookie-description">
            This website uses cookies to ensure you get the best experience. For details, see our{' '}
            <span>
              <Link to="/object/uid-cookies-policy">Cookies Policy</Link>
            </span>
            .
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

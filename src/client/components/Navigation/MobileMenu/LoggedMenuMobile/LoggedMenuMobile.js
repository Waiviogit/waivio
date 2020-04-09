import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import './LoggedMenuMobile.less';

const LoggedMenuMobile = ({ username, toggleMenu, onLogout }) => {
  const loggedInMenu = (
    <React.Fragment>
      <Link to="/my_feed" className="LoggedMenu__link" onClick={toggleMenu}>
        <FormattedMessage id="my_feed" defaultMessage="My feed" />
      </Link>
      <Link to="/discover" className="LoggedMenu__link" onClick={toggleMenu}>
        <FormattedMessage id="discover" defaultMessage="Discover" />
      </Link>
      <Link to="/drafts" className="LoggedMenu__link" onClick={toggleMenu}>
        <FormattedMessage id="drafts" defaultMessage="Drafts" />
      </Link>
      <Link to="/settings" className="LoggedMenu__link" onClick={toggleMenu}>
        <FormattedMessage id="settings" defaultMessage="Settings" />
      </Link>
      <Link to="/replies" className="LoggedMenu__link" onClick={toggleMenu}>
        <FormattedMessage id="replies" defaultMessage="Replies" />
      </Link>
      <Link to="/wallet" className="LoggedMenu__link" onClick={toggleMenu}>
        <FormattedMessage id="wallet" defaultMessage="Wallet" />
      </Link>
      <Link
        to="/object/qjr-investarena-q-and-a/list"
        className="LoggedMenu__link"
        onClick={toggleMenu}
      >
        <FormattedMessage id="about" defaultMessage="About" />
      </Link>
      <div className="LoggedMenu__link" onClick={onLogout} role="presentation">
        <FormattedMessage id="logout" defaultMessage="Logout" />
      </div>
    </React.Fragment>
  );

  const loggedOutMenu = (
    <React.Fragment>
      <Link to="/" className="LoggedMenu__link" onClick={toggleMenu}>
        <FormattedMessage id="home" defaultMessage="Home" />
      </Link>
      <Link to="/discover" className="LoggedMenu__link" onClick={toggleMenu}>
        <FormattedMessage id="discover" defaultMessage="Discover" />
      </Link>
      <Link to="/about" className="LoggedMenu__link" onClick={toggleMenu}>
        <FormattedMessage id="about" defaultMessage="About" />
      </Link>
    </React.Fragment>
  );
  return <div className="LoggedMenu">{username ? loggedInMenu : loggedOutMenu}</div>;
};

LoggedMenuMobile.propTypes = {
  username: PropTypes.string.isRequired,
  toggleMenu: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default LoggedMenuMobile;

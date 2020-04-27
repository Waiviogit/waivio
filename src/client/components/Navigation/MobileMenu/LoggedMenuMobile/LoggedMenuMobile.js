import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import LoggedOutButtons from '../../LoggedOutMenu';
import './LoggedMenuMobile.less';

const LoggedMenuMobile = ({ username, toggleMenu, onLogout, location, searchBarActive }) => {
  const loggedInMenu = (
    <React.Fragment>
      <Link to="/my_feed" className="LoggedMenu__item" onClick={toggleMenu}>
        <FormattedMessage id="my_feed" defaultMessage="My feed" />
      </Link>
      <Link to="/discover-objects/crypto" className="LoggedMenu__item" onClick={toggleMenu}>
        <FormattedMessage id="discover" defaultMessage="Discover" />
      </Link>
      <Link to="/drafts" className="LoggedMenu__item" onClick={toggleMenu}>
        <FormattedMessage id="drafts" defaultMessage="Drafts" />
      </Link>
      <Link to="/settings" className="LoggedMenu__item" onClick={toggleMenu}>
        <FormattedMessage id="settings" defaultMessage="Settings" />
      </Link>
      <Link to="/wallet" className="LoggedMenu__item" onClick={toggleMenu}>
        <FormattedMessage id="wallet" defaultMessage="Wallet" />
      </Link>
      <Link
        to="/object/oul-investarena/menu#qjr-investarena-q-and-a"
        className="LoggedMenu__item"
        onClick={toggleMenu}
      >
        <FormattedMessage id="about" defaultMessage="About" />
      </Link>
      <div className="LoggedMenu__item logPanel pt2" onClick={onLogout} role="presentation">
        <FormattedMessage id="logout" defaultMessage="Logout" />
      </div>
    </React.Fragment>
  );

  const loggedOutMenu = (
    <React.Fragment>
      <Link to="/" className="LoggedMenu__item" onClick={toggleMenu}>
        <FormattedMessage id="home" defaultMessage="Home" />
      </Link>
      <Link to="/discover-objects/crypto" className="LoggedMenu__item" onClick={toggleMenu}>
        <FormattedMessage id="discover" defaultMessage="Discover" />
      </Link>
      <Link
        to="/object/oul-investarena/menu#qjr-investarena-q-and-a"
        className="LoggedMenu__item"
        onClick={toggleMenu}
      >
        <FormattedMessage id="about" defaultMessage="About" />
      </Link>
      <div className="LoggedMenu__item logPanel">
        <LoggedOutButtons location={location} searchBarActive={searchBarActive} isMobile />
      </div>
    </React.Fragment>
  );
  return <div className="LoggedMenu">{username ? loggedInMenu : loggedOutMenu}</div>;
};

LoggedMenuMobile.propTypes = {
  username: PropTypes.string.isRequired,
  toggleMenu: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  location: PropTypes.shape().isRequired,
  searchBarActive: PropTypes.bool.isRequired,
};

export default LoggedMenuMobile;

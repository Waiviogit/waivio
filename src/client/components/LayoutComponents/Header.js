import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Topnav from '../Navigation/Topnav';
import WebsiteHeader from '../../websites/WebsiteLayoutComponents/Header/WebsiteHeader';
import { getAuthenticatedUserName, getMainPage, getCurrPage, getObject } from '../../reducers';

const Header = ({ mainPage, username, currPage, wobject }) => {
  switch (mainPage) {
    case 'dining':
      return <WebsiteHeader currPage={currPage} wobj={wobject} />;

    default:
      return <Topnav username={username} />;
  }
};

Header.propTypes = {
  mainPage: PropTypes.string.isRequired,
  currPage: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  wobject: PropTypes.shape({}).isRequired,
};

export default connect(state => ({
  username: getAuthenticatedUserName(state),
  mainPage: getMainPage(state),
  currPage: getCurrPage(state),
  wobject: getObject(state),
}))(Header);

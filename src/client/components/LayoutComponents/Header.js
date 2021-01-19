import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Topnav from '../Navigation/Topnav';
import WebsiteHeader from '../../websites/WebsiteLayoutComponents/Header/WebsiteHeader';
import {
  getAuthenticatedUserName,
  getMainPage,
  getCurrPage,
  getObject,
  getWebsiteConfiguration,
} from '../../reducers';

const Header = ({ mainPage, username, currPage, wobject, configuration }) => {
  switch ('mainPage') {
    case 'dining':
      return <WebsiteHeader currPage={currPage} wobj={wobject} config={configuration} />;

    default:
      return <Topnav username={username} />;
  }
};

Header.propTypes = {
  mainPage: PropTypes.string.isRequired,
  currPage: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  wobject: PropTypes.shape({}).isRequired,
  configuration: PropTypes.shape({}).isRequired,
};

export default connect(state => ({
  username: getAuthenticatedUserName(state),
  mainPage: getMainPage(state),
  currPage: getCurrPage(state),
  wobject: getObject(state),
  configuration: getWebsiteConfiguration(state),
}))(Header);

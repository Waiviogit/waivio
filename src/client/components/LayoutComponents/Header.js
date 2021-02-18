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

const Header = ({ username, currPage, wobject, configuration }) => {
  if (typeof location !== 'undefined' && location.hostname.includes('dining') || typeof location !== 'undefined' && location.hostname.includes('localhost'))
    return <WebsiteHeader currPage={currPage} wobj={wobject} config={configuration} />;

  return <Topnav username={username} />;
};

Header.propTypes = {
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

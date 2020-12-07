import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Topnav from '../Navigation/Topnav';
import WebsiteHeader from '../../websites/WebsiteLayoutComponents/Header/WebsiteHeader';
import { getAuthenticatedUserName, getMainPage } from '../../reducers';

const Header = ({ currPage, username }) => {
  switch ('dining') {
    case 'dining':
      return <WebsiteHeader />;

    default:
      return <Topnav username={username} />;
  }
};

Header.propTypes = {
  currPage: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};

export default connect(state => ({
  username: getAuthenticatedUserName(state),
  currPage: getMainPage(state),
}))(Header);

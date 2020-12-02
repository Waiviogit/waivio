import React from 'react';
import PropTypes from 'prop-types';

import Topnav from '../Navigation/Topnav';
import WebsiteHeader from '../../websites/WebsiteLayoutComponents/WebsiteHeader';

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

export default Header;

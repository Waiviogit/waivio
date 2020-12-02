import React from 'react';
import PropTypes from 'prop-types';

import Topnav from '../Navigation/Topnav';
import HeaderButtons from '../HeaderButton/HeaderButton';

const Header = ({ currPage, username }) => {
  switch (currPage) {
    case 'dining':
      return <HeaderButtons />;

    default:
      return <Topnav username={username} />;
  }
};

Header.propTypes = {
  currPage: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};

export default Header;

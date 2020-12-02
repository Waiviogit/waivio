import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import HeaderButton from '../../components/HeaderButton/HeaderButton';
import WebsiteSearch from '../../search/WebsitesSearch/WebsiteSearch';

import './WebsiteHeader.less';

const WebsiteHeader = ({ location }) => {
  const isMainPage = location.pathname === '/';

  return (<div className="WebsiteHeader">
    <div className="topnav-layout">
      {isMainPage
        ? <WebsiteSearch/>
        : <Link className="WebsiteHeader__link" to={'/'}>{'< Back'}</Link>
      }
      <div className="right">
        <HeaderButton/>
      </div>
    </div>
  </div>)
};

WebsiteHeader.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  // username: PropTypes.string.isRequired,
};

export default withRouter(WebsiteHeader);

import React from 'react';
import PropTypes from 'prop-types';
import HeaderButton from '../../components/HeaderButton/HeaderButton';
import WebsiteSearch from '../../search/WebsitesSearch/WebsiteSearch';

import './WebsiteHeader.less';

const WebsiteHeader = ({ currPage, username }) => {
  return (
    <div className="WebsiteHeader">
      <div className="topnav-layout">
        <WebsiteSearch />
        <div className="right">
          <HeaderButton />
        </div>
      </div>
    </div>
  );
};

WebsiteHeader.propTypes = {
  currPage: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};

export default WebsiteHeader;

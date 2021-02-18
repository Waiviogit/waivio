import React from 'react';
import PropTypes from 'prop-types';

import Page from '../../feed/Page';
import WebsiteBody from '../../websites/WebsiteLayoutComponents/Body/WebsiteBody';

const MainBody = ({ route }) => {
  let hostname = '';

  if (typeof location !== 'undefined') {
    hostname = location.hostname;
  }

  hostname.includes('dining');
  if (location.hostname.includes('dining') || location.hostname.includes('localhost'))
    return <WebsiteBody />;

  return <Page route={route} />;
};

MainBody.propTypes = {
  route: PropTypes.shape({}).isRequired,
};

export default MainBody;

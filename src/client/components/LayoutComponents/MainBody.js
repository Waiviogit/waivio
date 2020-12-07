import React from 'react';
import PropTypes from 'prop-types';

import Page from '../../feed/Page';
import WebsiteBody from '../../websites/WebsiteLayoutComponents/Body/WebsiteBody';

const MainBody = ({ currPage, route }) => {
  switch ('dining') {
    case 'dining':
      return <WebsiteBody />;

    default:
      return <Page route={route} />;
  }
};

MainBody.propTypes = {
  currPage: PropTypes.string.isRequired,
  route: PropTypes.shape({}).isRequired,
};

export default MainBody;

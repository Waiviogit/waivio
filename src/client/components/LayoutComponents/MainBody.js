import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Page from '../../feed/Page';
import WebsiteBody from '../../websites/WebsiteLayoutComponents/Body/WebsiteBody';
import { getMainPage } from '../../reducers';

const MainBody = ({ currPage, route }) => {
  switch ('currPage') {
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

export default connect(state => ({
  currPage: getMainPage(state),
}))(MainBody);

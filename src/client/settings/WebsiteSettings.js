import React from 'react';
import { renderRoutes } from 'react-router-config';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import './Settings.less';

const WebsiteSettings = ({ route }) => {
  return <div className="center">{renderRoutes(route.routes)}</div>;
};

WebsiteSettings.propTypes = {
  route: PropTypes.shape({
    routes: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default injectIntl(WebsiteSettings);

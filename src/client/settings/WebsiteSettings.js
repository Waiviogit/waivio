import React from 'react';
import Helmet from 'react-helmet';
import { renderRoutes } from 'react-router-config';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import MobileNavigation from '../components/Navigation/MobileNavigation/MobileNavigation';
import { getWebsiteSettingsTitle } from './common/helpers';

import './Settings.less';

const WebsiteSettings = ({ route, intl, match }) => (
  <div className="shifted">
    <Helmet>
      <title>
        {intl.formatMessage(getWebsiteSettingsTitle(match))} - {match.params.site} - Waivio
      </title>
    </Helmet>
    <div className="settings-layout container">
      <Affix className="leftContainer" stickPosition={77}>
        <div className="left">
          <LeftSidebar />
        </div>
      </Affix>
      <div className="center">
        <MobileNavigation />
        {renderRoutes(route.routes)}
      </div>
    </div>
  </div>
);

WebsiteSettings.propTypes = {
  route: PropTypes.shape({
    routes: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      0: PropTypes.string,
      site: PropTypes.string,
    }),
  }).isRequired,
};

export default injectIntl( );

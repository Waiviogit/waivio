import React from 'react';
import Helmet from 'react-helmet';
import {renderRoutes} from "react-router-config";
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import MobileNavigation from '../components/Navigation/MobileNavigation/MobileNavigation';
import './Settings.less';

const WebsiteSettings = ({ route }) => (
  <div className="shifted">
    <Helmet>
      <title>
        {/* {intl.formatMessage({ id: 'edit_profile', defaultMessage: 'Edit profile' })} - Waivio */}
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
        <h1>
          <FormattedMessage id="edit_profile" defaultMessage="Edit Profile" />
        </h1>
        {renderRoutes(route.routes)}
      </div>
    </div>
  </div>
);

WebsiteSettings.propTypes = {
  route: PropTypes.shape({
    routes: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
};

export default WebsiteSettings;

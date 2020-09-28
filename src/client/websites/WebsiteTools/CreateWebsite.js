import React from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import Affix from '../../components/Utils/Affix';
import LeftSidebar from '../../app/Sidebar/LeftSidebar';
import MobileNavigation from '../../components/Navigation/MobileNavigation/MobileNavigation';

const CreateWebsite = ({ intl }) => (
  <div className="shifted">
    <Helmet>
      <title>
        {intl.formatMessage({
          id: 'create_new_website',
          defaultMessage: 'Create new website',
        })}{' '}
        - Waivio
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
          <FormattedMessage id="create_new_website" defaultMessage="Create new website" />
        </h1>
        <div className="Settings__section">
          <h3>
            <FormattedMessage
              id="select_website_template"
              defaultMessage="Select website template:"
            />
          </h3>
        </div>
      </div>
    </div>
  </div>
);

CreateWebsite.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(CreateWebsite);

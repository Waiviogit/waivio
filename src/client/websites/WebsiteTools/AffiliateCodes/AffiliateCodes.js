import React, { useEffect } from 'react';
import { withRouter } from 'react-router';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Input } from 'antd';

import {
  addWebAdministrator,
  deleteWebAdministrator,
  getWebAdministrators,
} from '../../../../store/websiteStore/websiteActions';
import {
  getAdministrators,
  getWebsiteLoading,
} from '../../../../store/websiteStore/websiteSelectors';
import { AMAZON_LINKS_BY_COUNTRY } from './constants';

import './AffiliateCodes.less';

export const AffiliateCodes = ({ intl, location }) => {
  // const host = match.params.site;

  useEffect(() => {}, [location.pathname]);

  return (
    <div className="AffiliateCodes">
      <h1>
        <FormattedMessage id="affiliate_codes" defaultMessage="Affiliate codes" />
      </h1>
      <h3 className="AffiliateCodes__title">Amazon</h3>
      <p>
        {intl.formatMessage({
          id: 'amazon_website_serving',
          defaultMessage:
            'A distinct Associate ID is necessary for every Amazon website serving a specific region. The system will automatically link affiliate codes to the geographical location of users, subject to certain limitations.',
        })}
      </p>
      <div className="AffiliateCodes__title">
        {Object.values(AMAZON_LINKS_BY_COUNTRY).map(k => (
          <div key={k}>
            <h3>{k}:</h3>
            <Input />
          </div>
        ))}
      </div>
    </div>
  );
};

AffiliateCodes.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      site: PropTypes.string,
    }),
  }).isRequired,
  location: PropTypes.shape().isRequired,
};

AffiliateCodes.defaultProps = {
  admins: [],
};

export default connect(
  state => ({
    admins: getAdministrators(state),
    isLoading: getWebsiteLoading(state),
  }),
  {
    getWebAdmins: getWebAdministrators,
    addWebAdmins: addWebAdministrator,
    deleteWebAdmins: deleteWebAdministrator,
  },
)(withRouter(injectIntl(AffiliateCodes)));

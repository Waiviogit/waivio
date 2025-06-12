import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import './WebsitePricing.less';

const WebsitePricing = ({ intl }) => (
  <div className={'WebsitePricing'}>
    <h1>
      {intl.formatMessage({
        id: 'website_hosting_pricing',
        defaultMessage: 'Website hosting pricing',
      })}
    </h1>
    <div className={'WebsitePricing__padding'}>
      <h3 className="WebsitePricing__title">
        {intl.formatMessage({
          id: 'active_website_pricing',
          defaultMessage: 'Active website pricing:',
        })}
      </h3>
      <div>
        <span className="WebsitePricing__dot">&bull;</span>
        {intl.formatMessage({ id: 'one_dollar_per_day_price', defaultMessage: '1 USD per day' })}.
      </div>
    </div>
    <div className={'WebsitePricing__padding'}>
      <h3 className="WebsitePricing__title">
        {intl.formatMessage({
          id: 'inactive_website_pricing',
          defaultMessage: 'Inactive website pricing:',
        })}
      </h3>
      <div>
        <span className="WebsitePricing__dot">&bull;</span>
        {intl.formatMessage({ id: 'two_cent_per_day', defaultMessage: '0.2 USD per day' })}.
      </div>
    </div>
    <p>
      {intl.formatMessage({
        id: 'manage_website_info_dau',
        defaultMessage:
          'Daily Active Users (DAU) refers to the total number of website visitors that interact with either the desktop or mobile version of the site from a single device or browser. Users accessing the website via multiple devices or browsers will be counted multiple times.',
      })}
    </p>
  </div>
);

WebsitePricing.propTypes = {
  intl: PropTypes.shape(),
};

export default injectIntl(WebsitePricing);

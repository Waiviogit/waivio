import React, { useEffect } from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'lodash';

import Affix from '../../../components/Utils/Affix';
import LeftSidebar from '../../../app/Sidebar/LeftSidebar';
import MobileNavigation from '../../../components/Navigation/MobileNavigation/MobileNavigation';
import { getAuthenticatedUserName, getManage, getWebsiteLoading } from '../../../reducers';
import { getManageInfo } from '../../websiteActions';

import './ManageWebsite.less';

const ManageWebsite = props => {
  useEffect(() => {
    props.getManageInfo(props.userName);
  }, []);
  const { prices } = props.manageInfo;

  return (
    <div className="shifted">
      <Helmet>
        <title>
          {props.intl.formatMessage({
            id: 'manage_website',
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
        <div className="center ManageWebsites">
          <MobileNavigation />
          <h1>
            <FormattedMessage id="website_management" defaultMessage="Websites management" />
          </h1>
          <div>
            <h3>
              {props.intl.formatMessage({
                id: 'prices',
                defaultMessage: 'Prices',
              })}
            </h3>
              <div>&bull;
                {props.intl.formatMessage({
                  id: 'prices_per_active_user',
                  defaultMessage: '{price} HBD per day per active user;'
                  },
                  {price: get(prices, 'perUser', 0)}
                )}
              </div>
              <div>&bull;
                {props.intl.formatMessage({
                  id: 'prices_min_value',
                  defaultMessage: 'Minimum {price} HBD per day.'},
                  {
                    price: get(prices, 'minimumValue', 0)
                  }
                )}
              </div>
            <p>
              Daily active users (DAU) is the total number of website visitors that engage with the desktop or mobile version of the site from a single device or a browser. The user who visits the website using multiple devices or browsers will be counted multiple times.
            </p>
          </div>
          <div>
            <h3>
              {props.intl.formatMessage({
                id: 'manage_account_balance',
                defaultMessage: 'Account balance (HBD)',
              })}
            </h3>
              <div>&bull;
                {props.intl.formatMessage({
                  id: 'prices_per_active_user',
                  defaultMessage: '{price} HBD per day per active user;'
                  },
                  {price: get(prices, 'perUser', 0)}
                )}
              </div>
              <div>&bull;
                {props.intl.formatMessage({
                  id: 'prices_min_value',
                  defaultMessage: 'Minimum {price} HBD per day.'},
                  {
                    price: get(prices, 'minimumValue', 0)
                  }
                )}
              </div>
            <p>
              Daily active users are averaged over the last 7 days.
              ** If the account balance becomes negative, all websites will be suspended. The user is responsible for ensuring that the account balance remains positive. The estimate of the Days remaining is based on the current website usage and is subject to change.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

ManageWebsite.propTypes = {
  intl: PropTypes.shape().isRequired,
  loading: PropTypes.bool.isRequired,
  getManageInfo: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
  manageInfo: PropTypes.shape({
    prices: PropTypes.shape({
      perUser: PropTypes.number,
      minimumValue: PropTypes.number,
    })
  }).isRequired,
};

ManageWebsite.defaultProps = {
  manageInfo: {},
};

export default connect(
  state => ({
    loading: getWebsiteLoading(state),
    userName: getAuthenticatedUserName(state),
    manageInfo: getManage(state),
  }),
  {
    getManageInfo,
  },
)(injectIntl(ManageWebsite));

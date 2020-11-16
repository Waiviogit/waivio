import React, { useEffect } from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get, isEmpty } from 'lodash';
import { Button } from 'antd';

import Affix from '../../../components/Utils/Affix';
import DynamicTbl from '../../../components/Tools/DynamicTable/DynamicTable';
import LeftSidebar from '../../../app/Sidebar/LeftSidebar';
import MobileNavigation from '../../../components/Navigation/MobileNavigation/MobileNavigation';

import { getAuthenticatedUserName, getManage, getWebsiteLoading } from '../../../reducers';
import {
  activateWebsite,
  deleteWebsite,
  getManageInfo,
  suspendWebsite,
} from '../../websiteActions';
import {
  configBalanceTableHeader,
  configUsersWebsitesTableHeader,
} from '../../constants/tableConfig';
import Loading from '../../../components/Icon/Loading';
import { openTransfer } from '../../../wallet/walletActions';
import Transfer from '../../../wallet/Transfer/Transfer';

import './ManageWebsite.less';

export const ManageWebsite = props => {
  const { prices, accountBalance, websites, dataForPayments } = props.manageInfo;

  useEffect(() => {
    props.getManageInfo(props.userName);
  }, []);

  const onChangeCheckbox = (e, item) => {
    const appId = get(item, 'host');

    if (e.target.checked) {
      props.activateWebsite(appId);
    } else {
      props.suspendWebsite(appId);
    }
  };

  const handleClickPayNow = () =>
    props.openTransfer(get(dataForPayments, ['user', 'name']), 0, 'HBD', dataForPayments.memo);

  return (
    <div className="shifted">
      <Helmet>
        <title>
          {props.intl.formatMessage({
            id: 'manage_website',
            defaultMessage: 'Website management',
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
        {isEmpty(props.manageInfo) ? (
          <Loading />
        ) : (
          <div className="center ManageWebsites">
            <MobileNavigation />
            <h1>
              <FormattedMessage id="website_management" defaultMessage="Websites management" />
            </h1>
            <div className="Settings__section">
              <h3 className="ManageWebsites__title">
                {props.intl.formatMessage({
                  id: 'prices',
                  defaultMessage: 'Prices',
                })}
              </h3>
              <div>
                <span className="ManageWebsites__dot">&bull;</span>
                {props.intl.formatMessage(
                  {
                    id: 'prices_per_active_user',
                    defaultMessage: '{price} HBD per day per active user;',
                  },
                  { price: get(prices, 'perUser', 0) },
                )}
              </div>
              <div>
                <span className="ManageWebsites__dot">&bull;</span>
                {props.intl.formatMessage(
                  {
                    id: 'prices_min_value',
                    defaultMessage: 'Minimum {price} HBD per day.',
                  },
                  {
                    price: get(prices, 'minimumValue', 0),
                  },
                )}
              </div>
              <p>
                {props.intl.formatMessage({
                  id: 'manage_website_info_dau',
                  defaultMessage:
                    'Daily active users (DAU) is the total number of website visitors that engage with the desktop or mobile version of the site from a single device or a browser. The user who visits the website using multiple devices or browsers will be counted multiple times.',
                })}
              </p>
            </div>
            <div className="Settings__section">
              <h3 className="ManageWebsites__title">
                {props.intl.formatMessage({
                  id: 'manage_account_balance',
                  defaultMessage: 'Account balance (HBD)',
                })}
                <Button
                  onClick={handleClickPayNow}
                  type="primary"
                  className="ManageWebsites__btn-pay"
                >
                  {props.intl.formatMessage({
                    id: 'pay_now',
                    defaultMessage: 'Pay now',
                  })}
                </Button>
              </h3>
              <DynamicTbl header={configBalanceTableHeader} bodyConfig={[accountBalance]} />
              <p>
                {props.intl.formatMessage({
                  id: 'manage_website_info_dau_averaged',
                  defaultMessage: 'Daily active users are averaged over the last 7 days.',
                })}
              </p>
              <p>
                {props.intl.formatMessage({
                  id: 'manage_website_info_account_balance',
                  defaultMessage:
                    '** If the account balance becomes negative, all websites will be suspended. The user is responsible for ensuring that the account balance remains positive. The estimate of the Days remaining is based on the current website usage and is subject to change.',
                })}
              </p>
            </div>
            <div className="Settings__section">
              <h3 className="ManageWebsites__title">
                {props.intl.formatMessage({
                  id: 'websites',
                  defaultMessage: 'Websites',
                })}
              </h3>
              <DynamicTbl
                header={configUsersWebsitesTableHeader}
                bodyConfig={websites}
                onChange={onChangeCheckbox}
                deleteItem={props.deleteWebsite}
              />
            </div>
          </div>
        )}
      </div>
      <Transfer />
    </div>
  );
};

ManageWebsite.propTypes = {
  intl: PropTypes.shape().isRequired,
  getManageInfo: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
  manageInfo: PropTypes.shape({
    accountBalance: PropTypes.shape(),
    prices: PropTypes.shape({
      perUser: PropTypes.number,
      minimumValue: PropTypes.number,
    }),
    websites: PropTypes.arrayOf(PropTypes.shape()),
    dataForPayments: PropTypes.shape({
      memo: PropTypes.string,
    }),
  }).isRequired,
  activateWebsite: PropTypes.func.isRequired,
  suspendWebsite: PropTypes.func.isRequired,
  openTransfer: PropTypes.func.isRequired,
  deleteWebsite: PropTypes.func.isRequired,
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
    activateWebsite,
    suspendWebsite,
    openTransfer,
    deleteWebsite,
  },
)(injectIntl(ManageWebsite));

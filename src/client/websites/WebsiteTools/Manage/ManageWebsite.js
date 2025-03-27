import React, { useEffect, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get, has, isEmpty, round } from 'lodash';
import { Button, message, Modal } from 'antd';
import { Link } from 'react-router-dom';

import DynamicTbl from '../../../components/Tools/DynamicTable/DynamicTable';
import {
  activateWebsite,
  deleteWebsite,
  getManageInfo,
  setWebsiteCanonical,
  suspendWebsite,
} from '../../../../store/websiteStore/websiteActions';
import {
  configBalanceTableHeader,
  configUsersWebsitesTableHeader,
} from '../../constants/tableConfig';
import Loading from '../../../components/Icon/Loading';
import { openTransfer } from '../../../../store/walletStore/walletActions';
import Transfer from '../../../wallet/Transfer/Transfer';
import { getAuthenticatedUserName, isGuestUser } from '../../../../store/authStore/authSelectors';
import { getManage, getWebsiteLoading } from '../../../../store/websiteStore/websiteSelectors';
import { parseJSON } from '../../../../common/helpers/parseJSON';
import { getCurrentCurrency } from '../../../../store/appStore/appSelectors';

import './ManageWebsite.less';
import { setAffiliateObjects } from '../../../../store/affiliateCodes/affiliateCodesActions';
import { getAffiliateObjects } from '../../../../store/affiliateCodes/affiliateCodesSelectors';
import { affiliateCodeVoteAppend } from '../../../../store/appendStore/appendActions';

export const ManageWebsite = props => {
  const { prices, accountBalance, websites, dataForPayments } = props.manageInfo;
  const [modalState, setModalState] = useState({});
  const hasSubscription = modalState?.hostInfo?.billingType === 'paypal_subscription';

  useEffect(() => {
    props.getManageInfo(props.userName);
  }, []);
  useEffect(() => {
    if (modalState.visible) {
      props.setAffiliateObjects(props.userName, modalState.hostInfo.host);
    }
  }, [modalState.visible]);

  const onChangeCheckbox = (e, item) => {
    const appId = get(item, 'host');

    if (e.target.checked) props.activateWebsite(appId);
    else props.suspendWebsite(appId);
  };
  const onChangeRadio = (e, item) => {
    const appId = get(item, 'host');

    props.setWebsiteCanonical(appId);
  };

  const handleClickPayNow = () => {
    let memo = props.isGuest ? get(dataForPayments, 'guestMemo') : get(dataForPayments, 'memo');

    memo = props.isGuest ? '' : parseJSON(memo);

    props.openTransfer(get(dataForPayments, ['user', 'name']), 0, 'WAIV', memo);
  };

  const rejectAffiliateCodes = () => {
    if (!isEmpty(props.affiliateObjects)) {
      props.affiliateObjects.forEach(obj => {
        if (has(obj, 'affiliateCode')) {
          const currUpdates = obj.affiliateCodeFields?.reduce((acc, val) => {
            if (val.name === 'affiliateCode') {
              if (val.approvePercent > 0) {
                // eslint-disable-next-line no-param-reassign
                acc = [...acc, val];
              }
            }

            return acc;
          }, []);

          currUpdates.forEach(update =>
            props.affiliateCodeVoteAppend(
              update.author,
              obj.author_permlink,
              update.permlink,
              1,
              props.userName,
              modalState.hostInfo.host,
            ),
          );
        }
      });
    }
  };

  return (
    <div className="shifted">
      {isEmpty(props.manageInfo) ? (
        <Loading />
      ) : (
        <div className="center ManageWebsites">
          <h1>
            <FormattedMessage id="website_management" defaultMessage="Websites management" />
          </h1>
          <div className="Settings__section">
            <h3 className="ManageWebsites__title">
              {props.intl.formatMessage({
                id: 'active_website_pricing',
                defaultMessage: 'Active website pricing:',
              })}
            </h3>
            <div>
              <span className="ManageWebsites__dot">&bull;</span>
              {props.intl.formatMessage(
                {
                  id: 'prices_per_active_user_usd',
                  defaultMessage: '{price} {currency} per day per active user;',
                },
                {
                  price: round(get(prices, 'perUser', 0) * props.currencyInfo.rate, 3),
                  currency: props.currencyInfo.type,
                },
              )}
            </div>
            <div>
              <span className="ManageWebsites__dot">&bull;</span>
              {props.intl.formatMessage(
                {
                  id: 'prices_min_value_usd',
                  defaultMessage: 'Minimum {price} {currency} per day.',
                },
                {
                  price: round(get(prices, 'minimumValue', 0) * props.currencyInfo.rate, 3),
                  currency: props.currencyInfo.type,
                },
              )}
            </div>
            <h3 className="ManageWebsites__title">
              {props.intl.formatMessage({
                id: 'inactive_website_pricing',
                defaultMessage: 'Inactive website pricing:',
              })}
            </h3>
            <div>
              <span className="ManageWebsites__dot">&bull;</span>
              {props.intl.formatMessage(
                {
                  id: 'prices_per_day_usd',
                  defaultMessage: '{price} {currency} per day.',
                },
                {
                  price: round(get(prices, 'perSuspended', 0) * props.currencyInfo.rate, 3),
                  currency: props.currencyInfo.type,
                },
              )}
            </div>
            <p>
              {props.intl.formatMessage({
                id: 'manage_website_info_dau',
                defaultMessage:
                  'Daily Active Users (DAU) refers to the total number of website visitors that interact with either the desktop or mobile version of the site from a single device or browser. Users accessing the website via multiple devices or browsers will be counted multiple times.',
              })}
            </p>
          </div>
          <div className="Settings__section">
            <h3 className="ManageWebsites__title">
              {props.intl.formatMessage(
                {
                  id: 'manage_account_balance_usd',
                  defaultMessage: 'Account balance ({currency})',
                },
                {
                  currency: props.currencyInfo.type,
                },
              )}
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
            <DynamicTbl
              header={configBalanceTableHeader(props.currencyInfo.type)}
              bodyConfig={[
                {
                  ...accountBalance,
                  dailyCost: round(accountBalance.dailyCost * props.currencyInfo.rate, 3),
                  paid: round(accountBalance.paid * props.currencyInfo.rate, 3),
                },
              ]}
            />
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
              onChangeRadio={onChangeRadio}
              deleteItem={hostInfo => setModalState({ visible: true, hostInfo })}
              emptyTitle={props.intl.formatMessage({
                id: 'manage_website_empty_table',
                defaultMessage: "You don't have any websites.",
              })}
            />
            <button className="ManageWebsites__button">
              <Link to={`/create`}>
                {props.intl.formatMessage({
                  id: 'create_website',
                  defaultMessage: 'Create new website',
                })}{' '}
              </Link>
            </button>
          </div>
        </div>
      )}
      <Transfer manageWebsites />
      <Modal
        visible={modalState.visible}
        title={props.intl.formatMessage(
          {
            id: 'delete_website_modal_title',
            defaultMessage: 'Delete {host} website',
          },
          {
            host: get(modalState, ['hostInfo', 'host'], ''),
          },
        )}
        onCancel={!hasSubscription ? () => setModalState({}) : undefined}
        // onOk={() => {
        //   rejectAffiliateCodes();
        //   props.deleteWebsite(modalState.hostInfo).then(res => {
        //     if (res.message)
        //       message.error(
        //         props.intl.formatMessage({
        //           id: 'insufficient_balance',
        //           defaultMessage: 'Insufficient funds on the balance sheet.',
        //         }),
        //       );
        //   });
        //   setModalState({
        //     visible: false,
        //   });
        // }}
        footer={[
          !hasSubscription && (
            <Button key="cancel" onClick={() => setModalState({})}>
              Cancel
            </Button>
          ),
          <Button
            key="ok"
            type="primary"
            // eslint-disable-next-line consistent-return
            onClick={() => {
              if (hasSubscription) {
                return setModalState({});
              }
              rejectAffiliateCodes();
              props.deleteWebsite(modalState.hostInfo).then(res => {
                if (res.message)
                  message.error(
                    props.intl.formatMessage({
                      id: 'insufficient_balance',
                      defaultMessage: 'Insufficient funds on the balance sheet.',
                    }),
                  );
              });
              setModalState({
                visible: false,
              });
            }}
          >
            OK
          </Button>,
        ].filter(Boolean)}
      >
        {hasSubscription
          ? 'We regret to inform you that your site cannot be deleted due to an active subscription. To proceed with the deletion, please cancel your subscription first and wait until the current billing period has ended.'
          : props.intl.formatMessage({
              id: 'delete_website_modal_body',
              defaultMessage:
                'Warning: All configuration data and website pages will be removed. The name of the website will be no longer protected.',
            })}
      </Modal>
    </div>
  );
};

ManageWebsite.propTypes = {
  intl: PropTypes.shape().isRequired,
  currencyInfo: PropTypes.shape({
    type: PropTypes.string,
    rate: PropTypes.number,
  }).isRequired,
  getManageInfo: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
  manageInfo: PropTypes.shape({
    accountBalance: PropTypes.shape(),
    prices: PropTypes.shape({
      perUser: PropTypes.number,
      minimumValue: PropTypes.number,
      perSuspended: PropTypes.number,
    }),
    websites: PropTypes.arrayOf(PropTypes.shape()),
    dataForPayments: PropTypes.shape({
      memo: PropTypes.string,
    }),
  }).isRequired,
  affiliateObjects: PropTypes.arrayOf().isRequired,
  activateWebsite: PropTypes.func.isRequired,
  setWebsiteCanonical: PropTypes.func.isRequired,
  suspendWebsite: PropTypes.func.isRequired,
  openTransfer: PropTypes.func.isRequired,
  deleteWebsite: PropTypes.func.isRequired,
  setAffiliateObjects: PropTypes.func.isRequired,
  affiliateCodeVoteAppend: PropTypes.func.isRequired,
  isGuest: PropTypes.bool.isRequired,
};

ManageWebsite.defaultProps = {
  manageInfo: {},
};

export default connect(
  state => ({
    loading: getWebsiteLoading(state),
    userName: getAuthenticatedUserName(state),
    manageInfo: getManage(state),
    isGuest: isGuestUser(state),
    currencyInfo: getCurrentCurrency(state),
    affiliateObjects: getAffiliateObjects(state),
  }),
  {
    getManageInfo,
    activateWebsite,
    setWebsiteCanonical,
    suspendWebsite,
    openTransfer,
    deleteWebsite,
    setAffiliateObjects,
    affiliateCodeVoteAppend,
  },
)(injectIntl(ManageWebsite));

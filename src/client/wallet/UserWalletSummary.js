import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedMessage, FormattedNumber, FormattedTime } from 'react-intl';
import formatter from '../helpers/steemitFormatter';
import {
  calculateEstAccountValue,
  calculatePendingWithdrawalSP,
  calculateTotalDelegatedSP,
} from '../vendor/steemitHelpers';
import BTooltip from '../components/BTooltip';
import Loading from '../components/Icon/Loading';
import USDDisplay from '../components/Utils/USDDisplay';
import CurrencyItem from './CurrencyItem/CurrencyItem';

import './UserWalletSummary.less';

const getFormattedTotalDelegatedSP = (user, totalVestingShares, totalVestingFundSteem) => {
  const totalDelegatedSP = calculateTotalDelegatedSP(
    user,
    totalVestingShares,
    totalVestingFundSteem,
  );

  if (totalDelegatedSP !== 0) {
    return (
      <BTooltip
        title={
          <span>
            <FormattedMessage
              id="steem_power_delegated_to_account_tooltip"
              defaultMessage="Steem Power delegated to this account"
            />
          </span>
        }
      >
        <span>
          {totalDelegatedSP > 0 ? ' (+' : ' ('}
          <FormattedNumber
            value={calculateTotalDelegatedSP(user, totalVestingShares, totalVestingFundSteem)}
          />
          {')'}
        </span>
      </BTooltip>
    );
  }

  return null;
};

const getFormattedPendingWithdrawalSP = (user, totalVestingShares, totalVestingFundSteem) => {
  const pendingWithdrawalSP = calculatePendingWithdrawalSP(
    user,
    totalVestingShares,
    totalVestingFundSteem,
  );

  if (pendingWithdrawalSP !== 0) {
    return (
      <BTooltip
        title={
          <span>
            <FormattedMessage
              id="steem_power_pending_withdrawal_tooltip"
              defaultMessage="The next power down is scheduled to happen on "
            />
            <FormattedDate value={`${user.next_vesting_withdrawal}Z`} />{' '}
            <FormattedTime value={`${user.next_vesting_withdrawal}Z`} />
          </span>
        }
      >
        <span>
          {' - '}
          <FormattedNumber value={pendingWithdrawalSP} />
        </span>
      </BTooltip>
    );
  }

  return null;
};

const UserWalletSummary = ({
  user,
  balance,
  loading,
  totalVestingShares,
  totalVestingFundSteem,
  loadingGlobalProperties,
  steemRate,
  sbdRate,
  steemRateLoading,
  isGuest,
  beaxyBalance,
  showMore,
  isShowMore,
}) => (
  <React.Fragment>
    {!!beaxyBalance.length && (
      <React.Fragment>
        <div className="UserWalletSummary">
          {beaxyBalance.map(item => (
            <CurrencyItem item={item} />
          ))}
        </div>
        <div className="UserWalletSummary__show-more">
          <div className="UserWalletSummary__show-more-btn" onClick={showMore} role="presentation">
            {!isShowMore ? (
              <FormattedMessage id="show_more" defaultMessage="Show more" />
            ) : (
              <FormattedMessage id="show_less" defaultMessage="View less" />
            )}
          </div>
        </div>
      </React.Fragment>
    )}
    <div className="UserWalletSummary">
      <div className="UserWalletSummary__item">
        <i className="iconfont icon-steem UserWalletSummary__icon" />
        <div className="UserWalletSummary__label">
          <FormattedMessage id="steem" defaultMessage="Steem" />
        </div>
        <div className="UserWalletSummary__value">
          {loading ? (
            <Loading />
          ) : (
            <span>
              <FormattedNumber value={balance ? parseFloat(balance) : 0} />
              {' HIVE'}
            </span>
          )}
        </div>
      </div>
      {!isGuest && (
        <React.Fragment>
          <div className="UserWalletSummary__item">
            <i className="iconfont icon-flashlight_fill UserWalletSummary__icon" />
            <div className="UserWalletSummary__label">
              <FormattedMessage id="steem_power" defaultMessage="Steem Power" />
            </div>
            <div className="UserWalletSummary__value">
              {loading || loadingGlobalProperties ? (
                <Loading />
              ) : (
                <span>
                  <FormattedNumber
                    value={parseFloat(
                      formatter.vestToSteem(
                        user.vesting_shares,
                        totalVestingShares,
                        totalVestingFundSteem,
                      ),
                    )}
                  />
                  {getFormattedPendingWithdrawalSP(user, totalVestingShares, totalVestingFundSteem)}
                  {getFormattedTotalDelegatedSP(user, totalVestingShares, totalVestingFundSteem)}
                  {' HP'}
                </span>
              )}
            </div>
          </div>
          <div className="UserWalletSummary__item">
            <i className="iconfont icon-Dollar UserWalletSummary__icon" />
            <div className="UserWalletSummary__label">
              <FormattedMessage id="steem_dollar" defaultMessage="Steem Dollar" />
            </div>
            <div className="UserWalletSummary__value">
              {loading ? (
                <Loading />
              ) : (
                <span>
                  <FormattedNumber value={parseFloat(user.sbd_balance)} />
                  {' HBD'}
                </span>
              )}
            </div>
          </div>
          <div className="UserWalletSummary__item">
            <i className="iconfont icon-savings UserWalletSummary__icon" />
            <div className="UserWalletSummary__label">
              <FormattedMessage id="savings" defaultMessage="Savings" />
            </div>
            <div className="UserWalletSummary__value">
              {loading ? (
                <Loading />
              ) : (
                <span>
                  <FormattedNumber value={parseFloat(user.savings_balance)} />
                  {' HIVE, '}
                  <FormattedNumber value={parseFloat(user.savings_sbd_balance)} />
                  {' HBD'}
                </span>
              )}
            </div>
          </div>
        </React.Fragment>
      )}
      {!isGuest && !(loading || loadingGlobalProperties || steemRateLoading) && (
        <div className="UserWalletSummary__item">
          <i className="iconfont icon-people_fill UserWalletSummary__icon" />
          <div className="UserWalletSummary__label">
            <FormattedMessage id="est_account_value" defaultMessage="Est. Account Value" />
          </div>
          <div className="UserWalletSummary__value">
            {loading || loadingGlobalProperties || steemRateLoading ? (
              <Loading />
            ) : (
              <USDDisplay
                value={calculateEstAccountValue(
                  user,
                  totalVestingShares,
                  totalVestingFundSteem,
                  steemRate,
                  sbdRate,
                )}
              />
            )}
          </div>
        </div>
      )}
    </div>
  </React.Fragment>
);

UserWalletSummary.propTypes = {
  loadingGlobalProperties: PropTypes.bool.isRequired,
  user: PropTypes.shape().isRequired,
  balance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  totalVestingShares: PropTypes.string.isRequired,
  totalVestingFundSteem: PropTypes.string.isRequired,
  steemRate: PropTypes.number,
  sbdRate: PropTypes.number,
  loading: PropTypes.bool,
  steemRateLoading: PropTypes.bool,
  isGuest: PropTypes.bool,
  beaxyBalance: PropTypes.arrayOf(PropTypes.shape()),
  showMore: PropTypes.func,
};

UserWalletSummary.defaultProps = {
  steemRate: 1,
  sbdRate: 1,
  loading: false,
  steemRateLoading: false,
  isGuest: false,
  balance: 0,
  beaxyBalance: [],
  isShowMore: false,
  showMore: () => {},
};

export default UserWalletSummary;

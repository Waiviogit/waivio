import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedNumber, FormattedDate, FormattedTime } from 'react-intl';
import formatter from '../helpers/steemitFormatter';
import {
  calculateTotalDelegatedSP,
  calculateEstAccountValue,
  calculatePendingWithdrawalSP,
} from '../vendor/steemitHelpers';
import BTooltip from '../components/BTooltip';
import Loading from '../components/Icon/Loading';
import USDDisplay from '../components/Utils/USDDisplay';
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
              defaultMessage="Hive Power delegated to this account"
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
  loading,
  totalVestingShares,
  totalVestingFundSteem,
  loadingGlobalProperties,
  steemRate,
  sbdRate,
  steemRateLoading,
  isGuest,
}) => {
  const estAccValue = isGuest ? (
    <USDDisplay value={user.balance * steemRate} />
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
  );

  return (
    <div className="UserWalletSummary">
      <div className="UserWalletSummary__item">
        <img
          className="UserWalletSummary__icon hive"
          src="/images/icons/logo-hive-wallet.svg"
          alt="hive"
        />
        <div className="UserWalletSummary__label">
          <FormattedMessage id="hive" defaultMessage="Hive" />
        </div>
        <div className="UserWalletSummary__value">
          {loading ? (
            <Loading />
          ) : (
            <span>
              <FormattedNumber value={user.balance ? parseFloat(user.balance) : 0} />
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
              <FormattedMessage id="steem_power" defaultMessage="Hive Power" />
            </div>
            <div className="UserWalletSummary__value">
              {loading || loadingGlobalProperties ? (
                <Loading />
              ) : (
                <span className={`${user.to_withdraw ? 'red' : ''}`}>
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
              <FormattedMessage id="steem_dollar" defaultMessage="Hive Dollar" />
            </div>
            <div className="UserWalletSummary__value">
              {loading ? (
                <Loading />
              ) : (
                <span>
                  <FormattedNumber value={parseFloat(user.hbd_balance)} />
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
                  <FormattedNumber value={parseFloat(user.savings_hbd_balance)} />
                  {' HBD'}
                </span>
              )}
            </div>
          </div>
        </React.Fragment>
      )}
      {!(loading || loadingGlobalProperties || steemRateLoading) && (
        <div className="UserWalletSummary__item">
          <i className="iconfont icon-people_fill UserWalletSummary__icon" />
          <div className="UserWalletSummary__label">
            <FormattedMessage id="est_account_value" defaultMessage="Est. Account Value" />
          </div>
          <div className="UserWalletSummary__value">{estAccValue || 0}</div>
        </div>
      )}
    </div>
  );
};

UserWalletSummary.propTypes = {
  loadingGlobalProperties: PropTypes.bool.isRequired,
  user: PropTypes.shape().isRequired,
  totalVestingShares: PropTypes.string.isRequired,
  totalVestingFundSteem: PropTypes.string.isRequired,
  steemRate: PropTypes.number,
  sbdRate: PropTypes.number,
  loading: PropTypes.bool,
  steemRateLoading: PropTypes.bool,
  isGuest: PropTypes.bool,
};

UserWalletSummary.defaultProps = {
  steemRate: 1,
  sbdRate: 1,
  loading: false,
  steemRateLoading: false,
  isGuest: false,
};

export default UserWalletSummary;

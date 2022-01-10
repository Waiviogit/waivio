import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { FormattedMessage, FormattedNumber, FormattedDate, FormattedTime } from 'react-intl';

import { getUser } from '../../../store/usersStore/usersSelectors';
import formatter from '../../helpers/steemitFormatter';
import {
  calculateTotalDelegatedSP,
  calculateEstAccountValue,
  calculatePendingWithdrawalSP,
} from '../../vendor/steemitHelpers';
import BTooltip from '../../components/BTooltip';
import Loading from '../../components/Icon/Loading';
import { guestUserRegex } from '../../helpers/regexHelpers';
import WalletSummaryInfo from '../WalletSummaryInfo/WalletSummaryInfo';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
} from '../../../store/authStore/authSelectors';
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
  totalVestingShares,
  totalVestingFundSteem,
  loadingGlobalProperties,
  steemRate,
  sbdRate,
}) => {
  const isGuest = guestUserRegex.test(user.name);
  const estAccValue = isGuest
    ? user.balance * steemRate
    : calculateEstAccountValue(user, totalVestingShares, totalVestingFundSteem, steemRate, sbdRate);

  return (
    <WalletSummaryInfo estAccValue={estAccValue}>
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
          {user.fetching ? (
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
              {user.fetching || loadingGlobalProperties ? (
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
            <div className="UserWalletSummary__label">Hive Backed Dollar</div>
            <div className="UserWalletSummary__value">
              {user.fetching ? (
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
              {user.fetching ? (
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
    </WalletSummaryInfo>
  );
};

UserWalletSummary.propTypes = {
  loadingGlobalProperties: PropTypes.bool.isRequired,
  user: PropTypes.shape().isRequired,
  totalVestingShares: PropTypes.string.isRequired,
  totalVestingFundSteem: PropTypes.string.isRequired,
  steemRate: PropTypes.number,
  sbdRate: PropTypes.number,
};

UserWalletSummary.defaultProps = {
  steemRate: 1,
  sbdRate: 1,
};

export default connect((state, ownProps) => ({
  user:
    ownProps.userName === getAuthenticatedUserName(state)
      ? getAuthenticatedUser(state)
      : getUser(state, ownProps.userName),
}))(withRouter(UserWalletSummary));

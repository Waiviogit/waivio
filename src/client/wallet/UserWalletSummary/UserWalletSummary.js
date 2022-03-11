import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { FormattedMessage, FormattedNumber, FormattedDate, FormattedTime } from 'react-intl';
import { isEmpty } from 'lodash';
import classNames from 'classnames';

import { getUser } from '../../../store/usersStore/usersSelectors';
import formatter from '../../../common/helpers/steemitFormatter';
import {
  calculateTotalDelegatedSP,
  calculateEstAccountValue,
  calculatePendingWithdrawalSP,
} from '../../vendor/steemitHelpers';
import BTooltip from '../../components/BTooltip';
import Loading from '../../components/Icon/Loading';
import { guestUserRegex } from '../../../common/helpers/regexHelpers';
import WalletSummaryInfo from '../WalletSummaryInfo/WalletSummaryInfo';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
} from '../../../store/authStore/authSelectors';
import { getHiveDelegate } from '../../../waivioApi/ApiClient';
import DelegateListModal from '../DelegateModals/DelegateListModal/DelegateListModal';
import { isMobile } from '../../../common/helpers/apiHelpers';
import WalletAction from '../WalletSummaryInfo/components/WalletAction/WalletActions';

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
        {...(isMobile() ? { visible: false } : {})}
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
        {...(isMobile() ? { visible: false } : {})}
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
  const [delegateList, setDeligateList] = useState([]);
  const [recivedList, setRecivedList] = useState([]);
  const [undeligatedList, setUndeligatedList] = useState([]);
  const [visible, setVisible] = useState(false);
  const hasDelegations =
    !isEmpty(delegateList) || !isEmpty(recivedList) || !isEmpty(undeligatedList);
  const powerClassList = classNames('UserWalletSummary__value', {
    'UserWalletSummary__value--cursorPointer': hasDelegations,
  });
  const isGuest = guestUserRegex.test(user.name);
  const estAccValue = isGuest
    ? user.balance * steemRate
    : calculateEstAccountValue(user, totalVestingShares, totalVestingFundSteem, steemRate, sbdRate);
  const setDelegationLists = async () => {
    const lists = await getHiveDelegate(user.name);
    const recivedMapList = lists.received.map(item => ({
      from: item.delegator,
      quantity: formatter.vestToSteem(
        item.vesting_shares,
        totalVestingShares,
        totalVestingFundSteem,
      ),
    }));
    const delegateMapList = lists.delegated.map(item => ({
      to: item.delegatee,
      quantity:
        formatter.vestToSteem(item.vesting_shares, totalVestingShares, totalVestingFundSteem) /
        1000000,
    }));

    const undelegateMapList = lists.expirations.map(item => ({
      to: item.delegator,
      quantity:
        formatter.vestToSteem(item.vesting_shares, totalVestingShares, totalVestingFundSteem) /
        1000000,
    }));

    setDeligateList(delegateMapList);
    setRecivedList(recivedMapList);
    setUndeligatedList(undelegateMapList);
  };

  useEffect(() => {
    if (totalVestingShares && totalVestingFundSteem) setDelegationLists();
  }, [totalVestingShares, totalVestingFundSteem]);

  return (
    <WalletSummaryInfo estAccValue={estAccValue}>
      <div className="UserWalletSummary__itemWrap">
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
        <div className="UserWalletSummary__actions">
          <p className="UserWalletSummary__description">Liquid HIVE tokens</p>
          <WalletAction
            mainKey={'power_up'}
            options={['transfer', 'convert']}
            mainCurrency={'HIVE'}
            swapCurrencyOptions={['SWAP.HIVE']}
          />
        </div>
      </div>
      {!isGuest && (
        <React.Fragment>
          <div className="UserWalletSummary__itemWrap">
            <div className="UserWalletSummary__item">
              <i className="iconfont icon-flashlight_fill UserWalletSummary__icon" />
              <div className="UserWalletSummary__label">
                <FormattedMessage id="steem_power" defaultMessage="Hive Power" />
              </div>
              <div
                className={powerClassList}
                onClick={() => {
                  if (hasDelegations) {
                    setVisible(true);
                  }
                }}
              >
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
                    {getFormattedPendingWithdrawalSP(
                      user,
                      totalVestingShares,
                      totalVestingFundSteem,
                    )}
                    {getFormattedTotalDelegatedSP(user, totalVestingShares, totalVestingFundSteem)}
                    {' HP'}
                  </span>
                )}
              </div>
            </div>
            <div className="UserWalletSummary__actions">
              <p className="UserWalletSummary__description">Staked HIVE tokens</p>
              <WalletAction mainCurrency={'HP'} mainKey={'power_down'} options={['delegate']} />
            </div>
          </div>
          <div className="UserWalletSummary__itemWrap">
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
            <div className="UserWalletSummary__actions">
              <p className="UserWalletSummary__description">A stable coin pegged to USD</p>
              <WalletAction
                mainKey={'transfer'}
                options={['convert']}
                swapCurrencyOptions={['SWAP.HBD']}
                mainCurrency={'HBD'}
              />
            </div>
          </div>
          <div className="UserWalletSummary__itemWrap">
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
          </div>
        </React.Fragment>
      )}
      {hasDelegations && (
        <DelegateListModal
          visible={visible}
          toggleModal={setVisible}
          deligateList={delegateList}
          recivedList={recivedList}
          undeligatedList={undeligatedList}
          symbol={'HP'}
        />
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

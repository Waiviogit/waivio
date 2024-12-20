import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import { Button } from 'antd';
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
import { getIsAuthenticated, isGuestUser } from '../../../store/authStore/authSelectors';
import { getHiveDelegate } from '../../../waivioApi/ApiClient';
import DelegateListModal from '../DelegateModals/DelegateListModal/DelegateListModal';
import { isMobile } from '../../../common/helpers/apiHelpers';
import WalletAction from '../WalletSummaryInfo/components/WalletAction/WalletActions';

import './UserWalletSummary.less';
import CancelPowerDownModal from '../CancelPowerDownModal/CancelPowerDownModal';

const getFormattedTotalDelegatedSP = (
  user,
  totalVestingShares,
  totalVestingFundSteem,
  showBrackets = true,
) => {
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
          {showBrackets && (totalDelegatedSP > 0 ? ' (+' : ' (')}
          <FormattedNumber value={totalDelegatedSP} />
          {showBrackets && ')'}
        </span>
      </BTooltip>
    );
  }

  return null;
};

const getFormattedPendingWithdrawalSP = (
  user,
  totalVestingShares,
  totalVestingFundSteem,
  showMinus = true,
) => {
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
          {showMinus && ' - '}
          <FormattedNumber value={pendingWithdrawalSP} />
        </span>
      </BTooltip>
    );
  }

  return null;
};

const UserWalletSummary = ({
  user,
  isAuth,
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
  const [showCancelPowerDown, setShowCancelPowerDown] = useState(false);
  const isCurrentGuest = useSelector(isGuestUser);
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
      quantity: formatter.vestToSteem(
        item.vesting_shares,
        totalVestingShares,
        totalVestingFundSteem,
      ),
    }));

    const undelegateMapList = lists.expirations.map(item => ({
      to: item.delegator,
      quantity: formatter.vestToSteem(
        item.vesting_shares,
        totalVestingShares,
        totalVestingFundSteem,
      ),
    }));

    setDeligateList(delegateMapList);
    setRecivedList(recivedMapList);
    setUndeligatedList(undelegateMapList);
  };

  const openDetailsModal = () => {
    if (hasDelegations) {
      setVisible(true);
    }
  };

  useEffect(() => {
    if (totalVestingShares && totalVestingFundSteem && !isGuest) setDelegationLists();
  }, [totalVestingShares, totalVestingFundSteem]);

  const showDelegation = user.delegated_vesting_shares !== '0.000000 VESTS';

  return (
    <WalletSummaryInfo estAccValue={estAccValue}>
      <div className="UserWalletSummary__itemWrap">
        <div className="UserWalletSummary__item">
          <img
            className="UserWalletSummary__icon hive"
            src="/images/icons/cryptocurrencies/hive.png"
            alt="hive"
          />
          <div className="UserWalletSummary__label">HIVE</div>
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
          <p className="UserWalletSummary__description">
            <FormattedMessage id="liquid_hive_tokens" defaultMessage="Liquid HIVE tokens" />
          </p>
          <WalletAction
            mainKey={isCurrentGuest ? 'transfer' : 'power_up'}
            options={isCurrentGuest ? [] : ['transfer', 'convert']}
            mainCurrency={'HIVE'}
            withdrawCurrencyOption={isCurrentGuest ? ['LTC', 'BTC', 'ETH'] : []}
            swapCurrencyOptions={isCurrentGuest ? [] : ['SWAP.HIVE']}
          />
        </div>
      </div>
      {!isGuest && (
        <React.Fragment>
          <div className="UserWalletSummary__itemWrap">
            <div className="UserWalletSummary__item">
              <i className="iconfont icon-flashlight_fill UserWalletSummary__icon" />
              <div className="UserWalletSummary__label">
                <FormattedMessage id="steem_power" defaultMessage="HIVE Power" />
              </div>
              <div className={powerClassList} onClick={openDetailsModal}>
                {user.fetching || loadingGlobalProperties ? (
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
              <p className="UserWalletSummary__description">
                <FormattedMessage id="staked_hive_tokens" defaultMessage="Staked HIVE tokens" />
              </p>
              <WalletAction mainCurrency={'HP'} mainKey={'power_down'} options={['delegate']} />
            </div>
            {user.to_withdraw !== 0 && (
              <div className="UserWalletSummary__itemWrap--no-border">
                <div className="UserWalletSummary__item">
                  <div className="UserWalletSummary__label power-down">
                    <FormattedMessage id="power_down" defaultMessage="Power Down" />
                  </div>
                  <div className={powerClassList}>
                    {user.fetching || loadingGlobalProperties ? (
                      <Loading />
                    ) : (
                      <span>
                        {getFormattedPendingWithdrawalSP(
                          user,
                          totalVestingShares,
                          totalVestingFundSteem,
                          false,
                        )}
                        {' HP'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="UserWalletSummary__actions">
                  <p className="UserWalletSummary__description">
                    <FormattedMessage id="next_power_down" defaultMessage="Next power down" />:{' '}
                    <FormattedDate value={`${user.next_vesting_withdrawal}Z`} />{' '}
                    <FormattedTime value={`${user.next_vesting_withdrawal}Z`} />
                  </p>
                  {isAuth && (
                    <Button
                      onClick={() => setShowCancelPowerDown(true)}
                      className={'UserWalletSummary__button'}
                    >
                      Cancel{' '}
                    </Button>
                  )}
                </div>
              </div>
            )}
            {showDelegation && (
              <div className="UserWalletSummary__itemWrap--no-border">
                <div className="UserWalletSummary__item">
                  <div className="UserWalletSummary__label power-down">
                    <FormattedMessage id="hive_delegated" defaultMessage="HIVE Delegated" />
                  </div>
                  <div className={powerClassList}>
                    {user.fetching || loadingGlobalProperties ? (
                      <Loading />
                    ) : (
                      <span>
                        {getFormattedTotalDelegatedSP(
                          user,
                          totalVestingShares,
                          totalVestingFundSteem,
                          false,
                        )}
                        {' HP'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="UserWalletSummary__actions">
                  <p className="UserWalletSummary__description">User-delegated staked tokens</p>
                  {isAuth && (
                    <WalletAction
                      mainKey={'details'}
                      options={['delegate']}
                      mainCurrency={'HIVE'}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="UserWalletSummary__itemWrap">
            <div className="UserWalletSummary__item">
              <img
                className="UserWalletSummary__icon hive"
                src="/images/icons/cryptocurrencies/hbd-icon.svg"
                alt="hive"
              />
              <div className="UserWalletSummary__label">HBD (Hive Backed Dollar)</div>
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
              <p className="UserWalletSummary__description">
                <FormattedMessage
                  id="a_stable_coin_pegged_to_usd"
                  defaultMessage="A stable coin pegged to USD"
                />
              </p>
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
      {showCancelPowerDown && (
        <CancelPowerDownModal
          account={user.name}
          showCancelPowerDown={showCancelPowerDown}
          setShowCancelPowerDown={setShowCancelPowerDown}
        />
      )}
    </WalletSummaryInfo>
  );
};

UserWalletSummary.propTypes = {
  loadingGlobalProperties: PropTypes.bool.isRequired,
  isAuth: PropTypes.bool.isRequired,
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
  user: getUser(state, ownProps.userName),
  isAuth: getIsAuthenticated(state),
}))(withRouter(UserWalletSummary));

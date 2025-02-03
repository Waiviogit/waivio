import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import { Button } from 'antd';
import { FormattedDate, FormattedMessage, FormattedNumber, FormattedTime } from 'react-intl';
import { isEmpty } from 'lodash';
import classNames from 'classnames';
import { ReactSVG } from 'react-svg';

import { getUser } from '../../../store/usersStore/usersSelectors';
import formatter from '../../../common/helpers/steemitFormatter';
import {
  calculateEstAccountValue,
  calculatePendingWithdrawalSP,
  calculateTotalDelegatedSP,
  dHive,
} from '../../vendor/steemitHelpers';
import BTooltip from '../../components/BTooltip';
import Loading from '../../components/Icon/Loading';
import { guestUserRegex } from '../../../common/helpers/regexHelpers';
import WalletSummaryInfo from '../WalletSummaryInfo/WalletSummaryInfo';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
  isGuestUser,
} from '../../../store/authStore/authSelectors';
import { getHiveDelegate } from '../../../waivioApi/ApiClient';
import DelegateListModal from '../DelegateModals/DelegateListModal/DelegateListModal';
import { isMobile } from '../../../common/helpers/apiHelpers';
import WalletAction from '../WalletSummaryInfo/components/WalletAction/WalletActions';

import './UserWalletSummary.less';
import CancelPowerDownModal from '../CancelPowerDownModal/CancelPowerDownModal';
import PowerDownProgressModal from '../PowerDownProgressModal/PowerDownProgressModal';
import CancelWithdrawSavings from '../CancelWithdrawSavings/CancelWithdrawSavings';
import SavingsProgressModal from '../SavingsProgressModal/SavingsProgressModal';

const calculateDaysLeftForSavings = targetDate => {
  const now = new Date();
  const target = new Date(targetDate);

  // Calculate the difference in milliseconds
  const diffTime = target - now;

  // Convert milliseconds to days
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};
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

  const getBracketText = () => {
    if (showBrackets) {
      return totalDelegatedSP > 0 ? ' (+' : ' (';
    }

    return totalDelegatedSP > 0 ? ' +' : ' ';
  };

  if (totalDelegatedSP !== 0) {
    return (
      <BTooltip
        title={
          <span>
            <FormattedMessage
              id="steem_power_balance_account_tooltip"
              defaultMessage="Balance of HIVE Power delegations to/from other users"
            />
          </span>
        }
        {...(isMobile() ? { visible: false } : {})}
      >
        <span>
          {getBracketText()}
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
  authUserName,
}) => {
  const [delegateList, setDeligateList] = useState([]);
  const [recivedList, setRecivedList] = useState([]);
  const [undeligatedList, setUndeligatedList] = useState([]);
  const [savingsInfo, setSavingsInfo] = useState([]);
  const [currWithdrawSaving, setCurrWithdrawSaving] = useState({});
  const [visible, setVisible] = useState(false);
  const [showCancelPowerDown, setShowCancelPowerDown] = useState(false);
  const [showCancelWithdrawSavings, setShowCancelWithdrawSavings] = useState(false);
  const [showPowerDownProgress, setPowerDownProgress] = useState(false);
  const [showSavingsProgress, setShowSavingsProgress] = useState(false);
  const isCurrentGuest = useSelector(isGuestUser);
  const authUserPage = user.name === authUserName;
  const hasDelegations =
    !isEmpty(delegateList) || !isEmpty(recivedList) || !isEmpty(undeligatedList);
  const powerClassList = classNames('UserWalletSummary__value', {
    'UserWalletSummary__value--cursorPointer': hasDelegations || user.to_withdraw !== 0,
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

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        if (!authUserName) return;
        const r = await dHive.database.call('get_savings_withdraw_from', [authUserName]);

        setSavingsInfo(r);
        setCurrWithdrawSaving(r[0]);
      } catch (error) {
        console.error('Error fetching savings withdrawals:', error);
      }
    };

    fetchWithdrawals();
  }, [authUserName]);

  const showDelegation = user.delegated_vesting_shares !== '0.000000 VESTS' || hasDelegations;
  const nextPowerDownDate = (
    <>
      {' '}
      <FormattedDate value={`${user.next_vesting_withdrawal}Z`} />{' '}
      <FormattedTime value={`${user.next_vesting_withdrawal}Z`} />
    </>
  );

  const totalWithdrawSavings = savingsInfo?.reduce(
    (acc, val) => Number(acc.amount?.replace('HIVE', '')) + Number(val.amount?.replace('HIVE', '')),
  );

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
            options={isCurrentGuest ? ['withdraw'] : ['transfer', 'convert', 'transfer_to_saving']}
            mainCurrency={'HIVE'}
            withdrawCurrencyOption={['LTC', 'BTC', 'ETH']}
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
              <div className={'UserWalletSummary__value'}>
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
                    {' HP'}
                  </span>
                )}
              </div>
            </div>
            <div className="UserWalletSummary__actions">
              <p className="UserWalletSummary__description">
                <FormattedMessage id="staked_hive_tokens" defaultMessage="Staked HIVE tokens" />
              </p>
              <WalletAction mainCurrency={'HP'} mainKey={'delegate'} options={['power_down']} />
            </div>
            {user.to_withdraw !== 0 && (
              <div className="UserWalletSummary__itemWrap--no-border">
                <div className="UserWalletSummary__item">
                  <div className="UserWalletSummary__label power-down">
                    <FormattedMessage id="power_down" defaultMessage="Power Down" />
                  </div>
                  <div className={powerClassList} onClick={() => setPowerDownProgress(true)}>
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
                    {isMobile() ? <div>{nextPowerDownDate}</div> : nextPowerDownDate}
                  </p>
                  {isAuth && authUserPage && (
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
              <div className="UserWalletSummary__itemWrap--no-border last-block">
                <div className="UserWalletSummary__item">
                  <div className="UserWalletSummary__label power-down">
                    <FormattedMessage id="hive_delegations" defaultMessage="HIVE Delegations" />
                  </div>
                  <div className={powerClassList} onClick={openDetailsModal}>
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
                  <p className="UserWalletSummary__description">Delegations to/from other users</p>
                  {isAuth && (
                    <WalletAction mainKey={'manage'} options={['delegate']} mainCurrency={'HP'} />
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="UserWalletSummary__itemWrap">
            <div className="UserWalletSummary__item">
              <ReactSVG
                wrapper="span"
                src="/images/transfer-savings-icon.svg"
                className="UserWalletSummary__icon UserWalletSummary__icon--savings"
              />
              <div className="UserWalletSummary__label">
                <FormattedMessage id="hive_savings" defaultMessage="HIVE Savings" />
              </div>
              <div className="UserWalletSummary__value">
                {user.fetching ? (
                  <Loading />
                ) : (
                  <span>
                    <FormattedNumber value={parseFloat(user.savings_balance)} />
                    {' HIVE'}
                  </span>
                )}
              </div>
            </div>
            <div className="UserWalletSummary__actions">
              <p className="UserWalletSummary__description">3-day unstaking period</p>
              <WalletAction mainKey={'transfer_from_saving'} mainCurrency={'HIVE'} />
            </div>
            {!isEmpty(savingsInfo) && (
              <div className="UserWalletSummary__itemWrap--no-border last-block">
                <div className="UserWalletSummary__item">
                  <div className="UserWalletSummary__label power-down">
                    <FormattedMessage id="withdraw" defaultMessage="Withdraw" />
                  </div>
                  <div className={powerClassList} onClick={() => setShowSavingsProgress(true)}>
                    {user.fetching || loadingGlobalProperties ? (
                      <Loading />
                    ) : (
                      <span>
                        <FormattedNumber value={totalWithdrawSavings} /> {' HIVE'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="UserWalletSummary__actions">
                  <p className="UserWalletSummary__description">
                    Withdraw will complete in{' '}
                    {calculateDaysLeftForSavings(currWithdrawSaving.complete)} days
                  </p>
                  {isAuth && authUserPage && (
                    <Button
                      onClick={() => setShowCancelWithdrawSavings(true)}
                      className={'UserWalletSummary__button'}
                    >
                      Cancel{' '}
                    </Button>
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
      {showCancelWithdrawSavings && (
        <CancelWithdrawSavings
          currWithdrawSaving={currWithdrawSaving}
          account={authUserName}
          showCancelWithdrawSavings={showCancelWithdrawSavings}
          setShowSavingsProgress={setShowSavingsProgress}
          setShowCancelWithdrawSavings={setShowCancelWithdrawSavings}
        />
      )}
      {showPowerDownProgress && (
        <PowerDownProgressModal
          maxWeeks={13}
          nextWithdrawal={user.next_vesting_withdrawal}
          showModal={showPowerDownProgress}
          setShowModal={setPowerDownProgress}
          user={user}
        />
      )}{' '}
      {showSavingsProgress && (
        <SavingsProgressModal
          calculateDaysLeftForSavings={calculateDaysLeftForSavings}
          savingsInfo={savingsInfo}
          showModal={showSavingsProgress}
          setShowModal={setShowSavingsProgress}
          setShowSavingsProgress={setShowSavingsProgress}
          setShowCancelWithdrawSavings={setShowCancelWithdrawSavings}
          setCurrWithdrawSaving={setCurrWithdrawSaving}
          authUserPage={authUserPage}
          isAuth={isAuth}
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
  authUserName: PropTypes.string.isRequired,
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
  authUserName: getAuthenticatedUserName(state),
}))(withRouter(UserWalletSummary));

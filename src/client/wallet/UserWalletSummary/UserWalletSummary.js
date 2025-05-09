import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import { Button, Tooltip } from 'antd';
import Cookie from 'js-cookie';
import {
  FormattedDate,
  FormattedMessage,
  FormattedNumber,
  FormattedTime,
  injectIntl,
} from 'react-intl';
import { isEmpty } from 'lodash';
import classNames from 'classnames';
import { ReactSVG } from 'react-svg';
import moment from 'moment';

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
import {
  getDelegatedRc,
  getHbdConversion,
  getHiveConversion,
  getHiveDelegate,
  getIncomingRcDelegations,
  getRcByAccount,
} from '../../../waivioApi/ApiClient';
import DelegateListModal from '../DelegateModals/DelegateListModal/DelegateListModal';
import { isMobile } from '../../../common/helpers/apiHelpers';
import WalletAction from '../WalletSummaryInfo/components/WalletAction/WalletActions';
import api from '../../steemConnectAPI';
import CancelPowerDownModal from '../CancelPowerDownModal/CancelPowerDownModal';
import PowerDownProgressModal from '../PowerDownProgressModal/PowerDownProgressModal';
import CancelWithdrawSavings from '../CancelWithdrawSavings/CancelWithdrawSavings';
import SavingsProgressModal from '../SavingsProgressModal/SavingsProgressModal';
import { getHbdInterestRate } from '../../../store/walletStore/walletSelectors';
import './UserWalletSummary.less';

const calculateDaysLeftForSavings = (targetDate, isDaysFromDate = false) => {
  if (targetDate === '1970-01-01T00:00:00') {
    return 0;
  }
  const target = new Date(targetDate);
  const now = new Date();

  const diffTime = isDaysFromDate ? now - target : target - now;

  const hours = diffTime / (1000 * 60 * 60);

  const days = hours > 24 ? Math.ceil(hours / 24) : 0;

  return days > 0 ? days : 0;
};

const calculateDaysWithSeconds = timestamp => {
  const nowSeconds = moment.utc().unix();
  const targetSeconds = moment.utc(timestamp).unix();

  const totalSeconds = nowSeconds - targetSeconds;

  return Math.ceil(totalSeconds / 86400);
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
  const [delegatedRc, setDelegatedRc] = useState([]);
  const [inDelegatedRc, setInDelegatedRc] = useState([]);
  const [undeligatedList, setUndeligatedList] = useState([]);
  const [savingsInfo, setSavingsInfo] = useState([]);
  const [conversionHiveInfo, setConversionHiveInfo] = useState([]);
  const [conversionHbdInfo, setConversionHbdInfo] = useState([]);
  const [savingSymbol, setSavingSymbol] = useState('');
  const [currWithdrawSaving, setCurrWithdrawSaving] = useState({});
  const [rcInfo, setRcInfo] = React.useState({ rc_manabar: { current_mana: 0 } });
  const [currWithdrawHbdSaving, setCurrWithdrawHbdSaving] = useState({});
  const [visible, setVisible] = useState(false);
  const [visibleRcDetails, setVisibleRcDetails] = useState(false);
  const [showCancelPowerDown, setShowCancelPowerDown] = useState(false);
  const [showCancelWithdrawSavings, setShowCancelWithdrawSavings] = useState(false);
  const [showPowerDownProgress, setPowerDownProgress] = useState(false);
  const [showConversionModal, setConversionModal] = useState({ hive: false, hbd: false });
  const [showSavingsProgress, setShowSavingsProgress] = useState(false);
  const isCurrentGuest = useSelector(isGuestUser);
  const interestRate = useSelector(getHbdInterestRate);
  const savingsHbdBalance = parseFloat(user.savings_hbd_balance);
  const hiveAuth = Cookie.get('auth');
  const billion = 1000000000;
  const rcBalance = rcInfo ? rcInfo?.rc_manabar?.current_mana / billion : 0;

  const estimateInterestBalance = hiveAccount => {
    const {
      savings_hbd_seconds,
      savings_hbd_seconds_last_update,
      savings_hbd_balance,
    } = hiveAccount;

    if (savings_hbd_seconds === 0 && savings_hbd_balance === 0) {
      return 0;
    }

    const hdbSeconds = parseFloat(savings_hbd_seconds) / 1000;
    const hdbSecondsLastUpdate = moment.utc(savings_hbd_seconds_last_update).unix();
    const nowSeconds = moment.utc().unix();
    const hbdBalance = parseFloat(savings_hbd_balance);
    const secondsPerYear = 31536000;

    const interest =
      ((hdbSeconds + (nowSeconds - hdbSecondsLastUpdate) * hbdBalance) * (interestRate / 100)) /
      secondsPerYear;

    return interest < 0.001 ? 0 : interest;
  };
  const interest = estimateInterestBalance(user);
  const daysToClaimInterest = 30 - calculateDaysWithSeconds(user.savings_hbd_last_interest_payment);

  const canClaimHBDInterest = savingsLastInterestPayment => {
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    const UNIX_EPOCH = '1970-01-01T00:00:00';

    const lastInterestDate = new Date(savingsLastInterestPayment);
    const now = new Date();

    if (savingsLastInterestPayment === UNIX_EPOCH || 0) return true;

    return now - lastInterestDate >= THIRTY_DAYS;
  };

  const showClaim = canClaimHBDInterest(user.savings_hbd_last_interest_payment);

  const disabledClaim = !showClaim;

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
        if (!user.name) return;
        const r = await dHive.database.call('get_savings_withdraw_from', [user.name]);

        setSavingsInfo(r);
        setCurrWithdrawSaving(r?.find(w => w.amount?.includes('HIVE')));
        setCurrWithdrawHbdSaving(r?.find(w => w.amount?.includes('HBD')));
      } catch (error) {
        console.error('Error fetching savings withdrawals:', error);
      }
    };

    fetchWithdrawals();
    getDelegatedRc(user.name).then(r => setDelegatedRc(r?.rc_direct_delegations));
    getRcByAccount(user.name).then(r => setRcInfo(r?.rc_accounts[0]));
    getIncomingRcDelegations(user.name).then(r => setInDelegatedRc(r));
    getHiveConversion(user.name).then(r => setConversionHiveInfo(r));
    getHbdConversion(user.name).then(r => setConversionHbdInfo(r));
  }, [user.name]);

  const totalHiveConversions = !isEmpty(conversionHiveInfo)
    ? conversionHiveInfo?.reduce((acc, val) => {
        const amount = parseFloat(val.collateral_amount);

        return acc + amount;
      }, 0)
    : 0;
  const totalHbdConversions = !isEmpty(conversionHbdInfo)
    ? conversionHbdInfo?.reduce((acc, val) => {
        const amount = parseFloat(val.amount);

        return acc + amount;
      }, 0)
    : 0;

  const showDelegation = user.delegated_vesting_shares !== '0.000000 VESTS' || hasDelegations;
  const nextPowerDownDate = (
    <>
      {' '}
      <FormattedDate value={`${user.next_vesting_withdrawal}Z`} />{' '}
      <FormattedTime value={`${user.next_vesting_withdrawal}Z`} />
    </>
  );
  const getTotalWithdrawSavings = symbol => {
    if (!Array.isArray(savingsInfo) || savingsInfo.length === 0) return 0;

    return savingsInfo.reduce((acc, val) => {
      const amount = parseFloat(val.amount);

      return val.amount.includes(symbol) ? acc + amount : acc;
    }, 0);
  };

  const claimHdbInterest = () => {
    if (!disabledClaim) {
      const requestId = Date.now().toString();

      const transferOp = [
        'transfer_from_savings',
        {
          from: authUserName,
          to: authUserName,
          amount: '0.001 HBD',
          memo: 'Claim HBD interest',
          request_id: requestId,
        },
      ];

      const cancelOp = [
        'cancel_transfer_from_savings',
        {
          from: authUserName,
          request_id: requestId,
        },
      ];

      if (hiveAuth) {
        const brodc = () => api.broadcast([transferOp, cancelOp], null, 'active');

        brodc();
      } else {
        const encodedOps = btoa(JSON.stringify([transferOp, cancelOp]));
        const hivesignerURL = `https://hivesigner.com/sign/ops/${encodedOps}`;

        window && window.open(hivesignerURL, '_blank');
      }
    }
  };

  const hiveDays = calculateDaysLeftForSavings(currWithdrawSaving?.complete);
  const hiveDaysLeft = hiveDays === 0 ? 'today' : hiveDays;

  const hbdDays = calculateDaysLeftForSavings(currWithdrawHbdSaving?.complete);
  const hbdDaysLeft = hbdDays === 0 ? 'today' : hbdDays;
  const getDaysLayout = days => (days === 1 ? 'day' : 'days');

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
            options={
              isCurrentGuest
                ? ['withdraw']
                : ['transfer', 'convert', 'transfer_to_saving', 'collateralized_convert']
            }
            mainCurrency={'HIVE'}
            withdrawCurrencyOption={['LTC', 'BTC', 'ETH']}
            swapCurrencyOptions={isCurrentGuest ? [] : ['SWAP.HIVE']}
          />
        </div>
        {!isEmpty(conversionHiveInfo) && (
          <div className="UserWalletSummary__itemWrap--no-border last-block">
            <div className="UserWalletSummary__item">
              <div className="UserWalletSummary__label power-down">
                <FormattedMessage id="conversions" defaultMessage="Conversions" />
              </div>
              <div
                className={powerClassList}
                onClick={() =>
                  setConversionModal({ ...showConversionModal, hive: true, hbd: false })
                }
              >
                {totalHiveConversions}
                {' HIVE'}
              </div>
            </div>
            <div className="UserWalletSummary__actions">
              <p className="UserWalletSummary__description">Pending requests to HBD</p>
            </div>
          </div>
        )}
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
              <WalletAction
                mainCurrency={'HP'}
                mainKey={'delegate'}
                options={['power_down', 'delegate_rc']}
              />
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
            {
              <div className="UserWalletSummary__itemWrap--no-border last-block">
                <div className="UserWalletSummary__item">
                  <div className="UserWalletSummary__label power-down">
                    <FormattedMessage id="rc_delegations" defaultMessage="RC Delegations" />
                  </div>
                  <div className={powerClassList} onClick={() => setVisibleRcDetails(true)}>
                    {user.fetching || loadingGlobalProperties ? (
                      <Loading />
                    ) : (
                      <span>
                        <FormattedNumber value={rcBalance.toFixed(2)} />
                        {'b RC'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="UserWalletSummary__actions">
                  <p className="UserWalletSummary__description">Resource credit delegations</p>
                  {isAuth && (!isEmpty(delegatedRc) || !isEmpty(inDelegatedRc)) && (
                    <WalletAction
                      mainKey={'manage_rc'}
                      delegatedRc={delegatedRc}
                      rcBalance={rcBalance}
                      options={['delegate_rc']}
                      mainCurrency={'HP'}
                    />
                  )}
                </div>
              </div>
            }
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
              {
                <WalletAction
                  mainKey={
                    parseFloat(user.savings_balance) > 0 ? 'transfer_from_saving' : 'deposit'
                  }
                  mainCurrency={'HIVE'}
                />
              }
            </div>
            {!isEmpty(currWithdrawSaving) && (
              <div className="UserWalletSummary__itemWrap--no-border last-block">
                <div className="UserWalletSummary__item">
                  <div className="UserWalletSummary__label power-down">
                    <FormattedMessage id="withdraw" defaultMessage="Withdraw" />
                  </div>
                  <div
                    className={powerClassList}
                    onClick={() => {
                      setShowSavingsProgress(true);
                      setSavingSymbol('HIVE');
                    }}
                  >
                    {user.fetching || loadingGlobalProperties ? (
                      <Loading />
                    ) : (
                      <span>
                        <FormattedNumber value={getTotalWithdrawSavings('HIVE')} /> {' HIVE'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="UserWalletSummary__actions">
                  <p className="UserWalletSummary__description">
                    Withdraw will complete {hiveDays > 0 ? 'in' : ''}{' '}
                    {currWithdrawSaving?.complete ? hiveDaysLeft : 3}{' '}
                    {hiveDays > 0 ? getDaysLayout(hiveDays) : ''}
                  </p>
                  {isAuth && authUserPage && (
                    <Button
                      onClick={() => {
                        setSavingSymbol('HIVE');
                        setShowCancelWithdrawSavings(true);
                      }}
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
                options={['convert', 'transfer_to_saving', 'collateralized_convert']}
                swapCurrencyOptions={['SWAP.HBD']}
                mainCurrency={'HBD'}
              />
            </div>
            {!isEmpty(conversionHbdInfo) && (
              <div className="UserWalletSummary__itemWrap--no-border last-block">
                <div className="UserWalletSummary__item">
                  <div className="UserWalletSummary__label power-down">
                    <FormattedMessage id="conversions" defaultMessage="Conversions" />
                  </div>
                  <div
                    className={powerClassList}
                    onClick={() =>
                      setConversionModal({ ...showConversionModal, hbd: true, hive: false })
                    }
                  >
                    {totalHbdConversions}
                    {' HBD'}
                  </div>
                </div>
                <div className="UserWalletSummary__actions">
                  <p className="UserWalletSummary__description">Pending requests to HIVE</p>
                </div>
              </div>
            )}
          </div>
          <div
            className={`UserWalletSummary__itemWrap ${
              getTotalWithdrawSavings('HBD') > 0 ? '' : 'last-block'
            }`}
          >
            <div className="UserWalletSummary__item">
              <ReactSVG
                wrapper="span"
                src="/images/transfer-savings-icon.svg"
                className="UserWalletSummary__icon UserWalletSummary__icon--savings-green"
              />
              <div className="UserWalletSummary__label">
                <FormattedMessage id="hbd_savings" defaultMessage="HBD Savings" />
              </div>
              <div className={powerClassList}>
                {user.fetching || loadingGlobalProperties ? (
                  <Loading />
                ) : (
                  <span>
                    <FormattedNumber value={savingsHbdBalance} /> {' HBD'}
                  </span>
                )}
              </div>
            </div>
            <div className="UserWalletSummary__actions">
              <p className="UserWalletSummary__description">
                Earn {interestRate}% APR interest on HBD
              </p>
              <WalletAction
                mainKey={savingsHbdBalance > 0 ? 'transfer_from_saving' : 'deposit'}
                mainCurrency={'HBD'}
              />
            </div>
            {getTotalWithdrawSavings('HBD') > 0 && (
              <div className="UserWalletSummary__itemWrap--no-border last-block">
                <div className="UserWalletSummary__item">
                  <div className="UserWalletSummary__label power-down">
                    <FormattedMessage id="withdraw" defaultMessage="Withdraw" />
                  </div>
                  <div
                    className={powerClassList}
                    onClick={() => {
                      setSavingSymbol('HBD');
                      setTimeout(() => setShowSavingsProgress(true), 200);
                    }}
                  >
                    {user.fetching || loadingGlobalProperties ? (
                      <Loading />
                    ) : (
                      <span>
                        <FormattedNumber value={getTotalWithdrawSavings('HBD')} /> {' HBD'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="UserWalletSummary__actions">
                  <p className="UserWalletSummary__description">
                    Withdraw will complete {hbdDays > 0 ? 'in' : ''}{' '}
                    {currWithdrawHbdSaving ? hbdDaysLeft : 3}{' '}
                    {hbdDays > 0 ? getDaysLayout(hbdDays) : ''}
                  </p>
                  {isAuth && authUserPage && (
                    <Button
                      onClick={() => {
                        setSavingSymbol('HBD');
                        setShowCancelWithdrawSavings(true);
                      }}
                      className={'UserWalletSummary__button'}
                    >
                      Cancel{' '}
                    </Button>
                  )}
                </div>
              </div>
            )}{' '}
            {interest > 0 && (
              <div className="UserWalletSummary__itemWrap--no-border last-block">
                <div className="UserWalletSummary__item">
                  <div className="UserWalletSummary__label power-down">
                    <FormattedMessage id="interest" defaultMessage="Interest" />
                  </div>
                  <div className={powerClassList}>
                    {user.fetching || loadingGlobalProperties ? (
                      <Loading />
                    ) : (
                      <span>
                        <FormattedNumber value={interest} /> {' HBD'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="UserWalletSummary__actions">
                  <p className="UserWalletSummary__description">
                    HBD staking earnings ready to be claimed
                  </p>
                  {isAuth && authUserPage && (
                    <Tooltip
                      title={
                        showClaim
                          ? ''
                          : `The claim will be available in ${daysToClaimInterest} days.`
                      }
                    >
                      <Button
                        onClick={claimHdbInterest}
                        className={`UserWalletSummary__button ${disabledClaim ? 'disabled' : ''}`}
                      >
                        Claim{' '}
                      </Button>
                    </Tooltip>
                  )}
                </div>
              </div>
            )}
          </div>{' '}
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
      {(!isEmpty(delegatedRc) || !isEmpty(inDelegatedRc)) && (
        <DelegateListModal
          visible={visibleRcDetails}
          toggleModal={setVisibleRcDetails}
          deligateList={delegatedRc?.map(i => ({ ...i, quantity: i.delegated_rc / billion }))}
          recivedList={inDelegatedRc?.map(i => ({
            ...i,
            from: i.delegator,
            quantity: i.rc / billion,
          }))}
          symbol={'b RC'}
          isRc
        />
      )}
      {showCancelPowerDown && (
        <CancelPowerDownModal
          account={user.name}
          setPowerDownProgress={setPowerDownProgress}
          showCancelPowerDown={showCancelPowerDown}
          setShowCancelPowerDown={setShowCancelPowerDown}
        />
      )}
      {showCancelWithdrawSavings && (
        <CancelWithdrawSavings
          symbol={savingSymbol}
          currWithdrawSaving={savingSymbol === 'HIVE' ? currWithdrawSaving : currWithdrawHbdSaving}
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
          symbol={savingSymbol}
          calculateDaysLeftForSavings={calculateDaysLeftForSavings}
          savingsInfo={savingsInfo}
          showModal={showSavingsProgress}
          setShowModal={setShowSavingsProgress}
          setShowCancelWithdrawSavings={setShowCancelWithdrawSavings}
          setCurrWithdrawSaving={setCurrWithdrawSaving}
          authUserPage={authUserPage}
          isAuth={isAuth}
        />
      )}
      {(showConversionModal?.hive || showConversionModal?.hbd) && (
        <SavingsProgressModal
          isConversion
          symbol={showConversionModal?.hive ? 'HIVE' : 'HBD'}
          calculateDaysLeftForSavings={calculateDaysLeftForSavings}
          savingsInfo={showConversionModal?.hive ? conversionHiveInfo : conversionHbdInfo}
          showModal={showConversionModal?.hive || showConversionModal?.hbd}
          setShowModal={setConversionModal}
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
}))(withRouter(injectIntl(UserWalletSummary)));

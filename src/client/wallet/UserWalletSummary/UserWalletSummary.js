import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { withRouter } from 'react-router';

import { injectIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import classNames from 'classnames';

import { getUser } from '../../../store/usersStore/usersSelectors';
import formatter from '../../../common/helpers/steemitFormatter';
import { calculateEstAccountValue, dHive } from '../../vendor/steemitHelpers';

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
import CancelPowerDownModal from '../CancelPowerDownModal/CancelPowerDownModal';
import PowerDownProgressModal from '../PowerDownProgressModal/PowerDownProgressModal';
import CancelWithdrawSavings from '../CancelWithdrawSavings/CancelWithdrawSavings';
import SavingsProgressModal from '../SavingsProgressModal/SavingsProgressModal';
import HiveBlock from './HiveBlock';
import HiveSavingsBlock from './HiveSavingsBlock';
import HbdBlock from './HbdBlock';
import './UserWalletSummary.less';
import HbdSavingsBlock from './HbdSavingsBlock';
import HivePowerBlock from './HivePowerBlock';

export const calculateDaysLeftForSavings = (targetDate, isDaysFromDate = false) => {
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
  const billion = 1000000000;

  const canClaimHBDInterest = savingsLastInterestPayment => {
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    const UNIX_EPOCH = '1970-01-01T00:00:00';

    const lastInterestDate = new Date(savingsLastInterestPayment);
    const now = new Date();

    if (savingsLastInterestPayment === UNIX_EPOCH || 0) return true;

    return now - lastInterestDate >= THIRTY_DAYS;
  };

  const showClaim = canClaimHBDInterest(user.savings_hbd_last_interest_payment);

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

  const getTotalWithdrawSavings = symbol => {
    if (!Array.isArray(savingsInfo) || savingsInfo.length === 0) return 0;

    return savingsInfo.reduce((acc, val) => {
      const amount = parseFloat(val.amount);

      return val.amount?.includes(symbol) ? acc + amount : acc;
    }, 0);
  };

  return (
    <WalletSummaryInfo estAccValue={estAccValue}>
      <HiveBlock
        user={user}
        conversionHiveInfo={conversionHiveInfo}
        totalHiveConversions={totalHiveConversions}
        setConversionModal={setConversionModal}
        showConversionModal={showConversionModal}
        powerClassList={powerClassList}
        isCurrentGuest={isCurrentGuest}
      />
      {!isGuest && (
        <React.Fragment>
          <HivePowerBlock
            rcInfo={rcInfo}
            setPowerDownProgress={setPowerDownProgress}
            setVisibleRcDetails={setVisibleRcDetails}
            totalVestingFundSteem={totalVestingFundSteem}
            totalVestingShares={totalVestingShares}
            powerClassList={powerClassList}
            loadingGlobalProperties={loadingGlobalProperties}
            openDetailsModal={openDetailsModal}
            hasDelegations={hasDelegations}
            inDelegatedRc={inDelegatedRc}
            delegatedRc={delegatedRc}
            setShowCancelPowerDown={setShowCancelPowerDown}
            user={user}
            authUserPage={authUserPage}
            isAuth={isAuth}
          />
          <HiveSavingsBlock
            setShowSavingsProgress={setShowSavingsProgress}
            loadingGlobalProperties={loadingGlobalProperties}
            getTotalWithdrawSavings={getTotalWithdrawSavings}
            setShowCancelWithdrawSavings={setShowCancelWithdrawSavings}
            setSavingSymbol={setSavingSymbol}
            authUserPage={authUserPage}
            isAuth={isAuth}
            currWithdrawSaving={currWithdrawSaving}
            powerClassList={powerClassList}
            user={user}
          />
          <HbdBlock
            user={user}
            powerClassList={powerClassList}
            showConversionModal={showConversionModal}
            setConversionModal={setConversionModal}
            conversionHbdInfo={conversionHbdInfo}
          />
          <HbdSavingsBlock
            authUserName={authUserName}
            currWithdrawHbdSaving={currWithdrawHbdSaving}
            setShowSavingsProgress={setShowSavingsProgress}
            showClaim={showClaim}
            authUserPage={authUserPage}
            getTotalWithdrawSavings={getTotalWithdrawSavings}
            setShowCancelWithdrawSavings={setShowCancelWithdrawSavings}
            isAuth={isAuth}
            setSavingSymbol={setSavingSymbol}
            user={user}
            powerClassList={powerClassList}
            loadingGlobalProperties={loadingGlobalProperties}
          />{' '}
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

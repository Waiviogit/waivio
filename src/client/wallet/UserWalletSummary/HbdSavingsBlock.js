import React from 'react';
import { ReactSVG } from 'react-svg';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment/moment';
import Cookie from 'js-cookie';
import { useSelector } from 'react-redux';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import Loading from '../../components/Icon/Loading';
import WalletAction from '../WalletSummaryInfo/components/WalletAction/WalletActions';
import InterestBlock from './InterestBlock';
import { calculateDaysLeftForSavings } from './UserWalletSummary';
import api from '../../steemConnectAPI';

import { getHbdInterestRate } from '../../../store/walletStore/walletSelectors';

const HbdSavingsBlock = ({
  getTotalWithdrawSavings,
  powerClassList,
  user,
  loadingGlobalProperties,
  setSavingSymbol,
  setShowSavingsProgress,
  currWithdrawHbdSaving,
  isAuth,
  authUserPage,
  setShowCancelWithdrawSavings,
  showClaim,

  authUserName,
}) => {
  const interestRate = useSelector(getHbdInterestRate);
  const savingsHbdBalance = parseFloat(user.savings_hbd_balance);
  const hiveAuth = Cookie.get('auth');
  const hbdDays = calculateDaysLeftForSavings(currWithdrawHbdSaving?.complete);
  const hbdDaysLeft = hbdDays === 0 ? 'today' : hbdDays;
  const disabledClaim = !showClaim;
  const getDaysLayout = days => (days === 1 ? 'day' : 'days');
  const calculateDaysWithSeconds = timestamp => {
    const nowSeconds = moment.utc().unix();
    const targetSeconds = moment.utc(timestamp).unix();

    const totalSeconds = nowSeconds - targetSeconds;

    return Math.ceil(totalSeconds / 86400);
  };
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

  return (
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
        <p className="UserWalletSummary__description">Earn {interestRate}% APR interest on HBD</p>
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
              {currWithdrawHbdSaving ? hbdDaysLeft : 3} {hbdDays > 0 ? getDaysLayout(hbdDays) : ''}
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
        <InterestBlock
          authUserPage={authUserPage}
          claimHdbInterest={claimHdbInterest}
          showClaim={showClaim}
          disabledClaim={disabledClaim}
          loadingGlobalProperties={loadingGlobalProperties}
          powerClassList={powerClassList}
          daysToClaimInterest={daysToClaimInterest}
          user={user}
          interest={interest}
          isAuth={isAuth}
        />
      )}
    </div>
  );
};

HbdSavingsBlock.propTypes = {
  user: PropTypes.shape(),
  currWithdrawHbdSaving: PropTypes.shape(),
  showClaim: PropTypes.bool,
  isAuth: PropTypes.bool,
  authUserPage: PropTypes.bool,
  loadingGlobalProperties: PropTypes.bool,

  getTotalWithdrawSavings: PropTypes.func,
  setSavingSymbol: PropTypes.func,
  setShowSavingsProgress: PropTypes.func,
  setShowCancelWithdrawSavings: PropTypes.func,
  authUserName: PropTypes.string,
  powerClassList: PropTypes.string,
};

export default HbdSavingsBlock;

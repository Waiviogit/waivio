import React from 'react';
import { ReactSVG } from 'react-svg';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Button } from 'antd';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import Loading from '../../components/Icon/Loading';
import WalletAction from '../WalletSummaryInfo/components/WalletAction/WalletActions';
import { calculateDaysLeftForSavings } from './UserWalletSummary';

const HiveSavingsBlock = ({
  user,
  setShowCancelWithdrawSavings,
  isAuth,
  authUserPage,
  currWithdrawSaving,
  powerClassList,
  setShowSavingsProgress,
  setSavingSymbol,
  loadingGlobalProperties,
  getTotalWithdrawSavings,
}) => {
  const getDaysLayout = days => (days === 1 ? 'day' : 'days');
  const hiveDays = calculateDaysLeftForSavings(currWithdrawSaving?.complete);
  const hiveDaysLeft = hiveDays === 0 ? 'today' : hiveDays;

  return (
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
            mainKey={parseFloat(user.savings_balance) > 0 ? 'transfer_from_saving' : 'deposit'}
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
  );
};

HiveSavingsBlock.propTypes = {
  user: PropTypes.shape(),
  currWithdrawSaving: PropTypes.shape(),
  isAuth: PropTypes.bool,
  authUserPage: PropTypes.bool,
  loadingGlobalProperties: PropTypes.bool,
  powerClassList: PropTypes.string,
  setShowCancelWithdrawSavings: PropTypes.func,
  setShowSavingsProgress: PropTypes.func,
  setSavingSymbol: PropTypes.func,
  getTotalWithdrawSavings: PropTypes.func,
};

export default HiveSavingsBlock;

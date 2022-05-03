import React from 'react';
import PropTypes from 'prop-types';
import { parseInt, round } from 'lodash';
import * as accountHistoryConstants from '../../common/constants/accountHistory';
import ReceiveTransaction from './TransfersCards/ReceiveTransaction';
import TransferTransaction from './TransfersCards/TransferTransaction';
import SavingsTransaction from './TransfersCards/SavingsTransaction';
import PowerUpTransactionFrom from './TransfersCards/PowerUpTransactionFrom';
import ClaimReward from './TransfersCards/ClaimReward';
import WalletFillOrderTransferred from './TransfersCards/WalletFillOrderTransferred';
import WalletLimitOrder from './TransfersCards/WalletLimitOrder';
import WalletCancelOrder from './TransfersCards/WalletCancelOrder';
import PowerUpTransactionTo from './TransfersCards/PowerUpTransactionTo';
import SetWithdrawVestingRoute from './TransfersCards/SetWithdrawVestingRoute/SetWithdrawVestingRoute';
import ConvertHbdRequest from './TransfersCards/ConvertHbdRequest';
import ConvertHbdCompleted from './TransfersCards/ConvertHbdCompleted';
import ConvertHiveRequest from './TransfersCards/ConvertHiveRequest';
import ConvertHiveCompleted from './TransfersCards/ConvertHiveCompleted';
import {
  fillOrderExchanger,
  getTransactionCurrency,
  getTransactionDescription,
} from './WalletHelper';
import PowerDownTransaction from './TransfersCards/PowerDownTransaction';
import formatter from '../../common/helpers/steemitFormatter';
import HiveDelegatedCard from './TransfersCards/HiveDelegatedCard';

import './UserWalletTransactions/UserWalletTransactions.less';

const WalletTransaction = ({
  transaction,
  currentUsername,
  totalVestingShares,
  totalVestingFundSteem,
  isGuestPage,
  handleDetailsClick,
  isMobile,
}) => {
  const transactionType = isGuestPage ? transaction.op[0] : transaction.type;
  const transactionDetails = isGuestPage ? transaction.op[1] : transaction;
  const exchanger = fillOrderExchanger(currentUsername, transaction);

  switch (transactionType) {
    case accountHistoryConstants.TRANSFER_TO_VESTING:
      if (transactionDetails.to === currentUsername) {
        return (
          <PowerUpTransactionFrom
            amount={getTransactionCurrency(transactionDetails.amount, 'HP')}
            timestamp={transaction.timestamp}
            to={transactionDetails.to}
            from={transactionDetails.from}
            transactionType={transactionType}
          />
        );
      }

      return (
        <PowerUpTransactionTo
          amount={getTransactionCurrency(transactionDetails.amount, 'HIVE')}
          timestamp={transaction.timestamp}
          to={transactionDetails.to}
          transactionType={transactionType}
        />
      );

    case accountHistoryConstants.TRANSFER:
      if (transactionDetails.to === currentUsername) {
        return (
          <ReceiveTransaction
            isGuestPage={isGuestPage}
            from={transactionDetails.from}
            to={transactionDetails.to}
            memo={transactionDetails.memo}
            amount={getTransactionCurrency(transactionDetails.amount)}
            timestamp={transaction.timestamp}
            details={transactionDetails.details}
            type={transactionDetails.typeTransfer}
            username={transactionDetails.username}
            isMobile={isMobile}
            transactionType={transactionType}
          />
        );
      }

      return (
        <TransferTransaction
          isGuestPage={isGuestPage}
          to={transactionDetails.to}
          memo={transactionDetails.memo}
          amount={getTransactionCurrency(transactionDetails.amount)}
          timestamp={transaction.timestamp}
          withdraw={transaction.withdraw}
          getDetails={handleDetailsClick}
          transactionType={transactionType}
        />
      );
    case accountHistoryConstants.SET_WITHDRAW_VESTING_ROUTE: {
      return (
        <SetWithdrawVestingRoute
          currentUsername={currentUsername}
          isGuestPage={isGuestPage}
          from={transactionDetails.from}
          to={transactionDetails.to}
          timestamp={transaction.timestamp}
          percent={transaction.percent}
        />
      );
    }
    case accountHistoryConstants.CONVERT_HBD_REQUEST: {
      return (
        <ConvertHbdRequest
          isGuestPage={isGuestPage}
          timestamp={transaction.timestamp}
          amount={transaction.amount}
        />
      );
    }
    case accountHistoryConstants.CONVERT_HBD_COMPLETED: {
      return (
        <ConvertHbdCompleted
          isGuestPage={isGuestPage}
          timestamp={transaction.timestamp}
          amount={transaction.amount_out}
        />
      );
    }
    case accountHistoryConstants.CONVERT_HIVE_REQUEST: {
      return (
        <ConvertHiveRequest
          isGuestPage={isGuestPage}
          timestamp={transaction.timestamp}
          amount={transaction.amount}
        />
      );
    }
    case accountHistoryConstants.CONVERT_HIVE_COMPLETED: {
      return (
        <ConvertHiveCompleted
          isGuestPage={isGuestPage}
          timestamp={transaction.timestamp}
          amount={transaction.amount_out}
        />
      );
    }

    case accountHistoryConstants.CLAIM_REWARD_BALANCE:
      return (
        <ClaimReward
          timestamp={transaction.timestamp}
          rewardSteem={transactionDetails.reward_hive}
          rewardSbd={transactionDetails.reward_hbd}
          rewardVests={transactionDetails.reward_vests}
          totalVestingShares={totalVestingShares}
          totalVestingFundSteem={totalVestingFundSteem}
          transactionType={transactionType}
        />
      );
    case accountHistoryConstants.TRANSFER_TO_SAVINGS:
    case accountHistoryConstants.TRANSFER_FROM_SAVINGS:
    case accountHistoryConstants.CANCEL_TRANSFER_FROM_SAVINGS:
      return (
        <SavingsTransaction
          transactionDetails={transactionDetails}
          transactionType={transactionType}
          amount={getTransactionCurrency(transactionDetails.amount)}
          timestamp={transaction.timestamp}
        />
      );
    case accountHistoryConstants.LIMIT_ORDER:
      return (
        <WalletLimitOrder
          openPays={transactionDetails.open_pays}
          currentPays={transactionDetails.current_pays}
          timestamp={transaction.timestamp}
          transactionType={transactionType}
        />
      );
    case accountHistoryConstants.FILL_ORDER:
      return (
        <WalletFillOrderTransferred
          transactionDetails={transactionDetails}
          currentPays={getTransactionCurrency(transactionDetails.current_pays)}
          openPays={getTransactionCurrency(transactionDetails.open_pays)}
          timestamp={transaction.timestamp}
          exchanger={exchanger}
          currentUsername={currentUsername}
          transactionType={transactionType}
        />
      );
    case accountHistoryConstants.DELEGATE:
      return (
        <HiveDelegatedCard
          account={currentUsername}
          from={transaction.delegatee}
          to={transaction.delegator}
          timestamp={transaction.timestamp}
          quantity={formatter.vestToSteem(
            transaction.vesting_shares,
            totalVestingShares,
            totalVestingFundSteem,
          )}
          symbol={'HP'}
        />
      );
    case accountHistoryConstants.CANCEL_ORDER:
      return (
        <WalletCancelOrder
          timestamp={transaction.timestamp}
          openPays={getTransactionCurrency(
            transactionDetails.open_pays,
            undefined,
            transactionType,
          )}
          currentPays={getTransactionCurrency(
            transactionDetails.current_pays,
            undefined,
            transactionType,
          )}
          transactionType={transactionType}
        />
      );
    case accountHistoryConstants.POWER_DOWN_WITHDRAW: {
      const desc = getTransactionDescription(transactionType, {
        to: transactionDetails.to,
        from: transactionDetails.from,
      });
      let color;
      let character = '';
      let description = desc.powerDownWithdraw;

      if (transactionDetails.to !== transactionDetails.from) {
        color = 'red';
        description = desc.powerDownWithdrawTo;
        character = '-';

        if (transaction.userName !== transaction.from) {
          description = desc.powerDownWithdrawFrom;
          color = 'green';
          character = '+';
        }
      }

      return (
        <PowerDownTransaction
          amount={`${character} ${parseFloat(transactionDetails.amount)} HP`}
          timestamp={transaction.timestamp}
          description={description}
          color={color}
        />
      );
    }
    case accountHistoryConstants.POWER_DOWN_INITIATED_OR_STOP: {
      const desc = getTransactionDescription(transactionType);
      const isInitiated = !!parseInt(transactionDetails.vesting_shares);
      const amount = formatter.vestToSteem(
        transactionDetails.vesting_shares,
        totalVestingShares,
        totalVestingFundSteem,
      );

      return (
        <PowerDownTransaction
          amount={`${round(amount, 3)} HP`}
          timestamp={transaction.timestamp}
          description={isInitiated ? desc.powerDownStarted : desc.powerDownStopped}
        />
      );
    }
    default:
      return null;
  }
};

WalletTransaction.propTypes = {
  transaction: PropTypes.shape().isRequired,
  currentUsername: PropTypes.string.isRequired,
  totalVestingShares: PropTypes.string.isRequired,
  totalVestingFundSteem: PropTypes.string.isRequired,
  isGuestPage: PropTypes.bool,
  handleDetailsClick: PropTypes.func,
  isMobile: PropTypes.bool,
};

WalletTransaction.defaultProps = {
  isGuestPage: false,
  handleDetailsClick: () => {},
  isMobile: false,
};

export default WalletTransaction;

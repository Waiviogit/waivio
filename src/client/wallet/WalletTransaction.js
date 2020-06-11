import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';
import * as accountHistoryConstants from '../../common/constants/accountHistory';
import ReceiveTransaction from './ReceiveTransaction';
import TransferTransaction from './TransferTransaction';
import SavingsTransaction from './SavingsTransaction';
import PowerUpTransactionFrom from './PowerUpTransactionFrom';
import ClaimReward from './ClaimReward';
import WalletFillOrderTransferred from './WalletFillOrderTransferred';
import WalletLimitOrder from './WalletLimitOrder';
import WalletCancelOrder from './WalletCancelOrder';
import './UserWalletTransactions.less';
import PowerUpTransactionTo from './PowerUpTransactionTo';

const getFormattedTransactionAmount = (amount, currency) => {
  if (!amount) {
    return null;
  }

  const transaction = amount.split(' ');
  const transactionAmount = parseFloat(transaction[0]);
  const transactionCurrency = currency || transaction[1];
  return (
    <span>
      <FormattedNumber
        value={transactionAmount}
        minimumFractionDigits={3}
        maximumFractionDigits={3}
      />
      {` ${transactionCurrency}`}
    </span>
  );
};
const WalletTransaction = ({
  transaction,
  currentUsername,
  totalVestingShares,
  totalVestingFundSteem,
  isGuestPage,
}) => {
  const transactionType = isGuestPage ? transaction.op[0] : transaction.type;
  const transactionDetails = isGuestPage ? transaction.op[1] : transaction;

  switch (transactionType) {
    case accountHistoryConstants.TRANSFER_TO_VESTING:
      if (transactionDetails.to === currentUsername) {
        return (
          <PowerUpTransactionFrom
            amount={getFormattedTransactionAmount(transactionDetails.amount, 'HP')}
            timestamp={transaction.timestamp}
            to={transactionDetails.to}
            from={transactionDetails.from}
          />
        );
      }
      return (
        <PowerUpTransactionTo
          amount={getFormattedTransactionAmount(transactionDetails.amount, 'HP')}
          timestamp={transaction.timestamp}
          to={transactionDetails.to}
          from={transactionDetails.from}
        />
      );
    case accountHistoryConstants.TRANSFER:
      if (transactionDetails.to === currentUsername) {
        return (
          <ReceiveTransaction
            isGuestPage={isGuestPage}
            from={transactionDetails.from}
            memo={transactionDetails.memo}
            amount={getFormattedTransactionAmount(transactionDetails.amount)}
            timestamp={transaction.timestamp}
          />
        );
      }
      return (
        <TransferTransaction
          isGuestPage={isGuestPage}
          to={transactionDetails.to}
          memo={transactionDetails.memo}
          amount={getFormattedTransactionAmount(transactionDetails.amount)}
          timestamp={transaction.timestamp}
        />
      );
    case accountHistoryConstants.CLAIM_REWARD_BALANCE:
      return (
        <ClaimReward
          timestamp={transaction.timestamp}
          rewardSteem={transactionDetails.reward_steem}
          rewardSbd={transactionDetails.reward_sbd}
          rewardVests={transactionDetails.reward_vests}
          totalVestingShares={totalVestingShares}
          totalVestingFundSteem={totalVestingFundSteem}
        />
      );
    case accountHistoryConstants.TRANSFER_TO_SAVINGS:
    case accountHistoryConstants.TRANSFER_FROM_SAVINGS:
    case accountHistoryConstants.CANCEL_TRANSFER_FROM_SAVINGS:
      return (
        <SavingsTransaction
          transactionDetails={transactionDetails}
          transactionType={transactionType}
          amount={getFormattedTransactionAmount(transactionDetails.amount)}
          timestamp={transaction.timestamp}
        />
      );
    case accountHistoryConstants.LIMIT_ORDER:
      return (
        <WalletLimitOrder
          transactionDetails={transactionDetails}
          timestamp={transaction.timestamp}
        />
      );
    case accountHistoryConstants.FILL_ORDER:
      return (
        <WalletFillOrderTransferred
          transactionDetails={transactionDetails}
          timestamp={transaction.timestamp}
        />
      );
    case accountHistoryConstants.CANCEL_ORDER:
      return (
        <WalletCancelOrder
          transactionDetails={transactionDetails}
          timestamp={transaction.timestamp}
        />
      );
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
};

WalletTransaction.defaultProps = {
  transactionHistory: {},
  isGuestPage: false,
};

export default WalletTransaction;

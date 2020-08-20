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
import PowerUpTransactionTo from './PowerUpTransactionTo';
import WalletProposalPay from './WalletProposalPay';

import './UserWalletTransactions.less';

const getFormattedTransactionAmount = (amount, currency, type) => {
  if (!amount) {
    return null;
  }

  const transaction = amount.split(' ');
  const transactionAmount = parseFloat(transaction[0]);
  const transactionCurrency = currency || transaction[1];

  if (type === accountHistoryConstants.CANCEL_ORDER) {
    if (!transactionAmount) {
      return null;
    }
  }

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
  handleDetailsClick,
}) => {
  const transactionType = isGuestPage ? transaction.op[0] : transaction.type;
  const transactionDetails = isGuestPage ? transaction.op[1] : transaction;
  const fillOrderExchanger =
    currentUsername === transactionDetails.open_owner
      ? transactionDetails.current_owner
      : transactionDetails.open_owner;

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
          amount={getFormattedTransactionAmount(transactionDetails.amount, 'HIVE')}
          timestamp={transaction.timestamp}
          to={transactionDetails.to}
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
            details={transactionDetails.details}
            type={transactionDetails.typeTransfer}
            username={transactionDetails.username}
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
          withdraw={transaction.withdraw}
          getDetails={handleDetailsClick}
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
          openPays={getFormattedTransactionAmount(transactionDetails.open_pays)}
          currentPays={getFormattedTransactionAmount(transactionDetails.current_pays)}
          timestamp={transaction.timestamp}
        />
      );
    case accountHistoryConstants.FILL_ORDER:
      return (
        <WalletFillOrderTransferred
          transactionDetails={transactionDetails}
          currentPays={getFormattedTransactionAmount(transactionDetails.current_pays)}
          openPays={getFormattedTransactionAmount(transactionDetails.open_pays)}
          timestamp={transaction.timestamp}
          exchanger={fillOrderExchanger}
          currentUsername={currentUsername}
        />
      );
    case accountHistoryConstants.CANCEL_ORDER:
      return (
        <WalletCancelOrder
          timestamp={transaction.timestamp}
          openPays={getFormattedTransactionAmount(
            transactionDetails.open_pays,
            undefined,
            transactionType,
          )}
          currentPays={getFormattedTransactionAmount(
            transactionDetails.current_pays,
            undefined,
            transactionType,
          )}
        />
      );
    case accountHistoryConstants.PROPOSAL_PAY:
      return (
        <WalletProposalPay
          receiver={transactionDetails.receiver}
          payment={getFormattedTransactionAmount(transactionDetails.payment)}
          timestamp={transaction.timestamp}
          withdraw={transaction.withdraw}
          getDetails={handleDetailsClick}
          currentUsername={currentUsername}
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
  handleDetailsClick: PropTypes.func,
};

WalletTransaction.defaultProps = {
  isGuestPage: false,
  handleDetailsClick: () => {},
};

export default WalletTransaction;

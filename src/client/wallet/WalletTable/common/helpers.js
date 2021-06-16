import { get, round } from 'lodash';
import {
  dateTableField,
  fillOrderExchanger,
  getFormattedClaimRewardPayout,
  getSavingsTransactionMessage,
  getTransactionDescription,
  getTransactionTableCurrency,
  selectCurrectFillOrderValue,
  validateGuestTransferTitle,
} from '../../WalletHelper';
import * as accountHistoryConstants from '../../../../common/constants/accountHistory';
import { guestUserRegex } from '../../../helpers/regexHelpers';

const compareTransferBody = (transaction, totalVestingShares, totalVestingFundSteem) => {
  const transactionType = transaction.type;
  const user = transaction.userName;
  const isGuestPage = guestUserRegex.test(user);
  let description = '';

  const data = {
    time: dateTableField(transaction.timestamp, isGuestPage),
    hiveUSD: round(get(transaction, 'hiveUSD'), 3),
    hbdUSD: round(get(transaction, 'hbdUSD'), 3),
    withdrawDeposit: get(transaction, 'withdrawDeposit'),
    usd: get(transaction, 'usd'),
    checked: get(transaction, 'checked'),
    userName: user,
    _id: isGuestPage ? get(transaction, '_id') : get(transaction, 'operationNum'),
  };

  switch (transactionType) {
    case accountHistoryConstants.TRANSFER_TO_VESTING: {
      const toVestingAmount = getTransactionTableCurrency(
        transaction.amount,
        transactionType,
        'HP',
      );

      description = getTransactionDescription(transactionType, {
        from: transaction.from,
        to: transaction.to,
      });

      if (transaction.to === user) {
        data.fieldDescription =
          transaction.from === transaction.to
            ? description.powerUpTransaction
            : description.powerUpTransactionFrom;
        data.fieldHP = toVestingAmount.amount;
      } else {
        data.fieldDescription = description.powerUpTransactionTo;
        data.fieldHIVE = `- ${toVestingAmount.amount}`;
      }

      if (transaction.to === transaction.from) {
        data.fieldHP = toVestingAmount.amount;
        data.fieldHIVE = `- ${toVestingAmount.amount}`;
      }

      return data;
    }
    case accountHistoryConstants.TRANSFER: {
      const transferAmount = getTransactionTableCurrency(transaction.amount, transactionType);
      const receiveDescription = getTransactionDescription(transactionType, {
        from: transaction.from,
        to: transaction.to,
      });

      data.fieldMemo = transaction.memo;

      if (transaction.withdrawDeposit === 'd') {
        return {
          ...data,
          fieldHIVE: transferAmount.currency === 'HIVE' && `${transferAmount.amount}`,
          fieldHBD: transferAmount.currency === 'HBD' && `${transferAmount.amount}`,
          fieldDescription:
            transaction.typeTransfer === 'demo_post'
              ? validateGuestTransferTitle(
                  transaction.details,
                  transaction.userName,
                  false,
                  transactionType,
                  true,
                )
              : receiveDescription.receivedFrom,
        };
      }

      return {
        ...data,
        fieldHIVE: transferAmount.currency === 'HIVE' && `- ${transferAmount.amount}`,
        fieldHBD: transferAmount.currency === 'HBD' && `- ${transferAmount.amount}`,
        fieldDescription: receiveDescription.transferredTo,
      };
    }
    case accountHistoryConstants.CLAIM_REWARD_BALANCE: {
      const claimRewardAmounts = getFormattedClaimRewardPayout(
        transaction.reward_hive,
        transaction.reward_hbd,
        transaction.reward_vests,
        totalVestingShares,
        totalVestingFundSteem,
      );

      return {
        ...data,
        fieldHIVE: get(claimRewardAmounts, 'HIVE'),
        fieldHP: get(claimRewardAmounts, 'HP'),
        fieldHBD: get(claimRewardAmounts, 'HBD'),
        fieldDescription: getTransactionDescription(transactionType).claimRewards,
      };
    }
    case accountHistoryConstants.TRANSFER_TO_SAVINGS:
    case accountHistoryConstants.TRANSFER_FROM_SAVINGS:
    case accountHistoryConstants.CANCEL_TRANSFER_FROM_SAVINGS: {
      const transferToSavingAmount = getTransactionTableCurrency(
        transaction.amount,
        transactionType,
      );

      return {
        ...data,
        fieldHIVE:
          get(transferToSavingAmount, 'currency') === 'HIVE' && `${transferToSavingAmount.amount}`,
        fieldHBD:
          get(transferToSavingAmount, 'currency') === 'HBD' && `${transferToSavingAmount.amount}`,
        fieldDescription: getSavingsTransactionMessage(
          transaction.type,
          transaction,
          transaction.amount,
        ),
        fieldMemo: transaction.memo,
      };
    }
    case accountHistoryConstants.LIMIT_ORDER: {
      const currentPaysAmount = getTransactionTableCurrency(
        transaction.current_pays,
        transactionType,
      );
      const limitOrderDescription = getTransactionDescription(transactionType, {
        openPays: transaction.open_pays,
        currentPays: transaction.current_pays,
      });

      return {
        ...data,
        fieldHIVE: currentPaysAmount.currency === 'HIVE' && `${currentPaysAmount.amount}`,
        fieldHBD: currentPaysAmount.currency === 'HBD' && `${currentPaysAmount.amount}`,
        fieldDescription: limitOrderDescription.limitOrder,
      };
    }
    case accountHistoryConstants.POWER_DOWN_WITHDRAW: {
      const isWithdraw = transaction.withdrawDeposit === 'w';

      description = getTransactionDescription(transactionType, {
        from: transaction.from,
        to: transaction.to,
      });

      if (transaction.userName !== transaction.from && transaction.from !== transaction.to) {
        return {
          ...data,
          fieldHIVE: transaction.amount.split(' ')[0],
          fieldDescription: description.powerDownWithdrawFrom,
        };
      }

      return {
        ...data,
        fieldHIVE: `${isWithdraw ? '-' : ''} ${transaction.amount.split(' ')[0]}`,
        fieldDescription:
          transaction.from === transaction.to
            ? description.powerDownWithdraw
            : description.powerDownWithdrawTo,
      };
    }
    case accountHistoryConstants.FILL_ORDER: {
      const fillOrderAmount = selectCurrectFillOrderValue(
        transaction,
        transaction.current_pays,
        transaction.open_pays,
        user,
      );
      const paysAmountReceived = getTransactionTableCurrency(
        fillOrderAmount.received,
        transactionType,
      );
      const paysAmountTransfer = getTransactionTableCurrency(
        fillOrderAmount.transfer,
        transactionType,
      );
      const exchanger = fillOrderExchanger(user, transaction);
      const url = `/@${exchanger}`;
      const fillOrderDescription = getTransactionDescription(transactionType, { url, exchanger });

      if (paysAmountReceived.currency === 'HIVE') {
        data.fieldHIVE = `${paysAmountReceived.amount}`;
        data.fieldHBD = `- ${paysAmountTransfer.amount}`;
      } else {
        data.fieldHIVE = `- ${paysAmountTransfer.amount}`;
        data.fieldHBD = `${paysAmountReceived.amount}`;
      }

      return {
        ...data,
        fieldDescription: fillOrderDescription.fillOrder,
      };
    }
    case accountHistoryConstants.CANCEL_ORDER: {
      const openPaysAmount = getTransactionTableCurrency(transaction.open_pays, transactionType);
      const currentPaysAmount = getTransactionTableCurrency(
        transaction.current_pays,
        transactionType,
      );
      const cancelOrderDescription = getTransactionDescription(transactionType, {
        openPays: transaction.open_pays,
      });

      return {
        ...data,
        fieldDescription: openPaysAmount
          ? cancelOrderDescription.cancelOrder
          : cancelOrderDescription.cancelLimitOrder,
        fieldHIVE: get(currentPaysAmount, 'currency') === 'HIVE' && `${currentPaysAmount.amount}`,
        fieldHBD: get(currentPaysAmount, 'currency') === 'HBD' && `${currentPaysAmount.amount}`,
      };
    }
    case accountHistoryConstants.PROPOSAL_PAY: {
      const proposalAmount = getTransactionTableCurrency(transaction.payment, transactionType);
      const currentUserIsReceiver =
        transaction.receiver === user && transaction.receiver !== 'steem.dao';
      const termsOperation = currentUserIsReceiver ? '' : '- ';
      const proposalDescription = getTransactionDescription(transactionType, {
        receiver: transaction.receiver,
      });

      return {
        ...data,
        fieldHIVE:
          proposalAmount.currency === 'HIVE' && `${termsOperation}${proposalAmount.amount}`,
        fieldHBD: proposalAmount.currency === 'HBD' && `${termsOperation}${proposalAmount.amount}`,
        fieldDescription: currentUserIsReceiver
          ? proposalDescription.proposalPaymentFrom
          : proposalDescription.proposalPaymentTo,
      };
    }

    default:
      return null;
  }
};

export default compareTransferBody;

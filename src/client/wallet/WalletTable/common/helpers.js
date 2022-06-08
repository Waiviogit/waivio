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
import { guestUserRegex } from '../../../../common/helpers/regexHelpers';

const compareTransferBody = (transaction, currency, totalVestingShares, totalVestingFundSteem) => {
  const transactionType = transaction.type || transaction.operation;
  const user = transaction.userName;
  const isGuestPage = guestUserRegex.test(user);
  let description = '';
  const data = {
    time: dateTableField(transaction.timestamp, isGuestPage),
    hiveCurrentCurrency: round(get(transaction, `hive${currency}`), 3),
    waivCurrentCurrency: currency
      ? round(get(transaction, `WAIV.${currency}`), 3)
      : round(get(transaction, 'WAIV.USD'), 3),
    hbdCurrentCurrency: round(get(transaction, `hbd${currency}`), 3),
    withdrawDeposit: get(transaction, 'withdrawDeposit'),
    [currency]: get(transaction, currency),
    checked: get(transaction, 'checked'),
    userName: user,
    _id: isGuestPage ? get(transaction, '_id') : get(transaction, 'operationNum'),
    USD: round(get(transaction, 'USD'), 3),
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

      if (transaction.withdrawDeposit === 'd' || transaction.to === transaction.userName) {
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
    case accountHistoryConstants.CANCEL_LIMIT_ORDER: {
      const cancelLimitOrderAmounts = getFormattedClaimRewardPayout(
        transaction.hiveUSD,
        transaction.hbdUSD,
      );

      return {
        ...data,
        fieldHIVE: get(cancelLimitOrderAmounts, 'HIVE'),
        fieldHP: get(cancelLimitOrderAmounts, 'HP'),
        fieldHBD: get(cancelLimitOrderAmounts, 'HBD'),
        fieldDescription: getTransactionDescription(transactionType).cancelLimitOrder,
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

    case accountHistoryConstants.TOKENS_TRANSFER: {
      data.fieldMemo = transaction.memo;
      data.userName = transaction.account;

      if (transaction.account === transaction.to) {
        return {
          ...data,
          fieldWAIV: transaction.quantity,
          fieldDescription: getTransactionDescription(transactionType, { from: transaction.from })
            .tokensTransferFrom,
        };
      }

      return {
        ...data,
        fieldWAIV: `-${transaction.quantity}`,
        fieldDescription: getTransactionDescription(transactionType, { to: transaction.to })
          .tokensTransferTo,
      };
    }

    case accountHistoryConstants.CURATION_REWARDS: {
      data.userName = transaction.account;
      const fieldWAIVamount =
        transaction.withdrawDeposit === 'w' ? `-${transaction.quantity}` : transaction.quantity;

      return {
        ...data,
        fieldWAIV: fieldWAIVamount,
        fieldDescription: getTransactionDescription(transactionType, {
          authorperm: transaction.authorperm,
        }).curationRewards,
      };
    }
    case accountHistoryConstants.BENEFICIARY_REWARD: {
      data.userName = transaction.account;
      const fieldWAIVamount =
        transaction.withdrawDeposit === 'w' ? `-${transaction.quantity}` : transaction.quantity;

      return {
        ...data,
        fieldWAIV: fieldWAIVamount,
        fieldDescription: getTransactionDescription(transactionType, {
          authorperm: transaction.authorperm,
        }).beneficiaryRewards,
      };
    }
    case accountHistoryConstants.MARKET_BUY: {
      data.userName = transaction.account;
      data.withdrawDeposit = transaction.withdrawDeposit;

      return {
        ...data,
        fieldWAIV: transaction.quantity,
        fieldDescription: getTransactionDescription(transactionType, { accFrom: transaction.from })
          .marketBuy,
      };
    }
    case accountHistoryConstants.MARKET_SELL: {
      data.userName = transaction.account;
      data.withdrawDeposit = transaction.withdrawDeposit;

      return {
        ...data,
        fieldWAIV: `-${transaction.quantity}`,
        fieldDescription: getTransactionDescription(transactionType, { accTo: transaction.to })
          .marketSell,
      };
    }
    case accountHistoryConstants.TOKENS_STAKE: {
      data.userName = transaction.account;

      if (transaction.account === transaction.from && transaction.account !== transaction.to) {
        return {
          ...data,
          fieldWAIV: `-${transaction.quantity}`,

          fieldDescription: getTransactionDescription(transactionType, { to: transaction.to })
            .tokensStakeTo,
        };
      }
      if (transaction.account !== transaction.from && transaction.account === transaction.to) {
        return {
          ...data,
          fieldWP: transaction.quantity,
          fieldDescription: getTransactionDescription(transactionType, { from: transaction.from })
            .tokensStakeFrom,
        };
      }

      return {
        ...data,

        fieldWP: transaction.quantity,
        fieldDescription: getTransactionDescription(transactionType).tokensStake,
      };
    }

    case accountHistoryConstants.MINING_LOTTERY: {
      data.userName = transaction.account;

      return {
        ...data,
        fieldWAIV: transaction.quantity,
        fieldDescription: getTransactionDescription(transactionType).miningLottery,
      };
    }
    case accountHistoryConstants.SWAP_TOKENS: {
      data.userName = transaction.account;
      const fieldWAIVamount =
        transaction.withdrawDeposit === 'w' ? `-${transaction.quantity}` : transaction.quantity;

      return {
        ...data,
        fieldWAIV: fieldWAIVamount,
        fieldDescription: getTransactionDescription(transactionType).swapTokens,
      };
    }
    case accountHistoryConstants.AIRDROP: {
      data.userName = transaction.account;

      return {
        ...data,
        fieldWP: transaction.quantity,
        fieldDescription: getTransactionDescription(transactionType).airdrop,
      };
    }

    case accountHistoryConstants.AUTHOR_REWARDS: {
      data.userName = transaction.account;

      return {
        ...data,
        fieldWAIV: transaction.quantity,
        fieldDescription: getTransactionDescription(transactionType, {
          authorperm: transaction.authorperm,
        }).authorRewards,
      };
    }

    default:
      return null;
  }
};

export default compareTransferBody;

import PropTypes from 'prop-types';
import { get } from 'lodash';
import { injectIntl } from 'react-intl';
import {
  dateTableField,
  fillOrderExchanger,
  getCurrentRows,
  getFormattedClaimRewardPayout,
  getSavingsTransactionMessage,
  getTransactionCurrency,
  getTransactionDescription,
  selectCurrectFillOrderValue,
  validateGuestTransferTitle,
} from '../WalletHelper';
import * as accountHistoryConstants from '../../../common/constants/accountHistory';

import './WalletTable.less';

const WalletTableBodyRow = props => {
  const {
    currentUsername,
    transaction,
    isGuestPage,
    totalVestingShares,
    totalVestingFundSteem,
  } = props;
  const transactionType = transaction.type;
  let description = '';
  const tableView = true;

  let data = {
    time: '',
    fieldHIVE: '',
    fieldHP: '',
    fieldHBD: '',
    fieldDescription: '',
    fieldMemo: '',
    hiveUSD: get(transaction, 'hiveUSD'),
    hbdUSD: get(transaction, 'hbdUSD'),
    withdrawDeposit: get(transaction, 'withdrawDeposit'),
  };

  switch (transactionType) {
    case accountHistoryConstants.TRANSFER_TO_VESTING: {
      const toVestingAmount = getTransactionCurrency(
        transaction.amount,
        'HP',
        transactionType,
        tableView,
      );
      const from = transaction.from;
      const to = transaction.to;
      const options = { from, to };

      if (transaction.to === currentUsername) {
        if (transaction.to === transaction.from) {
          const amountHIVE = `- ${toVestingAmount.amount}`;
          const amountHP = toVestingAmount.amount;

          description = getTransactionDescription(transactionType);

          data = {
            time: dateTableField(transaction.timestamp, isGuestPage),
            fieldHIVE: amountHIVE,
            fieldHP: amountHP,
            fieldDescription: description.powerUpTransaction,
            hiveUSD: get(transaction, 'hiveUSD'),
            hbdUSD: get(transaction, 'hbdUSD'),
            withdrawDeposit: get(transaction, 'withdrawDeposit'),
          };

          return getCurrentRows(data);
        }
        description = getTransactionDescription(transactionType, options);

        data = {
          time: dateTableField(transaction.timestamp, isGuestPage),
          fieldHP: toVestingAmount.amount,
          fieldDescription: description.powerUpTransactionFrom,
          hiveUSD: get(transaction, 'hiveUSD'),
          hbdUSD: get(transaction, 'hbdUSD'),
          withdrawDeposit: get(transaction, 'withdrawDeposit'),
        };

        return getCurrentRows(data);
      }
      description = getTransactionDescription(transactionType, options);
      data = {
        time: dateTableField(transaction.timestamp, isGuestPage),
        fieldHIVE: `- ${toVestingAmount.amount}`,
        fieldDescription: description.powerUpTransactionTo,
        hiveUSD: get(transaction, 'hiveUSD'),
        hbdUSD: get(transaction, 'hbdUSD'),
        withdrawDeposit: get(transaction, 'withdrawDeposit'),
      };

      return getCurrentRows(data);
    }
    case accountHistoryConstants.TRANSFER: {
      const transferAmount = getTransactionCurrency(
        transaction.amount,
        undefined,
        transactionType,
        tableView,
      );
      const demoPost = transaction.typeTransfer === 'demo_post';
      const from = transaction.from;
      const to = transaction.to;
      const options = { from, to };
      const receiveDescription = getTransactionDescription(transactionType, options);

      if (transaction.to === currentUsername) {
        if (from !== to) {
          description = demoPost
            ? validateGuestTransferTitle(
                transaction.details,
                transaction.username,
                undefined,
                transactionType,
                tableView,
              )
            : receiveDescription.receivedFrom;
          data = {
            time: dateTableField(transaction.timestamp, isGuestPage),
            fieldHIVE: transferAmount.currency === 'HIVE' && `${transferAmount.amount}`,
            fieldHBD: transferAmount.currency === 'HBD' && `${transferAmount.amount}`,
            fieldDescription: description,
            fieldMemo: transaction.memo,
            hiveUSD: get(transaction, 'hiveUSD'),
            hbdUSD: get(transaction, 'hbdUSD'),
            withdrawDeposit: get(transaction, 'withdrawDeposit'),
          };

          return getCurrentRows(data);
        }

        return null;
      }
      description = receiveDescription.transferredTo;
      data = {
        time: dateTableField(transaction.timestamp, isGuestPage),
        fieldHIVE: transferAmount.currency === 'HIVE' && `- ${transferAmount.amount}`,
        fieldHBD: transferAmount.currency === 'HBD' && `- ${transferAmount.amount}`,
        fieldDescription: description,
        fieldMemo: transaction.memo,
        hiveUSD: get(transaction, 'hiveUSD'),
        hbdUSD: get(transaction, 'hbdUSD'),
        withdrawDeposit: get(transaction, 'withdrawDeposit'),
      };

      return getCurrentRows(data);
    }
    case accountHistoryConstants.CLAIM_REWARD_BALANCE: {
      const claimRewardAmounts = getFormattedClaimRewardPayout(
        transaction.reward_hive,
        transaction.reward_hbd,
        transaction.reward_vests,
        totalVestingShares,
        totalVestingFundSteem,
      );
      const claimRewardsDescription = getTransactionDescription(transactionType);

      description = claimRewardsDescription.claimRewards;
      data = {
        time: dateTableField(transaction.timestamp, isGuestPage),
        fieldHIVE: get(claimRewardAmounts, 'HIVE'),
        fieldHP: get(claimRewardAmounts, 'HP'),
        fieldHBD: get(claimRewardAmounts, 'HBD'),
        fieldDescription: description,
        hiveUSD: get(transaction, 'hiveUSD'),
        hbdUSD: get(transaction, 'hbdUSD'),
        withdrawDeposit: get(transaction, 'withdrawDeposit'),
      };

      return getCurrentRows(data);
    }
    case accountHistoryConstants.TRANSFER_TO_SAVINGS:
    case accountHistoryConstants.TRANSFER_FROM_SAVINGS:
    case accountHistoryConstants.CANCEL_TRANSFER_FROM_SAVINGS: {
      const transferToSavingAmount = getTransactionCurrency(
        transaction.amount,
        undefined,
        transactionType,
        tableView,
      );

      description = getSavingsTransactionMessage(transaction.type, transaction, transaction.amount);
      data = {
        time: dateTableField(transaction.timestamp, isGuestPage),
        fieldHIVE: transferToSavingAmount.currency === 'HIVE' && `${transferToSavingAmount.amount}`,
        fieldHBD: transferToSavingAmount.currency === 'HBD' && `${transferToSavingAmount.amount}`,
        fieldDescription: description,
        fieldMemo: transaction.memo,
        hiveUSD: get(transaction, 'hiveUSD'),
        hbdUSD: get(transaction, 'hbdUSD'),
        withdrawDeposit: get(transaction, 'withdrawDeposit'),
      };

      return getCurrentRows(data);
    }
    case accountHistoryConstants.LIMIT_ORDER: {
      const currentPaysAmount = getTransactionCurrency(
        transaction.current_pays,
        undefined,
        transactionType,
        tableView,
      );
      const openPays = transaction.open_pays;
      const currentPays = transaction.current_pays;
      const options = { openPays, currentPays };
      const limitOrderDescription = getTransactionDescription(transactionType, options);

      description = limitOrderDescription.limitOrder;
      data = {
        time: dateTableField(transaction.timestamp, isGuestPage),
        fieldHIVE: currentPaysAmount.currency === 'HIVE' && `${currentPaysAmount.amount}`,
        fieldHBD: currentPaysAmount.currency === 'HBD' && `${currentPaysAmount.amount}`,
        fieldDescription: description,
        hiveUSD: get(transaction, 'hiveUSD'),
        hbdUSD: get(transaction, 'hbdUSD'),
        withdrawDeposit: get(transaction, 'withdrawDeposit'),
      };

      return getCurrentRows(data);
    }
    case accountHistoryConstants.FILL_ORDER: {
      const fillOrderAmount = selectCurrectFillOrderValue(
        transaction,
        transaction.current_pays,
        transaction.open_pays,
        currentUsername,
      );
      const paysAmountReceived = getTransactionCurrency(
        fillOrderAmount.received,
        undefined,
        transactionType,
        tableView,
      );
      const paysAmountTransfer = getTransactionCurrency(
        fillOrderAmount.transfer,
        undefined,
        transactionType,
        tableView,
      );
      const exchanger = fillOrderExchanger(currentUsername, transaction);
      const url = `/@${exchanger}`;
      const options = { url, exchanger };
      const fillOrderDescription = getTransactionDescription(transactionType, options);

      description = fillOrderDescription.fillOrder;
      data = {
        time: dateTableField(transaction.timestamp, isGuestPage),
        fieldDescription: description,
        hiveUSD: get(transaction, 'hiveUSD'),
        hbdUSD: get(transaction, 'hbdUSD'),
        withdrawDeposit: get(transaction, 'withdrawDeposit'),
      };
      if (paysAmountReceived.currency === 'HIVE') {
        data.fieldHIVE = `${paysAmountReceived.amount}`;
        data.fieldHBD = `- ${paysAmountTransfer.amount}`;
      } else {
        data.fieldHIVE = `- ${paysAmountTransfer.amount}`;
        data.fieldHBD = `${paysAmountReceived.amount}`;
      }

      return getCurrentRows(data);
    }
    case accountHistoryConstants.CANCEL_ORDER: {
      const openPaysAmount = getTransactionCurrency(
        transaction.open_pays,
        undefined,
        transactionType,
        tableView,
      );
      const currentPaysAmount = getTransactionCurrency(
        transaction.current_pays,
        undefined,
        transactionType,
        tableView,
      );
      const openPays = transaction.open_pays;
      const options = { openPays };
      const cancelOrderDescription = getTransactionDescription(transactionType, options);

      description = openPaysAmount
        ? cancelOrderDescription.cancelOrder
        : cancelOrderDescription.cancelLimitOrder;
      data = {
        time: dateTableField(transaction.timestamp, isGuestPage),
        fieldHIVE:
          currentPaysAmount &&
          currentPaysAmount.currency === 'HIVE' &&
          `${currentPaysAmount.amount}`,
        fieldHBD:
          currentPaysAmount &&
          currentPaysAmount.currency === 'HBD' &&
          `${currentPaysAmount.amount}`,
        fieldDescription: description,
        hiveUSD: get(transaction, 'hiveUSD'),
        hbdUSD: get(transaction, 'hbdUSD'),
        withdrawDeposit: get(transaction, 'withdrawDeposit'),
      };

      return getCurrentRows(data);
    }
    case accountHistoryConstants.PROPOSAL_PAY: {
      const receiver = transaction.receiver;
      const proposalAmount = getTransactionCurrency(
        transaction.payment,
        undefined,
        transactionType,
        tableView,
      );
      const termsOperation = receiver === currentUsername && receiver !== 'steem.dao' ? '' : '- ';
      const options = { receiver };
      const proposalDescription = getTransactionDescription(transactionType, options);

      description =
        receiver === currentUsername && receiver !== 'steem.dao'
          ? proposalDescription.proposalPaymentFrom
          : proposalDescription.proposalPaymentTo;
      data = {
        time: dateTableField(transaction.timestamp, isGuestPage),
        fieldHIVE:
          proposalAmount.currency === 'HIVE' && `${termsOperation}${proposalAmount.amount}`,
        fieldHBD: proposalAmount.currency === 'HBD' && `${termsOperation}${proposalAmount.amount}`,
        fieldDescription: description,
        hiveUSD: get(transaction, 'hiveUSD'),
        hbdUSD: get(transaction, 'hbdUSD'),
        withdrawDeposit: get(transaction, 'withdrawDeposit'),
      };

      return getCurrentRows(data);
    }
    default:
      return null;
  }
};

WalletTableBodyRow.propTypes = {
  transaction: PropTypes.shape(),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  isGuestPage: PropTypes.bool,
  currentUsername: PropTypes.string,
  authUserName: PropTypes.string,
};

WalletTableBodyRow.defaultProps = {
  transaction: {},
  isGuestPage: false,
  currentUsername: '',
  authUserName: '',
};

export default injectIntl(WalletTableBodyRow);

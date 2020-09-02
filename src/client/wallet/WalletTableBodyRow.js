import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
import {
  dateTableField,
  getCurrentRows,
  getFormattedClaimRewardPayout,
  getSavingsTransactionMessage,
  getTransactionCurrency,
  selectCurrectFillOrderValue,
  validateGuestTransferTitle,
} from './WalletHelper';
import * as accountHistoryConstants from '../../common/constants/accountHistory';

import './WalletTable.less';

const WalletTableBodyRow = props => {
  const {
    currentUsername,
    transaction,
    isGuestPage,
    // authUserName,
    totalVestingShares,
    totalVestingFundSteem,
  } = props;
  const transactionType = transaction.type;
  let description = '';

  let data = {
    time: '',
    fieldHIVE: '',
    fieldHP: '',
    fieldHBD: '',
    fieldDescription: '',
    fieldMemo: '',
  };

  switch (transactionType) {
    case accountHistoryConstants.TRANSFER_TO_VESTING: {
      const toVestingAmount = getTransactionCurrency(transaction.amount, 'HP');

      if (transaction.to === currentUsername) {
        if (transaction.to === transaction.from) {
          const amountHIVE = `- ${toVestingAmount.amount}`;
          const amountHP = toVestingAmount.amount;
          description = <FormattedMessage id="powered_up" defaultMessage="Powered up " />;
          data = {
            time: dateTableField(transaction.timestamp, isGuestPage),
            fieldHIVE: amountHIVE,
            fieldHP: amountHP,
            fieldDescription: description,
          };
          return getCurrentRows(data);
        }

        description = (
          <FormattedMessage
            id="powered_up_from"
            defaultMessage="Powered up from {from} "
            values={{
              from: (
                <Link to={`/@${transaction.from}`}>
                  <span className="username">{transaction.from}</span>
                </Link>
              ),
            }}
          />
        );

        data = {
          time: dateTableField(transaction.timestamp, isGuestPage),
          fieldHP: toVestingAmount.amount,
          fieldDescription: description,
        };

        return getCurrentRows(data);
      }
      description = (
        <FormattedMessage
          id="powered_up_to"
          defaultMessage="Powered up to {to} "
          values={{
            to: (
              <Link to={`/@${transaction.to}`}>
                <span className="username">{transaction.to}</span>
              </Link>
            ),
          }}
        />
      );
      data = {
        time: dateTableField(transaction.timestamp, isGuestPage),
        fieldHIVE: `- ${toVestingAmount.amount}`,
        fieldHP: toVestingAmount.amount,
        fieldDescription: description,
      };
      return getCurrentRows(data);
    }
    case accountHistoryConstants.TRANSFER: {
      const transferAmount = getTransactionCurrency(transaction.amount);
      const demoPost = transaction.type === 'demo_post';
      if (transaction.to === currentUsername) {
        description = demoPost ? (
          validateGuestTransferTitle(transaction.details, transaction.username)
        ) : (
          <FormattedMessage
            id="received_from"
            defaultMessage="Received from {username}"
            values={{
              username: (
                <Link to={`/@${transaction.from}`}>
                  <span className="username">{transaction.from}</span>
                </Link>
              ),
            }}
          />
        );
        data = {
          time: dateTableField(transaction.timestamp, isGuestPage),
          fieldHIVE: transferAmount.currency === 'HIVE' && `${transferAmount.amount}`,
          fieldHBD: transferAmount.currency === 'HBD' && `${transferAmount.amount}`,
          fieldDescription: description,
          fieldMemo: transaction.memo,
        };
        return getCurrentRows(data);
      }
      description = (
        <FormattedMessage
          id="transferred_to"
          defaultMessage="Transferred to {username}"
          values={{
            username: (
              <Link to={`/@${transaction.to}`}>
                <span className="username">{transaction.to}</span>
              </Link>
            ),
          }}
        />
      );
      data = {
        time: dateTableField(transaction.timestamp, isGuestPage),
        fieldHIVE: transferAmount.currency === 'HIVE' && `- ${transferAmount.amount}`,
        fieldHBD: transferAmount.currency === 'HBD' && `- ${transferAmount.amount}`,
        fieldDescription: description,
        fieldMemo: transaction.memo,
      };
      return getCurrentRows(data);
    }
    case accountHistoryConstants.CLAIM_REWARD_BALANCE: {
      const claimRewardAmounts = getFormattedClaimRewardPayout(
        transaction.reward_steem,
        transaction.reward_sbd,
        transaction.reward_vests,
        totalVestingShares,
        totalVestingFundSteem,
      );
      description = <FormattedMessage id="claim_rewards" defaultMessage="Claim rewards" />;
      data = {
        time: dateTableField(transaction.timestamp, isGuestPage),
        fieldHIVE: get(claimRewardAmounts, 'HIVE'),
        fieldHP: get(claimRewardAmounts, 'HBD'),
        fieldHBD: get(claimRewardAmounts, 'HP'),
        fieldDescription: description,
      };
      return getCurrentRows(data);
    }
    case accountHistoryConstants.TRANSFER_TO_SAVINGS:
    case accountHistoryConstants.TRANSFER_FROM_SAVINGS:
    case accountHistoryConstants.CANCEL_TRANSFER_FROM_SAVINGS: {
      const transferToSavingAmount = getTransactionCurrency(transaction.amount);
      description = getSavingsTransactionMessage(transaction.type, transaction, transaction.amount);
      data = {
        time: dateTableField(transaction.timestamp, isGuestPage),
        fieldHIVE: transferToSavingAmount.currency === 'HIVE' && `${transferToSavingAmount.amount}`,
        fieldHBD: transferToSavingAmount.currency === 'HBD' && `${transferToSavingAmount.amount}`,
        fieldDescription: description,
        fieldMemo: transaction.memo,
      };
      return getCurrentRows(data);
    }
    case accountHistoryConstants.LIMIT_ORDER: {
      const currentPaysAmount = getTransactionCurrency(transaction.current_pays);
      description = (
        <FormattedMessage
          id="table_limit_order"
          defaultMessage="Limit order to buy {open_pays} for {current_pays}"
          values={{
            open_pays: <span>{transaction.open_pays}</span>,
            current_pays: <span>{transaction.current_pays}</span>,
          }}
        />
      );
      data = {
        time: dateTableField(transaction.timestamp, isGuestPage),
        fieldHIVE: currentPaysAmount.currency === 'HIVE' && `${currentPaysAmount.amount}`,
        fieldHBD: currentPaysAmount.currency === 'HBD' && `${currentPaysAmount.amount}`,
        fieldDescription: description,
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
      const paysAmountReceived = getTransactionCurrency(fillOrderAmount.received);
      const paysAmountTransfer = getTransactionCurrency(fillOrderAmount.transfer);
      const fillOrderExchanger =
        currentUsername === transaction.open_owner
          ? transaction.current_owner
          : transaction.open_owner;

      description = (
        <FormattedMessage
          id="exchange_with"
          defaultMessage="Exchange with {exchanger}"
          values={{
            exchanger: (
              <Link to={`/@${fillOrderExchanger}`}>
                <span className="username">{fillOrderExchanger}</span>
              </Link>
            ),
          }}
        />
      );
      data = {
        time: dateTableField(transaction.timestamp, isGuestPage),
        fieldDescription: description,
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
      );
      const currentPaysAmount = getTransactionCurrency(
        transaction.current_pays,
        undefined,
        transactionType,
      );
      description = openPaysAmount ? (
        <FormattedMessage
          id="cancel_order"
          defaultMessage="Cancel order to buy {open_pays}"
          values={{
            open_pays: <span className="cancel-order-open-pays">{transaction.open_pays}</span>,
          }}
        />
      ) : (
        <FormattedMessage id="cancel_limit_order" defaultMessage="Cancel limit order" />
      );
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
      };
      return getCurrentRows(data);
    }
    case accountHistoryConstants.PROPOSAL_PAY: {
      const receiver = transaction.receiver;
      const proposalAmount = getTransactionCurrency(transaction.payment);
      const termsOperation = receiver === currentUsername && receiver !== 'steem.dao' ? '' : '- ';
      description =
        receiver === currentUsername && receiver !== 'steem.dao' ? (
          <FormattedMessage
            id="proposal_payment_from"
            defaultMessage="Proposal payment from {steem_dao}"
            values={{
              steem_dao: (
                <Link to={`/@steem.dao`}>
                  <span className="username">steem.dao</span>
                </Link>
              ),
            }}
          />
        ) : (
          <FormattedMessage
            id="proposal_payment_to"
            defaultMessage="Proposal payment to {receiver}"
            values={{
              receiver: (
                <Link to={`/@${receiver}`}>
                  <span className="username">{receiver}</span>
                </Link>
              ),
            }}
          />
        );
      data = {
        time: dateTableField(transaction.timestamp, isGuestPage),
        fieldHIVE:
          proposalAmount.currency === 'HIVE' && `${termsOperation}${proposalAmount.amount}`,
        fieldHBD: proposalAmount.currency === 'HBD' && `${termsOperation}${proposalAmount.amount}`,
        fieldDescription: description,
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

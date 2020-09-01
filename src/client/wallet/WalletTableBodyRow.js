import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { dateTableField, getCurrentRows, getTransactionCurrency } from './WalletHelper';
import * as accountHistoryConstants from '../../common/constants/accountHistory';

import './WalletTable.less';

const WalletTableBodyRow = props => {
  const { currentUsername, transaction, isGuestPage } = props;
  console.log('transaction: ', transaction);
  const transactionType = transaction.type;
  let description = '';

  let data = {
    time: '',
    fieldHIVE: '',
    fieldHP: '',
    fieldHBD: '',
    fieldDescription: description,
  };

  switch (transactionType) {
    case accountHistoryConstants.TRANSFER_TO_VESTING: {
      const current = getTransactionCurrency(transaction.amount, 'HP');

      if (transaction.to === currentUsername) {
        // PowerUpTransactionFrom
        if (transaction.to === transaction.from) {
          const amountHIVE = `- ${current.amount}`;
          const amountHP = current.amount;
          description = <FormattedMessage id="powered_up" defaultMessage="Powered up " />;
          data = {
            time: dateTableField(transaction.timestamp, isGuestPage),
            fieldHIVE: amountHIVE,
            fieldHP: amountHP,
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
          fieldHIVE: '',
          fieldHP: current.amount,
          fieldHBD: '',
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
        fieldHIVE: `- ${current.amount}`,
        fieldHP: current.amount,
        fieldHBD: '',
      };
      return getCurrentRows(data);
    }
    case accountHistoryConstants.TRANSFER:
      if (transaction.to === currentUsername) {
        // ReceiveTransaction
        return null;
      }
      // TransferTransaction
      return null;
    case accountHistoryConstants.CLAIM_REWARD_BALANCE:
      return null;
    case accountHistoryConstants.TRANSFER_TO_SAVINGS:
    case accountHistoryConstants.TRANSFER_FROM_SAVINGS:
    case accountHistoryConstants.CANCEL_TRANSFER_FROM_SAVINGS:
      return null;
    case accountHistoryConstants.LIMIT_ORDER:
      return null;
    case accountHistoryConstants.FILL_ORDER:
      return null;
    case accountHistoryConstants.CANCEL_ORDER:
      return null;
    case accountHistoryConstants.PROPOSAL_PAY:
      return null;
    default:
      return null;
  }

  // if (isGuestPage) {
  //   return (
  //     <React.Fragment>
  //       <tr>
  //         <td>{dateTableField(transaction.timestamp, isGuestPage)}</td>
  //         <td>{transaction.amount}</td>
  //         <td />
  //         <td />
  //         <td>lolka5</td>
  //         <td>{transaction.memo}</td>
  //       </tr>
  //     </React.Fragment>
  //   )
  // }
  // const currentAmount = getTransactionCurrency();
  // return (
  //   <React.Fragment>
  //     <tr>
  //       <td>{dateTableField(transaction.timestamp, isGuestPage)}</td>
  //       <td>{}</td>
  //       <td>lolka3</td>
  //       <td>lolka4</td>
  //       <td>lolka5</td>
  //       <td>lolka6</td>
  //     </tr>
  //   </React.Fragment>
  // )
};

WalletTableBodyRow.propTypes = {
  transaction: PropTypes.shape(),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  isGuestPage: PropTypes.bool,
  currentUsername: PropTypes.string,
};

WalletTableBodyRow.defaultProps = {
  transaction: {},
  isGuestPage: false,
  currentUsername: '',
};

export default injectIntl(WalletTableBodyRow);

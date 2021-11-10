import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Avatar from '../../components/Avatar';
import { getTransactionDescription } from '../WalletHelper';
import CardsTimeStamp from './CardsTimeStamp';

const TransferTransaction = ({
  to,
  memo,
  amount,
  timestamp,
  isGuestPage,
  withdraw,
  getDetails,
  transactionType,
}) => {
  const options = { to };
  const description = getTransactionDescription(transactionType, options);

  return (
    <div className="UserWalletTransactions__transaction">
      <div className="UserWalletTransactions__avatar">
        <Avatar username={to} size={40} />
      </div>
      <div className="UserWalletTransactions__content">
        <div className="UserWalletTransactions__content-recipient">
          <div>{description.transferredTo}</div>
          <div className="UserWalletTransactions__transfer">
            {'- '}
            {amount}
          </div>
        </div>
        <CardsTimeStamp timestamp={isGuestPage ? `${timestamp}Z` : timestamp} />
        <span className="UserWalletTransactions__memo">{memo}</span>
        {withdraw && (
          <a onClick={() => getDetails(withdraw)} role="presentation">
            <FormattedMessage id="details" defaultMessage="Details" />
          </a>
        )}
      </div>
    </div>
  );
};

TransferTransaction.propTypes = {
  to: PropTypes.string,
  memo: PropTypes.string,
  amount: PropTypes.element,
  timestamp: PropTypes.number,
  isGuestPage: PropTypes.bool,
  withdraw: PropTypes.string,
  getDetails: PropTypes.func,
  transactionType: PropTypes.string.isRequired,
};

TransferTransaction.defaultProps = {
  to: '',
  memo: '',
  amount: <span />,
  timestamp: 0,
  isGuestPage: false,
  withdraw: '',
  getDetails: () => {},
};

export default TransferTransaction;

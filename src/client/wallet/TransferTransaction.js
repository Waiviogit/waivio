import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedRelative, FormattedDate, FormattedTime } from 'react-intl';
import BTooltip from '../components/BTooltip';
import Avatar from '../components/Avatar';
import { epochToUTC } from '../helpers/formatter';
import { getTransactionDescription } from './WalletHelper';

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
        <span className="UserWalletTransactions__timestamp">
          {isGuestPage ? (
            <BTooltip
              title={
                <span>
                  <FormattedDate value={`${timestamp}Z`} />{' '}
                  <FormattedTime value={`${timestamp}Z`} />
                </span>
              }
            >
              <span>
                <FormattedRelative value={`${timestamp}Z`} />
              </span>
            </BTooltip>
          ) : (
            <BTooltip
              title={
                <span>
                  <FormattedRelative value={epochToUTC(timestamp)} />
                </span>
              }
            >
              <span>
                <FormattedRelative value={epochToUTC(timestamp)} />
              </span>
            </BTooltip>
          )}
        </span>
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

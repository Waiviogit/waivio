import React from 'react';
import PropTypes from 'prop-types';
import { getTransactionDescription } from '../WalletHelper';
import CardsTimeStamp from './CardsTimeStamp';

const PowerUpTransactionTo = ({ timestamp, amount, to, transactionType }) => {
  const options = { to };
  const description = getTransactionDescription(transactionType, options);

  return (
    <div className="UserWalletTransactions__transaction">
      <div className="UserWalletTransactions__icon-container">
        <i className="iconfont icon-flashlight_fill UserWalletTransactions__icon" />
      </div>
      <div className="UserWalletTransactions__content">
        <div className="UserWalletTransactions__content-recipient">
          <div>{description.powerUpTransactionTo}</div>
          <span className="UserWalletTransactions__transfer">
            {'- '}
            {amount}
          </span>
        </div>
        <CardsTimeStamp timestamp={timestamp} />
      </div>
    </div>
  );
};

PowerUpTransactionTo.propTypes = {
  timestamp: PropTypes.number.isRequired,
  amount: PropTypes.element.isRequired,
  to: PropTypes.string.isRequired,
  transactionType: PropTypes.string.isRequired,
};

export default PowerUpTransactionTo;

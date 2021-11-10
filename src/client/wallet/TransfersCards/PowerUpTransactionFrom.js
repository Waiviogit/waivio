import React from 'react';
import PropTypes from 'prop-types';
import { getTransactionDescription } from '../WalletHelper';
import CardsTimeStamp from './CardsTimeStamp';

const PowerUpTransactionFrom = ({ timestamp, amount, from, to, transactionType }) => {
  const options = { from };
  const description = getTransactionDescription(transactionType, options);

  return (
    <div className="UserWalletTransactions__transaction">
      <div className="UserWalletTransactions__icon-container">
        <i className="iconfont icon-flashlight_fill UserWalletTransactions__icon" />
      </div>
      <div className="UserWalletTransactions__content">
        <div className="UserWalletTransactions__content-recipient">
          {to === from ? (
            <React.Fragment>
              {description.powerUpTransaction}
              <span className="UserWalletTransactions__payout-black">{amount}</span>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {description.powerUpTransactionFrom}
              <span className="UserWalletTransactions__received">
                {'+ '}
                {amount}
              </span>
            </React.Fragment>
          )}
        </div>
        <CardsTimeStamp timestamp={timestamp} />
      </div>
    </div>
  );
};

PowerUpTransactionFrom.propTypes = {
  timestamp: PropTypes.number.isRequired,
  amount: PropTypes.element.isRequired,
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  transactionType: PropTypes.string.isRequired,
};

export default PowerUpTransactionFrom;

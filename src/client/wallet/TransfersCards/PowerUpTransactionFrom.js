import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { getTransactionDescription } from '../WalletHelper';
import CardsTimeStamp from './CardsTimeStamp';

const PowerUpTransactionFrom = ({ timestamp, amount, from, to, transactionType, currentUser }) => {
  const options = { from, to };
  const description = getTransactionDescription(transactionType, options);
  const isSent = currentUser === to;
  const amountClassList = classNames({
    UserWalletTransactions__received: isSent,
    UserWalletTransactions__sent: !isSent,
  });

  return (
    <div className="UserWalletTransactions__transaction">
      <div className="UserWalletTransactions__icon-container">
        <i className="iconfont icon-flashlight_fill UserWalletTransactions__icon" />
      </div>
      <div className="UserWalletTransactions__content">
        <div className="UserWalletTransactions__content-recipient">
          {to === from ? (
            <React.Fragment>
              <div>{description.powerUpTransaction}</div>
              <span className="UserWalletTransactions__payout-black">{amount}</span>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {isSent ? description.powerUpTransactionFrom : description.powerUpTransactionTo}
              <span className={amountClassList}>
                {isSent ? '+ ' : '- '}
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
  currentUser: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
  amount: PropTypes.element.isRequired,
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  transactionType: PropTypes.string.isRequired,
};

export default PowerUpTransactionFrom;

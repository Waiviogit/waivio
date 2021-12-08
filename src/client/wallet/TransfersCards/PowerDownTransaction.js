import React from 'react';
import PropTypes from 'prop-types';
import CardsTimeStamp from './CardsTimeStamp';

const PowerDownTransaction = ({ timestamp, amount, description, color }) => {
  const formatNumber = num => num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

  return (
    <div className="UserWalletTransactions__transaction">
      <div className="UserWalletTransactions__icon-container">
        <i className="iconfont icon-flashlight_fill UserWalletTransactions__icon" />
      </div>
      <div className="UserWalletTransactions__content">
        <div className="UserWalletTransactions__content-recipient">
          {description}
          <span
            className={`UserWalletTransactions__marginLeft UserWalletTransactions__amountColor--${color}`}
          >
            {formatNumber(amount)}
          </span>
        </div>
        <CardsTimeStamp timestamp={timestamp} />
      </div>
    </div>
  );
};

PowerDownTransaction.propTypes = {
  timestamp: PropTypes.number.isRequired,
  amount: PropTypes.string.isRequired,
  color: PropTypes.string,
  description: PropTypes.shape({}).isRequired,
};

PowerDownTransaction.defaultProps = {
  color: '',
};

export default PowerDownTransaction;

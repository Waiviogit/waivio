import React from 'react';
import PropTypes from 'prop-types';
import CardsTimeStamp from './CardsTimeStamp';

const PowerDownTransaction = ({ timestamp, amount, description }) => (
  <div className="UserWalletTransactions__transaction">
    <div className="UserWalletTransactions__icon-container">
      <i className="iconfont icon-flashlight_fill UserWalletTransactions__icon" />
    </div>
    <div className="UserWalletTransactions__content">
      <div className="UserWalletTransactions__content-recipient">
        {description}
        <span className={'UserWalletTransactions__marginLeft'}>{amount}</span>
      </div>
      <CardsTimeStamp timestamp={timestamp} />
    </div>
  </div>
);

PowerDownTransaction.propTypes = {
  timestamp: PropTypes.number.isRequired,
  amount: PropTypes.string.isRequired,
  description: PropTypes.shape({}).isRequired,
};

export default PowerDownTransaction;

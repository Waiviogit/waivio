import React from 'react';
import PropTypes from 'prop-types';
import CardsTimeStamp from './CardsTimeStamp';

const PowerDownCanceledCard = ({ timestamp, amount }) => (
  <div className="UserWalletTransactions__transaction">
    <div className="UserWalletTransactions__icon-container">
      <i className="iconfont icon-flashlight_fill UserWalletTransactions__icon" />
    </div>
    <div className="UserWalletTransactions__content">
      <div className="UserWalletTransactions__content-recipient">
        <div>Canceled power down</div>
        <span className={'UserWalletTransactions__marginLeft'}>{amount}</span>
      </div>
      <CardsTimeStamp timestamp={timestamp} />
    </div>
  </div>
);

PowerDownCanceledCard.propTypes = {
  timestamp: PropTypes.number.isRequired,
  amount: PropTypes.number.isRequired,
};

export default PowerDownCanceledCard;

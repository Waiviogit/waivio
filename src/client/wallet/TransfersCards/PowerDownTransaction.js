import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import CardsTimeStamp from './CardsTimeStamp';

const PowerDownTransaction = ({ timestamp, amount, description, color }) => {
  const amountClassList = classNames('UserWalletTransactions__marginLeft', {
    [`UserWalletTransactions__marginLeft--${color}`]: color,
  });

  return (
    <div className="UserWalletTransactions__transaction">
      <div className="UserWalletTransactions__icon-container">
        <i className="iconfont icon-flashlight_fill UserWalletTransactions__icon" />
      </div>
      <div className="UserWalletTransactions__content">
        <div className="UserWalletTransactions__content-recipient">
          <div>{description}</div>
          <span className={amountClassList}>{amount}</span>
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
  color: 'black',
};

export default PowerDownTransaction;

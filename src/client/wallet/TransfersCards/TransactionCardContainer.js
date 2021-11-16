import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { round } from 'lodash';
import classNames from 'classnames';

import CardsTimeStamp from './CardsTimeStamp';

const TransactionCardContainer = ({
  timestamp,
  quantity,
  symbol,
  children,
  iconType,
  color,
  point,
}) => {
  const amountClassList = classNames('UserWalletTransactions__marginLeft', {
    [`UserWalletTransactions__amount--${color}`]: color,
  });

  return (
    <div className="UserWalletTransactions__transaction">
      <div className="UserWalletTransactions__icon-container">
        <Icon type={iconType} className="UserWalletTransactions__icon" />
      </div>
      <div className="UserWalletTransactions__content">
        <div className="UserWalletTransactions__content-recipient">
          {children}
          {!!quantity && (
            <span className={amountClassList}>
              {point} {round(quantity, 3)} {symbol}
            </span>
          )}
        </div>
        <CardsTimeStamp timestamp={timestamp} />
      </div>
    </div>
  );
};

TransactionCardContainer.propTypes = {
  timestamp: PropTypes.number.isRequired,
  quantity: PropTypes.string,
  color: PropTypes.string,
  iconType: PropTypes.string.isRequired,
  point: PropTypes.string,
  children: PropTypes.node.isRequired,
  symbol: PropTypes.string,
};

TransactionCardContainer.defaultProps = {
  quantity: 0,
  symbol: '',
  color: '',
  point: '',
};

export default TransactionCardContainer;

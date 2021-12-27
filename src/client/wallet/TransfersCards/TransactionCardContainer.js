import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import classNames from 'classnames';
import { FormattedNumber } from 'react-intl';

import CardsTimeStamp from './CardsTimeStamp';
import Avatar from '../../components/Avatar';

const TransactionCardContainer = ({
  timestamp,
  quantity,
  symbol,
  children,
  iconType,
  color,
  point,
  account,
}) => {
  const amountClassList = classNames('UserWalletTransactions__marginLeft', {
    [`UserWalletTransactions__amount--${color}`]: color,
  });

  return (
    <div className="UserWalletTransactions__transaction">
      {account ? (
        <Avatar size={40} username={account} />
      ) : (
        <div className="UserWalletTransactions__icon-container">
          <Icon
            type={iconType}
            style={{ fontSize: '16px' }}
            className="UserWalletTransactions__icon"
          />
        </div>
      )}
      <div className="UserWalletTransactions__content">
        <div className="UserWalletTransactions__content-recipient">
          {children}
          {!!quantity && (
            <span className={amountClassList}>
              {point}{' '}
              <FormattedNumber value={quantity} locale={'en-IN'} maximumFractionDigits={3} />{' '}
              {symbol}
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
  quantity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  color: PropTypes.string,
  iconType: PropTypes.string.isRequired,
  point: PropTypes.string,
  account: PropTypes.string,
  children: PropTypes.node.isRequired,
  symbol: PropTypes.string,
};

TransactionCardContainer.defaultProps = {
  quantity: 0,
  symbol: '',
  color: '',
  point: '',
  account: '',
};

export default TransactionCardContainer;

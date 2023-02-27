import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { isInteger } from 'lodash';
import classNames from 'classnames';
import { FormattedNumber } from 'react-intl';
import Avatar from '../../components/Avatar';
import CardsTimeStamp from './CardsTimeStamp';

const TransactionCardContainer = ({
  timestamp,
  quantity,
  symbol,
  children,
  iconType,
  color,
  account,
  fractionDigits,
  memo,
}) => {
  const amountClassList = classNames('UserWalletTransactions__marginLeft', {
    [`UserWalletTransactions__amount--${color}`]: color,
  });
  const point = color === 'red' ? '-' : '+';
  const minimumFractionDigits = isInteger(Number(quantity)) ? 0 : 3;

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
              {color ? point : ''}{' '}
              <FormattedNumber
                value={quantity}
                locale={'en-IN'}
                minimumFractionDigits={minimumFractionDigits}
                maximumFractionDigits={fractionDigits || 3}
              />{' '}
              {symbol}
            </span>
          )}
        </div>
        {memo && <div className="UserWalletTransactions__memo">{memo}</div>}
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
  account: PropTypes.string,
  memo: PropTypes.string,
  fractionDigits: PropTypes.number,
  children: PropTypes.node.isRequired,
  symbol: PropTypes.string,
};

TransactionCardContainer.defaultProps = {
  quantity: 0,
  fractionDigits: 0,
  symbol: '',
  color: '',
  point: '',
  account: '',
  memo: '',
};

export default TransactionCardContainer;

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import TransactionCardContainer from './TransactionCardContainer';

const MarketCancel = ({ timestamp, quantity, orderType, symbol }) => (
  <TransactionCardContainer
    timestamp={timestamp}
    quantity={quantity}
    symbol={symbol}
    iconType={'close'}
  >
    <span>
      <FormattedMessage id={`cancel_order_to_${orderType}`} defaultMessage="Cancel order" />{' '}
    </span>
  </TransactionCardContainer>
);

MarketCancel.propTypes = {
  timestamp: PropTypes.number.isRequired,
  quantity: PropTypes.string.isRequired,
  orderType: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
};

export default MarketCancel;

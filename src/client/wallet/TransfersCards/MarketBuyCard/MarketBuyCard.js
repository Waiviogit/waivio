import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Icon } from 'antd';
import CardsTimeStamp from '../CardsTimeStamp';
import './MarketBuyCard.less';

const MarketBuyCard = ({
  timestamp,
  price,
  quantity,
  quantityLocked,
  symbol,
  fractionDigits,
  orderType,
}) => {
  const isLimitOrder = orderType === 'sell' || orderType === 'buy';
  const isMarketOrder = orderType === 'marketSell' ? 'sell' : 'buy';
  const isSell = orderType === 'sell';

  return (
    <div className="UserWalletTransactions__transaction">
      <div className="UserWalletTransactions__icon-container">
        <Icon type={'tag'} style={{ fontSize: '16px' }} className="UserWalletTransactions__icon" />
      </div>
      <div className="UserWalletTransactions__content">
        <div className="UserWalletTransactions__content-recipient">
          <div>
            <FormattedMessage
              id={isLimitOrder ? `limit_order_to_${orderType}` : `market_order_to_${isMarketOrder}`}
              defaultMessage={
                isLimitOrder ? `Limit order to ${orderType}` : `Market order to ${isMarketOrder}`
              }
            />
          </div>
          <span className="UserWalletTransactions__marginLeft">
            {' '}
            <FormattedNumber
              value={isLimitOrder ? price : quantityLocked}
              locale={'en-IN'}
              minimumFractionDigits={3}
              maximumFractionDigits={fractionDigits || 3}
            />{' '}
            {isLimitOrder ? `per ${symbol}` : symbol}
          </span>{' '}
          {isLimitOrder && (
            <span className="UserWalletTransactions__marginLeft MarketBuyCard__quantity">
              {'  '}
              <FormattedNumber
                value={isSell ? quantityLocked : quantity}
                locale={'en-IN'}
                minimumFractionDigits={3}
                maximumFractionDigits={fractionDigits || 3}
              />{' '}
              {symbol}
            </span>
          )}
        </div>
        <CardsTimeStamp timestamp={timestamp} />
      </div>
    </div>
  );
};

MarketBuyCard.propTypes = {
  price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  quantityLocked: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  timestamp: PropTypes.number.isRequired,
  quantity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  fractionDigits: PropTypes.number,
  orderType: PropTypes.string.isRequired,
  symbol: PropTypes.string,
};

MarketBuyCard.defaultProps = {
  price: 0,
  quantityLocked: 0,
  quantityBuy: 0,
  quantity: 0,
  fractionDigits: 0,
  symbol: '',
  point: '',
  account: '',
  memo: '',
};

export default MarketBuyCard;

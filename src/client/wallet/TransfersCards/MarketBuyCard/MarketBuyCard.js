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
  const minFractionDigits = 0;

  return (
    <div className="UserWalletTransactions__transaction">
      <div className="UserWalletTransactions__icon-container">
        <Icon type={'tag'} style={{ fontSize: '16px' }} className="UserWalletTransactions__icon" />
      </div>
      <div className="UserWalletTransactions__content">
        <div className="UserWalletTransactions__content-recipient SwapTokenCard__amount_column">
          <div>
            <FormattedMessage
              id={isLimitOrder ? `limit_order_to_${orderType}` : `market_order_to_${isMarketOrder}`}
              defaultMessage={isLimitOrder ? 'Limit order' : `Market order to ${isMarketOrder}`}
            />
          </div>
          {!isLimitOrder ? (
            <React.Fragment>
              <span>
                {' '}
                <FormattedNumber
                  value={quantityLocked}
                  locale={'en-IN'}
                  minimumFractionDigits={minFractionDigits}
                  maximumFractionDigits={fractionDigits || 3}
                />{' '}
                {symbol}
              </span>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className="MarketBuyCard__amount-pair">
                <span>
                  <FormattedNumber
                    value={quantityLocked}
                    locale={'en-IN'}
                    minimumFractionDigits={minFractionDigits}
                    maximumFractionDigits={fractionDigits || 3}
                  />{' '}
                  {isSell ? symbol : 'SWAP.HIVE'}
                </span>
                <div className="MarketBuyCard__space">{'>'}</div>
                <span className="MarketBuyCard__quantity ">
                  <FormattedNumber
                    value={quantity}
                    locale={'en-IN'}
                    minimumFractionDigits={minFractionDigits}
                    maximumFractionDigits={fractionDigits || 3}
                  />{' '}
                  {isSell ? 'SWAP.HIVE' : symbol}
                </span>
              </div>
            </React.Fragment>
          )}
        </div>
        <div className="MarketBuyCard__lower-text">
          <CardsTimeStamp timestamp={timestamp} />
          {isLimitOrder && (
            <div className="MarketBuyCard__per-waiv">
              {' '}
              <FormattedNumber
                value={price}
                locale={'en-IN'}
                minimumFractionDigits={minFractionDigits}
                maximumFractionDigits={fractionDigits || 3}
              />{' '}
              {`per ${symbol}`}
            </div>
          )}
        </div>
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

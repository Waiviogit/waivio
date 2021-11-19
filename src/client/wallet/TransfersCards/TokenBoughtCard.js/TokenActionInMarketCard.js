import React from 'react';
import { Icon } from 'antd';
import { round } from 'lodash';
import PropTypes from 'prop-types';
import CardsTimeStamp from '../CardsTimeStamp';

import './TokenBoughtCard.less';

const TokenActionInMarketCard = ({ account, symbol, quantity, timestamp, action }) => {
  const cardInfo =
    action === 'bought'
      ? {
          color: 'green',
          point: '+',
        }
      : {
          color: 'red',
          point: '-',
        };

  return (
    <div className="TokenBoughtCard">
      <div className="UserWalletTransactions__icon-container">
        <Icon type="tags-o" />
      </div>
      <div className="TokenBoughtCard__info-container">
        <div>
          <p>
            <a href={`/@${account}`} className="TokenBoughtCard__userName">
              {account}
            </a>{' '}
            {action} {symbol}
          </p>
          <CardsTimeStamp timestamp={timestamp} />
        </div>
        <span className={`TokenBoughtCard__quantity--${cardInfo.color}`}>
          {cardInfo.point} {round(quantity, 3)} {symbol}
        </span>
      </div>
    </div>
  );
};

TokenActionInMarketCard.propTypes = {
  quantity: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
  account: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
};

export default TokenActionInMarketCard;

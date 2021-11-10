import React from 'react';
import { Icon } from 'antd';
import { round } from 'lodash';
import PropTypes from 'prop-types';
import CardsTimeStamp from '../CardsTimeStamp';

import './TokenBoughtCard.less';

const TokenBoughtCard = ({ account, symbol, quantity, timestamp }) => (
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
          bought {symbol}
        </p>
        <CardsTimeStamp timestamp={timestamp} />
      </div>
      <span className="TokenBoughtCard__quantity">
        + {round(quantity, 3)} {symbol}
      </span>
    </div>
  </div>
);

TokenBoughtCard.propTypes = {
  quantity: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  account: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
};

export default TokenBoughtCard;

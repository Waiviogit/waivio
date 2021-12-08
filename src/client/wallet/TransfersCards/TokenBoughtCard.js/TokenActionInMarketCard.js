import React from 'react';
import { round } from 'lodash';
import PropTypes from 'prop-types';
import CardsTimeStamp from '../CardsTimeStamp';
import Avatar from '../../../components/Avatar';

import './TokenBoughtCard.less';

const TokenActionInMarketCard = ({ from, to, account, symbol, quantity, timestamp, action }) => {
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

  const recipient = from ? `from ${from}` : to && `to ${to}`;

  return (
    <div className="TokenBoughtCard">
      <div className="UserWalletTransactions__icon-container">
        <Avatar username={account} size={40} />
      </div>
      <div className="TokenBoughtCard__info-container">
        <div>
          <p>
            <a href={`/@${account}`} className="TokenBoughtCard__userName">
              {account}
            </a>{' '}
            {action} {symbol}
            <br />
            {recipient}
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
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

export default TokenActionInMarketCard;

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import classNames from 'classnames';
import { Icon } from 'antd';
import './TokenBoughtCard.less';
import Avatar from '../../../components/Avatar';
import CardsTimeStamp from '../CardsTimeStamp';

const TokenActionInMarketCard = ({
  from,
  to,
  symbol,
  quantity,
  timestamp,
  action,
  quantityHive,
  iconType,
  fractionDigits,
}) => {
  const recipient = from || to;
  const color = action === 'Bought' ? 'green' : 'red';
  const hiveColor = action === 'Bought' ? 'red' : 'green';
  const point = color === 'green' ? '+' : '-';
  const hivePoint = action === 'Bought' ? '-' : '+';
  const amountClassList = classNames('UserWalletTransactions__marginLeft', {
    [`UserWalletTransactions__amount--${color}`]: color,
  });
  const amountClassListHive = classNames('TokenBoughtCard__marginLeft', {
    [`UserWalletTransactions__amount--${hiveColor}`]: hiveColor,
  });

  return (
    <div className="UserWalletTransactions__transaction">
      {recipient ? (
        <Avatar size={40} username={recipient} />
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
          <p>
            {action === 'Bought' ? (
              <FormattedMessage id="bought" defaultMessage="Bought" />
            ) : (
              <FormattedMessage id="sold" defaultMessage="Sold" />
            )}
            {recipient && (
              <span>
                {' '}
                {from ? (
                  <FormattedMessage id="lowercase_from" defaultMessage="from " />
                ) : (
                  <FormattedMessage id="lowercase_to" defaultMessage="to" />
                )}{' '}
                <a href={`/@${recipient}`} className="TokenBoughtCard__userName">
                  {recipient}
                </a>
              </span>
            )}
          </p>
          <span className={amountClassList}>
            {point}{' '}
            <FormattedNumber
              value={quantity}
              locale={'en-IN'}
              minimumFractionDigits={3}
              maximumFractionDigits={fractionDigits || 3}
            />{' '}
            {symbol}
          </span>
          <span className={amountClassListHive}>
            {hivePoint}{' '}
            <FormattedNumber
              value={quantityHive}
              locale={'en-IN'}
              minimumFractionDigits={3}
              maximumFractionDigits={fractionDigits || 3}
            />{' '}
            SWAP.HIVE
          </span>
        </div>
        <CardsTimeStamp timestamp={timestamp} />
      </div>
    </div>
  );
};

TokenActionInMarketCard.propTypes = {
  quantity: PropTypes.string.isRequired,
  iconType: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
  fractionDigits: PropTypes.number.isRequired,
  symbol: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  quantityHive: PropTypes.string.isRequired,
};

export default TokenActionInMarketCard;

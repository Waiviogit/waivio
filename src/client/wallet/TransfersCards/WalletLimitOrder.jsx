import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';
import { getTransactionDescription } from '../WalletHelper';
import CardsTimeStamp from './CardsTimeStamp';

const WalletLimitOrder = ({ timestamp, openPays, currentPays, transactionType }) => {
  const arrowsIcon = '\u21C6';
  const options = { openPays, currentPays };
  const description = getTransactionDescription(transactionType, options);
  const openPaysValue = openPays.split(' ')[0];
  const currentPaysValue = currentPays.split(' ')[0];
  let price;

  if (currentPays.includes('HIVE')) {
    price = openPaysValue / currentPaysValue;
  } else {
    price = currentPaysValue / openPaysValue;
  }

  return (
    <div className="UserWalletTransactions__transaction">
      <div className="UserWalletTransactions__icon-container">
        <i className="arrows UserWalletTransactions__icon">{arrowsIcon}</i>
      </div>
      <div className="UserWalletTransactions__content">
        <div className="UserWalletTransactions__content-recipient">
          <div>{description.limitOrder}</div>
          <div className="UserWalletTransactions__limit-order">
            {currentPays} {'>'} {openPays}
          </div>
        </div>
        <div className="MarketBuyCard__lower-text">
          <CardsTimeStamp timestamp={timestamp} />
          <div className="MarketBuyCard__per-waiv">
            {' '}
            <FormattedNumber
              value={price}
              locale={'en-IN'}
              minimumFractionDigits={0}
              maximumFractionDigits={3}
            />{' '}
            {'per HIVE'}
          </div>
        </div>
      </div>
    </div>
  );
};

WalletLimitOrder.propTypes = {
  openPays: PropTypes.element,
  currentPays: PropTypes.element,
  timestamp: PropTypes.number,
  transactionType: PropTypes.string.isRequired,
};

WalletLimitOrder.defaultProps = {
  timestamp: 0,
  openPays: <span />,
  currentPays: <span />,
};

export default WalletLimitOrder;

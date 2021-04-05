import React from 'react';
import PropTypes from 'prop-types';
import { FormattedRelative } from 'react-intl';
import BTooltip from '../components/BTooltip';
import { epochToUTC } from '../helpers/formatter';
import { getTransactionDescription } from './WalletHelper';

const WalletLimitOrder = ({ timestamp, openPays, currentPays, transactionType }) => {
  const arrowsIcon = '\u21C6';
  const options = { openPays, currentPays };
  const description = getTransactionDescription(transactionType, options);

  return (
    <div className="UserWalletTransactions__transaction">
      <div className="UserWalletTransactions__icon-container">
        <i className="arrows UserWalletTransactions__icon">{arrowsIcon}</i>
      </div>
      <div className="UserWalletTransactions__content">
        <div className="UserWalletTransactions__content-recipient">
          <div>{description.limitOrder}</div>
          <div className="UserWalletTransactions__limit-order">{currentPays}</div>
        </div>
        <span className="UserWalletTransactions__timestamp">
          <BTooltip
            title={
              <span>
                <FormattedRelative value={epochToUTC(timestamp)} />
              </span>
            }
          >
            <span>
              <FormattedRelative value={epochToUTC(timestamp)} />
            </span>
          </BTooltip>
        </span>
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

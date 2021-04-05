import React from 'react';
import PropTypes from 'prop-types';
import { FormattedRelative } from 'react-intl';
import BTooltip from '../components/BTooltip';
import { epochToUTC } from '../helpers/formatter';
import { getTransactionDescription } from './WalletHelper';

const WalletCancelOrder = ({ timestamp, openPays, currentPays, transactionType }) => {
  const options = { openPays };
  const description = getTransactionDescription(transactionType, options);

  return (
    <div className="UserWalletTransactions__transaction">
      <div className="UserWalletTransactions__icon-container">
        <i className="iconfont icon-close-big UserWalletTransactions__icon" />
      </div>
      <div className="UserWalletTransactions__content">
        <div className="UserWalletTransactions__content-recipient">
          {openPays ? <div>{description.cancelOrder}</div> : description.cancelLimitOrder}
          {currentPays && (
            <div className="UserWalletTransactions__cancel-order-current-pays">{currentPays}</div>
          )}
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

WalletCancelOrder.propTypes = {
  transactionType: PropTypes.string.isRequired,
  openPays: PropTypes.element,
  currentPays: PropTypes.element,
  timestamp: PropTypes.number,
};

WalletCancelOrder.defaultProps = {
  timestamp: 0,
  openPays: <span />,
  currentPays: <span />,
};

export default WalletCancelOrder;

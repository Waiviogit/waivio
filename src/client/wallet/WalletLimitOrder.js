import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import BTooltip from '../components/BTooltip';
import { epochToUTC } from '../helpers/formatter';

const WalletLimitOrder = ({ transactionDetails, timestamp }) => {
  const arrowsIcon = '\u21C6';
  return (
    <div className="UserWalletTransactions__transaction">
      <div className="UserWalletTransactions__icon-container">
        <i className="arrows UserWalletTransactions__icon">{arrowsIcon}</i>
      </div>
      <div className="UserWalletTransactions__content">
        <div className="UserWalletTransactions__content-recipient">
          <div>
            <FormattedMessage
              id="limit_order"
              defaultMessage="Limit order to buy {open_pays}"
              values={{
                open_pays: <span>{transactionDetails.open_pays}</span>,
              }}
            />
          </div>
          <div className="UserWalletTransactions__transfer">
            {'- '}
            {transactionDetails.current_pays}
          </div>
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
  transactionDetails: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  timestamp: PropTypes.number,
  current_pays: PropTypes.string,
};

WalletLimitOrder.defaultProps = {
  timestamp: 0,
  current_pays: '',
};

export default WalletLimitOrder;

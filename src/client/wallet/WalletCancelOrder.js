import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import BTooltip from '../components/BTooltip';
import { epochToUTC } from '../helpers/formatter';

const WalletCancelOrder = ({ timestamp, openPays, currentPays }) => (
  <div className="UserWalletTransactions__transaction">
    <div className="UserWalletTransactions__icon-container">
      <i className="iconfont icon-close-big UserWalletTransactions__icon" />
    </div>
    <div className="UserWalletTransactions__content">
      <div className="UserWalletTransactions__content-recipient">
        {openPays ? (
          <div>
            <FormattedMessage
              id="cancel_order"
              defaultMessage="Cancel order to buy {open_pays}"
              values={{
                open_pays: <span className="cancel-order-open-pays">{openPays}</span>,
              }}
            />
          </div>
        ) : (
          <FormattedMessage id="cancel_limit_order" defaultMessage="Cancel limit order" />
        )}
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

WalletCancelOrder.propTypes = {
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

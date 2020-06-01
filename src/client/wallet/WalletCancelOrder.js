import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import BTooltip from '../components/BTooltip';
import { epochToUTC } from '../helpers/formatter';

const WalletCancelOrder = ({ transactionDetails, timestamp }) => (
  <div className="UserWalletTransactions__transaction">
    <div className="UserWalletTransactions__icon-container">
      <i className="iconfont icon-close-big UserWalletTransactions__icon" />
    </div>
    <div className="UserWalletTransactions__content">
      <div className="UserWalletTransactions__content-recipient">
        <div>
          <FormattedMessage
            id="cancel_order"
            defaultMessage="Cancel order to buy {open_pays}"
            values={{
              open_pays: <span>{transactionDetails.open_pays}</span>,
            }}
          />
        </div>
        <div className="UserWalletTransactions__received">
          {'+ '}
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

WalletCancelOrder.propTypes = {
  transactionDetails: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  timestamp: PropTypes.number,
  current_pays: PropTypes.string,
};

WalletCancelOrder.defaultProps = {
  timestamp: 0,
  current_pays: '',
};

export default WalletCancelOrder;

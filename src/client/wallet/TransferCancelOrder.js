import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedMessage, FormattedRelative, FormattedTime } from 'react-intl';
import BTooltip from '../components/BTooltip';

// eslint-disable-next-line react/prop-types
const TransferCancelOrder = ({ walletNotification }) => {
  // eslint-disable-next-line camelcase,react/prop-types
  const { current_pays, open_pays, timestamp } = walletNotification;
  return (
    <React.Fragment>
      <div className="UserWalletTransactions__transaction">
        <div className="UserWalletTransactions__icon-container">
          <i className="iconfont icon-success_fill UserWalletTransactions__icon" />
        </div>
        <div className="UserWalletTransactions__content">
          <div className="UserWalletTransactions__content-recipient">
            <div>
              <FormattedMessage
                id="cancel_order_to_buy"
                defaultMessage="Cancel order to buy {current_pays}"
                values={{
                  current_pays: (
                    // eslint-disable-next-line camelcase
                    <span>{current_pays}</span>
                  ),
                }}
              />
            </div>
            <div className="UserWalletTransactions__transfer">
              {'+ '}
              {/* eslint-disable-next-line camelcase */}
              {open_pays}
            </div>
            <span className="UserWalletTransactions__timestamp">
              <BTooltip
                title={
                  <span>
                    <FormattedDate value={`${timestamp}Z`} />
                    <FormattedTime value={`${timestamp}Z`} />
                  </span>
                }
              >
                <span>
                  <FormattedRelative value={`${timestamp}Z`} />
                </span>
              </BTooltip>
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

TransferCancelOrder.PropTypes = {
  walletNotification: PropTypes.shape({
    current_pays: PropTypes.string,
    open_pays: PropTypes.string,
    timestamp: PropTypes.number,
  }),
};

TransferCancelOrder.defaultProps = {
  walletNotification: {},
};

export default TransferCancelOrder;

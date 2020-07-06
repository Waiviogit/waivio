import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import BTooltip from '../components/BTooltip';
import Avatar from '../components/Avatar';
import WalletFillOrderGet from './WalletFillOrderGet';
import { epochToUTC } from '../helpers/formatter';

const WalletFillOrderTransferred = ({ transactionDetails, timestamp, currentPays }) => (
  <React.Fragment>
    <WalletFillOrderGet transactionDetails={transactionDetails} timestamp={timestamp} />
    <div className="UserWalletTransactions__transaction">
      <div className="UserWalletTransactions__avatar">
        <Avatar username={transactionDetails.account} size={40} />
      </div>
      <div className="UserWalletTransactions__content">
        <div className="UserWalletTransactions__content-recipient">
          <div>
            <FormattedMessage
              id="fillOrder_wallet_transferred"
              defaultMessage="Sold {current_pays} to {exchanger}"
              values={{
                current_pays: <span>{currentPays}</span>,
                exchanger: <span>{transactionDetails.exchanger}</span>,
              }}
            />
          </div>
          <div className="UserWalletTransactions__transfer">
            {'- '}
            {currentPays}
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
  </React.Fragment>
);

WalletFillOrderTransferred.propTypes = {
  transactionDetails: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  timestamp: PropTypes.number,
  currentPays: PropTypes.element,
  exchanger: PropTypes.string,
};

WalletFillOrderTransferred.defaultProps = {
  timestamp: 0,
  currentPays: <span />,
  exchanger: '',
};

export default WalletFillOrderTransferred;

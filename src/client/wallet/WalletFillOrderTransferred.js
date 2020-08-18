import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import BTooltip from '../components/BTooltip';
import Avatar from '../components/Avatar';
import { epochToUTC } from '../helpers/formatter';

const selectCurrectValue = (transactionDetails, currentPays, openPays, currentUsername) => {
  const userEqual = currentUsername === transactionDetails.current_owner;
  const currentValue = userEqual
    ? {
        transfer: currentPays,
        received: openPays,
      }
    : {
        transfer: openPays,
        received: currentPays,
      };

  return (
    <span className="UserWalletTransactions__transfer">
      {'- '}
      {currentValue.transfer}
      &ensp;
      <span className="UserWalletTransactions__received">
        {'+ '}
        {currentValue.received}
      </span>
    </span>
  );
};

const WalletFillOrderTransferred = ({
  transactionDetails,
  timestamp,
  currentPays,
  openPays,
  exchanger,
  currentUsername,
}) => {
  const url = `/@${exchanger}`;
  return (
    <React.Fragment>
      <div className="UserWalletTransactions__transaction">
        <div className="UserWalletTransactions__avatar">
          <Avatar username={exchanger} size={40} />
        </div>
        <div className="UserWalletTransactions__content">
          <div className="UserWalletTransactions__content-recipient">
            <div>
              <FormattedMessage
                id="exchange_with"
                defaultMessage="Exchange with {exchanger}"
                values={{
                  exchanger: (
                    <Link to={url}>
                      <span className="username">{exchanger}</span>
                    </Link>
                  ),
                }}
              />
            </div>
            {selectCurrectValue(transactionDetails, currentPays, openPays, currentUsername)}
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
};

WalletFillOrderTransferred.propTypes = {
  transactionDetails: PropTypes.shape().isRequired,
  timestamp: PropTypes.number,
  currentPays: PropTypes.element,
  openPays: PropTypes.element,
  exchanger: PropTypes.string,
  currentUsername: PropTypes.string,
};

WalletFillOrderTransferred.defaultProps = {
  timestamp: 0,
  currentPays: <span />,
  openPays: <span />,
  exchanger: '',
  currentUsername: '',
};

export default WalletFillOrderTransferred;

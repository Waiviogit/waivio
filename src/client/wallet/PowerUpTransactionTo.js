import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import BTooltip from '../components/BTooltip';
import { epochToUTC } from '../helpers/formatter';

const PowerUpTransactionTo = ({ timestamp, amount, to }) => (
  <div className="UserWalletTransactions__transaction">
    <div className="UserWalletTransactions__icon-container">
      <i className="iconfont icon-flashlight_fill UserWalletTransactions__icon" />
    </div>
    <div className="UserWalletTransactions__content">
      <div className="UserWalletTransactions__content-recipient">
        <FormattedMessage
          id="powered_up_to"
          defaultMessage="Powered up to {to} "
          values={{
            to: (
              <Link to={`/@${to}`}>
                <span className="username">{to}</span>
              </Link>
            ),
          }}
        />
        <span className="UserWalletTransactions__transfer">
          {'- '}
          {amount}
        </span>
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

PowerUpTransactionTo.propTypes = {
  timestamp: PropTypes.number.isRequired,
  amount: PropTypes.element.isRequired,
  to: PropTypes.string.isRequired,
};

export default PowerUpTransactionTo;

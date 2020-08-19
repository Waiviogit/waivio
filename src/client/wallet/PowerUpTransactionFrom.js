import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import BTooltip from '../components/BTooltip';
import { epochToUTC } from '../helpers/formatter';

const PowerUpTransactionFrom = ({ timestamp, amount, from, to }) => (
  <div className="UserWalletTransactions__transaction">
    <div className="UserWalletTransactions__icon-container">
      <i className="iconfont icon-flashlight_fill UserWalletTransactions__icon" />
    </div>
    <div className="UserWalletTransactions__content">
      <div className="UserWalletTransactions__content-recipient">
        {to === from ? (
          <React.Fragment>
            <FormattedMessage id="powered_up" defaultMessage="Powered up " />
            <span className="UserWalletTransactions__payout">{amount}</span>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <FormattedMessage
              id="powered_up_from"
              defaultMessage="Powered up from {from} "
              values={{
                from: (
                  <Link to={`/@${from}`}>
                    <span className="username">{from}</span>
                  </Link>
                ),
              }}
            />
            <span className="UserWalletTransactions__received">
              {'+ '}
              {amount}
            </span>
          </React.Fragment>
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

PowerUpTransactionFrom.propTypes = {
  timestamp: PropTypes.number.isRequired,
  amount: PropTypes.element.isRequired,
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

export default PowerUpTransactionFrom;

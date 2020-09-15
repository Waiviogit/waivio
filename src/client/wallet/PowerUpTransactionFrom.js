import React from 'react';
import PropTypes from 'prop-types';
import { FormattedRelative } from 'react-intl';
import BTooltip from '../components/BTooltip';
import { epochToUTC } from '../helpers/formatter';
import { getTransactionDescription } from './WalletHelper';

const PowerUpTransactionFrom = ({ timestamp, amount, from, to, transactionType }) => {
  const options = { from };
  const description = getTransactionDescription(transactionType, options);
  return (
    <div className="UserWalletTransactions__transaction">
      <div className="UserWalletTransactions__icon-container">
        <i className="iconfont icon-flashlight_fill UserWalletTransactions__icon" />
      </div>
      <div className="UserWalletTransactions__content">
        <div className="UserWalletTransactions__content-recipient">
          {to === from ? (
            <React.Fragment>
              {description.powerUpTransaction}
              <span className="UserWalletTransactions__payout">{amount}</span>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {description.powerUpTransactionFrom}
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
};

PowerUpTransactionFrom.propTypes = {
  timestamp: PropTypes.number.isRequired,
  amount: PropTypes.element.isRequired,
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  transactionType: PropTypes.string.isRequired,
};

export default PowerUpTransactionFrom;

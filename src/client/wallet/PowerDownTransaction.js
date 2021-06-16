import React from 'react';
import PropTypes from 'prop-types';
import { FormattedRelative } from 'react-intl';
import BTooltip from '../components/BTooltip';
import { epochToUTC } from '../helpers/formatter';

const PowerDownTransaction = ({ timestamp, amount, description, color }) => (
  <div className="UserWalletTransactions__transaction">
    <div className="UserWalletTransactions__icon-container">
      <i className="iconfont icon-flashlight_fill UserWalletTransactions__icon" />
    </div>
    <div className="UserWalletTransactions__content">
      <div className="UserWalletTransactions__content-recipient">
        {description}
        <span
          className={`UserWalletTransactions__marginLeft UserWalletTransactions__amountColor--${color}`}
        >
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

PowerDownTransaction.propTypes = {
  timestamp: PropTypes.number.isRequired,
  amount: PropTypes.element.isRequired,
  color: PropTypes.string.isRequired,
  description: PropTypes.shape({}).isRequired,
};

export default PowerDownTransaction;

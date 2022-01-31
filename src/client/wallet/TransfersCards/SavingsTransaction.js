import React from 'react';
import PropTypes from 'prop-types';
import { FormattedRelative } from 'react-intl';
import BTooltip from '../../components/BTooltip';
import Avatar from '../../components/Avatar';
import { epochToUTC } from '../../../common/helpers/formatter';
import { getSavingsTransactionMessage } from '../WalletHelper';

const SavingsTransaction = ({ timestamp, transactionType, transactionDetails, amount }) => (
  <div className="UserWalletTransactions__transaction">
    <div className="UserWalletTransactions__avatar">
      <Avatar
        username={
          transactionType === 'transfer_to_savings'
            ? transactionDetails.to
            : transactionDetails.from
        }
        size={40}
      />
    </div>
    <div className="UserWalletTransactions__content">
      <div className="UserWalletTransactions__content-recipient">
        {getSavingsTransactionMessage(transactionType, transactionDetails, amount)}
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
      <span className="UserWalletTransactions__memo">{transactionDetails.memo}</span>
    </div>
  </div>
);

SavingsTransaction.propTypes = {
  timestamp: PropTypes.number,
  transactionDetails: PropTypes.shape(),
  transactionType: PropTypes.string,
  amount: PropTypes.element,
};

SavingsTransaction.defaultProps = {
  timestamp: 0,
  transactionDetails: {},
  transactionType: PropTypes.string,
  amount: <span />,
};

export default SavingsTransaction;

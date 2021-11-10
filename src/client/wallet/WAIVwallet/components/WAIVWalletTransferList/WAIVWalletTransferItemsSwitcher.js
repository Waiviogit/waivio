import React from 'react';
import { round } from 'lodash';
import PropTypes from 'prop-types';

import PowerUpTransactionFrom from '../../../PowerUpTransactionFrom';
import { getTransactionCurrency, getTransactionDescription } from '../../../WalletHelper';
import * as accountHistoryConstants from '../../../../../common/constants/accountHistory';
import ReceiveTransaction from '../../../ReceiveTransaction';
import TransferTransaction from '../../../TransferTransaction';
import { isMobile } from '../../../../helpers/apiHelpers';
import PowerDownTransaction from '../../../PowerDownTransaction';
import UnknownTransactionType from '../../../TransfersCards/UnknownTransactionType/UnknownTransactionType';

const WAIVWalletTransferItemsSwitcher = ({ transaction, currentName }) => {
  const isMobileDevice = isMobile();

  switch (transaction.operation) {
    case 'tokens_stake':
      return (
        <PowerUpTransactionFrom
          amount={getTransactionCurrency(transaction.quantity, 'WP')}
          timestamp={transaction.timestamp}
          to={transaction.to}
          from={transaction.from}
          transactionType={accountHistoryConstants.TRANSFER_TO_VESTING}
        />
      );
    case 'tokens_unstakeStart':
      const desc = getTransactionDescription(accountHistoryConstants.POWER_DOWN_INITIATED_OR_STOP);

      return (
        <PowerDownTransaction
          amount={`${round(transaction.quantity, 3)} WP`}
          timestamp={transaction.timestamp}
          description={desc.powerDownStarted}
        />
      );
    case 'tokens_transfer':
      if (transaction.to === currentName) {
        return (
          <ReceiveTransaction
            from={transaction.from}
            to={transaction.to}
            memo={transaction.memo}
            amount={getTransactionCurrency(transaction.quantity, 'WAIV')}
            timestamp={transaction.timestamp}
            details={transaction.details}
            type={accountHistoryConstants.TRANSFER}
            username={transaction.account}
            isMobile={isMobileDevice}
            transactionType={accountHistoryConstants.TRANSFER}
          />
        );
      }

      return (
        <TransferTransaction
          to={transaction.to}
          memo={transaction.memo}
          amount={getTransactionCurrency(transaction.quantity, 'WAIV')}
          timestamp={transaction.timestamp}
          transactionType={accountHistoryConstants.TRANSFER}
        />
      );

    default:
      return <UnknownTransactionType transaction={transaction} />;
  }
};

WAIVWalletTransferItemsSwitcher.propTypes = {
  currentName: PropTypes.string.isRequired,
  transaction: PropTypes.shape({
    to: PropTypes.string,
    from: PropTypes.string,
    memo: PropTypes.string,
    quantity: PropTypes.string,
    timestamp: PropTypes.string,
    details: PropTypes.string,
    account: PropTypes.string,
    operation: PropTypes.string,
  }).isRequired,
};

export default WAIVWalletTransferItemsSwitcher;

import React from 'react';
import { round } from 'lodash';
import PropTypes from 'prop-types';

import PowerUpTransactionFrom from '../../../TransfersCards/PowerUpTransactionFrom';
import { getTransactionCurrency, getTransactionDescription } from '../../../WalletHelper';
import * as accountHistoryConstants from '../../../../../common/constants/accountHistory';
import ReceiveTransaction from '../../../TransfersCards/ReceiveTransaction';
import TransferTransaction from '../../../TransfersCards/TransferTransaction';
import { isMobile } from '../../../../helpers/apiHelpers';
import PowerDownTransaction from '../../../TransfersCards/PowerDownTransaction';
import UnknownTransactionType from '../../../TransfersCards/UnknownTransactionType/UnknownTransactionType';
import TokenActionInMarketCard from '../../../TransfersCards/TokenBoughtCard.js/TokenActionInMarketCard';
import MarketBuyCard from '../../../TransfersCards/MarketBuyCard';
import DelegatedTo from '../../../TransfersCards/DelegatedTo';
import MarketCancel from '../../../TransfersCards/MarketCancel';
import MarketCloseOrder from '../../../TransfersCards/MarketCloseOrder';
import UndelegateStart from '../../../TransfersCards/UndelegateStart';

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
    case 'tokens_unstakeStart': {
      const desc = getTransactionDescription(accountHistoryConstants.POWER_DOWN_INITIATED_OR_STOP);

      return (
        <PowerDownTransaction
          amount={`${round(transaction.quantity, 3)} WP`}
          timestamp={transaction.timestamp}
          description={desc.powerDownStarted}
        />
      );
    }

    case 'tokens_unstakeDone': {
      const desc = getTransactionDescription(accountHistoryConstants.POWER_DOWN_INITIATED_OR_STOP);

      return (
        <PowerDownTransaction
          amount={`${round(transaction.quantity, 3)} WP`}
          timestamp={transaction.timestamp}
          description={desc.powerDownStopped}
        />
      );
    }
    case 'market_buy':
      return (
        <TokenActionInMarketCard
          quantity={transaction.quantityTokens}
          timestamp={transaction.timestamp}
          account={transaction.account}
          symbol={transaction.symbol}
          action={'bought'}
        />
      );

    case 'market_sell':
      return (
        <TokenActionInMarketCard
          quantity={transaction.quantityTokens}
          timestamp={transaction.timestamp}
          account={transaction.account}
          symbol={transaction.symbol}
          action={'sold'}
        />
      );

    case 'market_placeOrder':
      return (
        <MarketBuyCard
          quantity={transaction.quantityLocked}
          timestamp={transaction.timestamp}
          orderType={transaction.orderType}
          symbol={transaction.symbol}
        />
      );

    case 'market_cancel':
      return (
        <MarketCancel
          quantity={transaction.quantityReturned}
          timestamp={transaction.timestamp}
          orderType={transaction.orderType}
          symbol={transaction.symbol}
        />
      );

    case 'market_closeOrder':
      return (
        <MarketCloseOrder timestamp={transaction.timestamp} orderType={transaction.orderType} />
      );

    case 'tokens_delegate':
      return (
        <DelegatedTo
          quantity={transaction.quantity}
          timestamp={transaction.timestamp}
          to={transaction.to}
          from={transaction.from}
          account={transaction.account}
        />
      );

    case 'tokens_undelegateStart':
      return (
        <UndelegateStart
          quantity={transaction.quantity}
          timestamp={transaction.timestamp}
          to={transaction.to}
          from={transaction.from}
          account={transaction.account}
          status={'started'}
        />
      );

    case 'tokens_undelegateDone':
      return (
        <UndelegateStart
          quantity={transaction.quantity}
          timestamp={transaction.timestamp}
          to={transaction.to}
          from={transaction.from}
          account={transaction.account}
          status={'completed'}
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
    quantityTokens: PropTypes.string,
    orderType: PropTypes.string,
    quantityLocked: PropTypes.string,
    quantityReturned: PropTypes.string,
    symbol: PropTypes.string,
  }).isRequired,
};

export default WAIVWalletTransferItemsSwitcher;

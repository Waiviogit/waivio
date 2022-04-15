import React from 'react';
import { round } from 'lodash';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';

import PowerUpTransactionFrom from '../../TransfersCards/PowerUpTransactionFrom';
import UndelegateCompleted from '../../TransfersCards/UndelegateCompleted';
import { getTransactionCurrency, getTransactionDescription } from '../../WalletHelper';
import * as accountHistoryConstants from '../../../../common/constants/accountHistory';
import ReceiveTransaction from '../../TransfersCards/ReceiveTransaction';
import TransferTransaction from '../../TransfersCards/TransferTransaction';
import { isMobile } from '../../../../common/helpers/apiHelpers';
import PowerDownTransaction from '../../TransfersCards/PowerDownTransaction';
import UnknownTransactionType from '../../TransfersCards/UnknownTransactionType/UnknownTransactionType';
import TokenActionInMarketCard from '../../TransfersCards/TokenBoughtCard.js/TokenActionInMarketCard';
import MarketBuyCard from '../../TransfersCards/MarketBuyCard/MarketBuyCard';
import DelegatedTo from '../../TransfersCards/DelegatedTo';
import MarketCancel from '../../TransfersCards/MarketCancel';
import MarketCloseOrder from '../../TransfersCards/MarketCloseOrder';
import MarketExpireCard from '../../TransfersCards/MarketExpireCard';
import UndelegateStart from '../../TransfersCards/UndelegateStart';
import AirDropCard from '../../TransfersCards/AirDropCard';
import CuratorRewardsCard from '../../TransfersCards/CuratorRewardsCard';
import { getCurrentWalletType } from '../../../../store/walletStore/walletSelectors';
import SwapTokenCard from '../../TransfersCards/SwapTokenCard/SwapTokenCard';
import PowerDownCanceledCard from '../../TransfersCards/PowerDownCanceledCard';
import DepositeCard from '../../TransfersCards/DepositeCard';
import WithdawCard from '../../TransfersCards/WithdrawCard';
import DelegateInstructionCard from '../../TransfersCards/DelegateInstructionCard/DelegateInstructionCard';

const WAIVWalletTransferItemsSwitcher = ({ transaction, currentName, intl }) => {
  const walletType = useSelector(getCurrentWalletType);
  const isMobileDevice = isMobile();
  const powerSymbol = transaction.symbol === 'WAIV' ? 'WP' : transaction.symbol;

  switch (transaction.operation) {
    case 'tokens_stake':
      return (
        <PowerUpTransactionFrom
          amount={getTransactionCurrency(transaction.quantity, powerSymbol)}
          timestamp={transaction.timestamp}
          to={transaction.to}
          from={transaction.from}
          transactionType={accountHistoryConstants.TRANSFER_TO_VESTING}
          currentUser={currentName}
        />
      );
    case 'tokens_cancelUnstake':
      return (
        <PowerDownCanceledCard
          amount={getTransactionCurrency(transaction.quantityReturned, powerSymbol)}
          timestamp={transaction.timestamp}
        />
      );
    case 'tokens_unstakeStart': {
      const desc = getTransactionDescription(accountHistoryConstants.POWER_DOWN_INITIATED_OR_STOP);

      return (
        <PowerDownTransaction
          amount={`${round(transaction.quantity, 3)} ${powerSymbol}`}
          timestamp={transaction.timestamp}
          description={desc.powerDownStarted}
        />
      );
    }

    case 'tokens_unstakeDone': {
      const desc = getTransactionDescription(accountHistoryConstants.POWER_DOWN_INITIATED_OR_STOP);

      return (
        <PowerDownTransaction
          amount={`${round(transaction.quantity, 3)} ${powerSymbol}`}
          timestamp={transaction.timestamp}
          description={desc.powerDownStopped}
        />
      );
    }

    case 'market_expire': {
      return (
        <MarketExpireCard
          symbol={transaction.symbol}
          account={transaction.account}
          timestamp={transaction.timestamp}
          orderType={transaction.orderType}
          quantity={transaction.quantityUnlocked}
        />
      );
    }

    case 'market_buy':
      return (
        <TokenActionInMarketCard
          quantity={transaction.quantityTokens}
          quantityHive={transaction.quantityHive}
          timestamp={transaction.timestamp}
          account={transaction.account}
          symbol={transaction.symbol}
          action={'Bought'}
          from={transaction.from}
        />
      );

    case 'market_sell':
      return (
        <TokenActionInMarketCard
          quantity={transaction.quantityTokens}
          quantityHive={transaction.quantityHive}
          timestamp={transaction.timestamp}
          account={transaction.account}
          symbol={transaction.symbol}
          action={'Sold'}
          to={transaction.to}
        />
      );

    case 'market_placeOrder':
      return (
        <MarketBuyCard
          price={transaction.price}
          quantityLocked={transaction.quantityLocked}
          quantity={transaction.quantity}
          timestamp={transaction.timestamp}
          orderType={transaction.orderType}
          symbol={transaction.orderType === 'marketBuy' ? 'SWAP.HIVE' : transaction.symbol}
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
          symbol={transaction.symbol}
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
          symbol={transaction.symbol}
        />
      );

    case 'tokens_undelegateDone':
      return (
        <UndelegateCompleted
          quantity={transaction.quantity}
          timestamp={transaction.timestamp}
          symbol={transaction.symbol}
        />
      );

    case 'marketpools_swapTokens':
      return (
        <SwapTokenCard
          timestamp={transaction.timestamp}
          symbolTo={transaction.symbolOut}
          quantityTo={transaction.symbolOutQuantity}
          symbolFrom={transaction.symbolIn}
          quantityFrom={transaction.symbolInQuantity}
          walletType={walletType}
        />
      );

    case 'airdrops_newAirdrop':
      return (
        <AirDropCard
          timestamp={transaction.timestamp}
          account={transaction.account}
          symbol={transaction.symbol}
          quantity={transaction.quantity}
        />
      );

    case 'comments_curationReward':
      return (
        <CuratorRewardsCard
          timestamp={transaction.timestamp}
          symbol={transaction.symbol}
          quantity={transaction.quantity}
          authorperm={transaction.authorperm}
          memo={transaction.memo}
          description={intl.formatMessage({
            id: 'curator_rewards',
            defaultMessage: 'Curator rewards',
          })}
        />
      );

    case 'comments_authorReward':
      return (
        <CuratorRewardsCard
          timestamp={transaction.timestamp}
          symbol={transaction.symbol}
          quantity={transaction.quantity}
          authorperm={transaction.authorperm}
          memo={transaction.memo}
          description={intl.formatMessage({
            id: 'author_rewards',
            defaultMessage: 'Author rewards',
          })}
        />
      );

    case 'hivepegged_buy':
      return (
        <DepositeCard
          timestamp={transaction.timestamp}
          symbol={transaction.symbol}
          quantity={transaction.quantity}
        />
      );

    case 'hivepegged_withdraw':
      return (
        <WithdawCard
          timestamp={transaction.timestamp}
          symbol={transaction.symbol}
          quantity={transaction.quantity}
        />
      );

    case 'comments_beneficiaryReward':
      return (
        <CuratorRewardsCard
          timestamp={transaction.timestamp}
          symbol={transaction.symbol}
          quantity={transaction.quantity}
          authorperm={transaction.authorperm}
          memo={transaction.memo}
          type={intl.formatMessage({ id: 'comment_lowercase', defaultMessage: 'comment' })}
          description={intl.formatMessage({
            id: 'curator_rewards',
            defaultMessage: 'Curator rewards',
          })}
        />
      );

    case 'mining_lottery':
    case 'tokens_issue':
      return (
        <CuratorRewardsCard
          timestamp={transaction.timestamp}
          symbol={transaction.symbol}
          quantity={transaction.quantity}
          authorperm={transaction.authorperm}
          memo={transaction.poolId ? `{poolId: ${transaction.poolId}}` : transaction.memo}
          description={intl.formatMessage({
            id: 'mining_rewards',
            defaultMessage: 'Mining rewards',
          })}
        />
      );

    case 'createDepositRecord':
      return (
        <DelegateInstructionCard
          timestamp={transaction.timestamp}
          pair={transaction.pair}
          depositAccount={transaction.depositAccount}
          memo={transaction.memo}
          address={transaction.address}
        />
      );

    case 'tokens_transfer':
      if (transaction.to === currentName) {
        return (
          <ReceiveTransaction
            from={transaction.from}
            to={transaction.to}
            memo={transaction.memo}
            amount={getTransactionCurrency(transaction.quantity, transaction.symbol)}
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
          amount={getTransactionCurrency(transaction.quantity, transaction.symbol)}
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
  intl: PropTypes.shape().isRequired,
  transaction: PropTypes.shape({
    to: PropTypes.string,
    from: PropTypes.string,
    memo: PropTypes.string,
    quantity: PropTypes.string,
    pair: PropTypes.string,
    depositAccount: PropTypes.string,
    address: PropTypes.string,
    timestamp: PropTypes.number,
    details: PropTypes.string,
    account: PropTypes.string,
    operation: PropTypes.string,
    quantityTokens: PropTypes.string,
    orderType: PropTypes.string,
    quantityHive: PropTypes.string,
    quantityLocked: PropTypes.string,
    quantityUnlocked: PropTypes.string,
    quantityReturned: PropTypes.string,
    symbol: PropTypes.string,
    price: PropTypes.string,
    symbolOut: PropTypes.string,
    symbolOutQuantity: PropTypes.string,
    authorperm: PropTypes.string,
    symbolInQuantity: PropTypes.string,
    poolId: PropTypes.string,
    symbolIn: PropTypes.string,
  }).isRequired,
};

export default injectIntl(WAIVWalletTransferItemsSwitcher);

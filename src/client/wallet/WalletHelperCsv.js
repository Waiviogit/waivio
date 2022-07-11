import { get } from 'lodash';
import * as accountHistoryConstants from '../../common/constants/accountHistory';

export const TRANSACTION_TYPES = [
  'internal_operations',
  'transfer',
  'transfer_to_vesting',
  'claim_reward_balance',
  'transfer_to_savings',
  'transfer_from_savings',
  'limit_order_cancel',
  'fill_order',
  'proposal_pay',
  'user_to_guest_transfer',
  'demo_post',
  'demo_debt',
  'demo_user_transfer',
  'limit_order_cancel',
];

export const selectFormatDate = locale => {
  if (locale === 'en-US') {
    return 'MM/DD/YYYY';
  }

  return 'DD/MM/YYYY';
};

export const getTableDescription = (type, options) => {
  switch (type) {
    case accountHistoryConstants.TRANSFER_TO_VESTING: {
      const from = get(options, 'from', 'user');
      const to = get(options, 'to', 'user');

      return {
        powerUpTransaction: 'Power up',
        powerUpTransactionFrom: `Power up from ${from}`,
        powerUpTransactionTo: `Power up to ${to}`,
      };
    }
    case accountHistoryConstants.POWER_DOWN_INITIATED_OR_STOP: {
      return {
        powerDownStarted: 'Started power down',
        powerDownStopped: 'Power down',
      };
    }
    case accountHistoryConstants.POWER_DOWN_WITHDRAW: {
      const to = get(options, 'to', '');
      const from = get(options, 'from', '');

      return {
        powerDownWithdraw: 'Power down',
        powerDownWithdrawTo: `Power down to ${to}`,
        powerDownWithdrawFrom: `Power down from ${from}`,
      };
    }
    case accountHistoryConstants.TRANSFER: {
      const title = get(options, 'title', '');
      const from = get(options, 'from', '');
      const to = get(options, 'to', '');

      return {
        reviewAuthorRewards: `Author rewards: ${title}`,
        commentsAuthorRewards: `Author rewards for comments: ${title}`,
        receivedFrom: `Received from ${from}`,
        transferredTo: `Transferred to ${to}`,
      };
    }

    case accountHistoryConstants.TOKENS_TRANSFER: {
      const to = get(options, 'to', '');
      const from = get(options, 'from', '');

      return {
        tokensTransferTo: `Transferred to ${to}`,
        tokensTransferFrom: `Received from ${from}`,
      };
    }

    case accountHistoryConstants.CURATION_REWARDS: {
      return {
        curationRewards: `Curator rewards (post)`,
      };
    }
    case accountHistoryConstants.BENEFICIARY_REWARD: {
      return {
        beneficiaryRewards: `Curator rewards (comment)`,
      };
    }
    case accountHistoryConstants.CLAIM_REWARD_BALANCE:
      return {
        claimRewards: 'Claim rewards',
      };
    case accountHistoryConstants.MINING_LOTTERY:
      return {
        miningLottery: 'Mining rewards',
      };
    case accountHistoryConstants.AIRDROP:
      return {
        airdrop: 'Airdrop',
      };

    case accountHistoryConstants.TOKENS_STAKE:
      const to = get(options, 'to', '');
      const from = get(options, 'from', '');

      return {
        tokensStakeTo: `Power up to ${to}`,
        tokensStakeFrom: `Power up from ${from}`,
      };

    case accountHistoryConstants.AUTHOR_REWARDS: {
      return {
        authorRewards: `Author rewards (post)`,
      };
    }
    case accountHistoryConstants.LIMIT_ORDER: {
      return {
        limitOrder: 'Limit order',
      };
    }
    case accountHistoryConstants.FILL_ORDER:
    case accountHistoryConstants.FILL_ORDER_TRANSACTION: {
      const exchanger = get(options, 'exchanger', '');

      return {
        fillOrder: `Exchange with ${exchanger}`,
      };
    }
    case accountHistoryConstants.CANCEL_ORDER: {
      const openPays = get(options, 'openPays', '');

      return {
        cancelOrder: ` Cancel order to buy ${openPays}`,
        cancelLimitOrder: 'Cancel limit order',
      };
    }
    case accountHistoryConstants.PROPOSAL_PAY: {
      const receiver = get(options, 'receiver', '');

      return {
        proposalPaymentFrom: 'Proposal payment from steem.dao',
        proposalPaymentTo: `Proposal payment to ${receiver}`,
      };
    }
    default:
      return null;
  }
};
export const getSavingsTransactionMessage = (transactionType, transactionDetails, amount) => {
  switch (transactionType) {
    case 'cancel_transfer_from_savings':
      return `Cancel transfer from savings (request ${transactionDetails.request_id})`;
    case 'transfer_to_savings':
      return `Transfer to savings ${amount} from ${transactionDetails.to}`;
    case 'transfer_from_savings':
      return `Transfer from savings ${amount} to ${transactionDetails.from}`;
    default:
      return null;
  }
};

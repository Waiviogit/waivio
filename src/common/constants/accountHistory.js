export const ACCOUNT_CREATE = 'account_create';
export const ACCOUNT_CREATE_WITH_DELEGATION = 'account_create_with_delegation';
export const VOTE = 'vote';
export const ACCOUNT_UPDATE = 'account_update2';
export const GUEST_ACCOUNT_UPDATE = 'account_update';
export const COMMENT = 'comment';
export const DELETE_COMMENT = 'delete_comment';
export const CUSTOM_JSON = 'custom_json';
export const FOLLOW = 'follow';
export const FOLLOW_WOBJECT = 'follow_wobject';
export const UNFOLLOW_WOBJECT = 'unfollow_wobject';
export const WOBJ_RATING = 'wobj_rating';
export const REBLOG = 'reblog';
export const CURATION_REWARD = 'curation_reward';
export const AUTHOR_REWARD = 'author_reward';
export const ACCOUNT_WITNESS_VOTE = 'account_witness_vote';
export const FILL_VESTING_WITHDRAW = 'fill_vesting_withdraw';
export const POWER_DOWN_INITIATED_OR_STOP = 'withdraw_vesting';
export const POWER_DOWN_WITHDRAW = 'fill_vesting_withdraw';
export const SET_WITHDRAW_VESTING_ROUTE = 'set_withdraw_vesting_route';

// Supported Custom JSON Type IDs
export const ID_FOLLOW = 'follow';
export const ID_FOLLOW_WOBJECT = 'follow_wobject';

// Wallet Action Types
export const TRANSFER = 'transfer';
export const TRANSFER_TO_VESTING = 'transfer_to_vesting';
export const CANCEL_TRANSFER_FROM_SAVINGS = 'cancel_transfer_from_savings';
export const TRANSFER_FROM_SAVINGS = 'transfer_from_savings';
export const TRANSFER_TO_SAVINGS = 'transfer_to_savings';
export const DELEGATE_VESTING_SHARES = 'delegate_vesting_shares';
export const CLAIM_REWARD_BALANCE = 'claim_reward_balance';
export const LIMIT_ORDER = 'limitOrder';
export const FILL_ORDER = 'fillOrder';
export const FILL_ORDER_TRANSACTION = 'fill_order';
export const CANCEL_ORDER = 'cancelOrder';
export const PROPOSAL_PAY = 'proposal_pay';
export const CONVERT_HBD_REQUEST = 'convert';
export const CONVERT_HBD_COMPLETED = 'fill_convert_request';
export const CONVERT_HIVE_REQUEST = 'collateralized_convert';
export const CONVERT_HIVE_COMPLETED = 'fill_collateralized_convert_request';
export const INTEREST = 'interest';
export const COMMENT_REWARDS = 'comment_rewards';
export const FILL_TRANSFER_FROM_SAVINGS = 'fill_transfer_from_savings';
export const TRANSFER_TO_VESTING_COMPLETED = 'transfer_to_vesting_completed';

// WAIV Operation Types
export const TOKENS_TRANSFER = 'tokens_transfer';
export const MARKET_BUY = 'market_buy';
export const MARKET_SELL = 'market_sell';
export const TOKENS_STAKE = 'tokens_stake';
export const CURATION_REWARDS = 'comments_curationReward';
export const AUTHOR_REWARDS = 'comments_authorReward';
export const BENEFICIARY_REWARD = 'comments_beneficiaryReward';
export const MINING_LOTTERY = 'mining_lottery';
export const AIRDROP = 'airdrops_newAirdrop';
export const SWAP_TOKENS = 'marketpools_swapTokens';
export const CHECK_PENDING_DTFS = 'tokenfunds_checkPendingDtfs';

// Filter Types - General
export const DOWNVOTED = 'downvoted';
export const UPVOTED = 'upvoted';
export const UNVOTED = 'unvoted';
export const FOLLOWED = 'followed';
export const UNFOLLOWED = 'unfollowed';
export const REPLIED = 'replied';
export const REBLOGGED = 'reblogged';

// Filter Types - Finance
export const POWERED_UP = 'powered_up';
export const RECEIVED = 'received';
export const TRANSFERRED = 'transferred';
export const SAVINGS = 'savings';
export const CLAIM_REWARDS = 'claim_rewards';
export const DELEGATE = 'delegate_vesting_shares';

export const PARSED_PROPERTIES = [
  ACCOUNT_CREATE,
  ACCOUNT_CREATE_WITH_DELEGATION,
  VOTE,
  COMMENT,
  CUSTOM_JSON,
  CURATION_REWARD,
  AUTHOR_REWARD,
  TRANSFER,
  TRANSFER_TO_VESTING,
  CANCEL_TRANSFER_FROM_SAVINGS,
  TRANSFER_FROM_SAVINGS,
  TRANSFER_TO_SAVINGS,
  DELEGATE_VESTING_SHARES,
  CLAIM_REWARD_BALANCE,
  ACCOUNT_WITNESS_VOTE,
  FILL_VESTING_WITHDRAW,
  SET_WITHDRAW_VESTING_ROUTE,
  CONVERT_HBD_REQUEST,
  CONVERT_HBD_COMPLETED,
  CONVERT_HIVE_REQUEST,
  CONVERT_HIVE_COMPLETED,
];

export const PARSED_CUSTOM_JSON_IDS = [ID_FOLLOW];
export const PARSED_CUSTOM_JSON_FOLLOW_WOBJECT = [ID_FOLLOW_WOBJECT];

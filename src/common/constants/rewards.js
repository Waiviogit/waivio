export const rewardsValues = {
  all: '100',
  half: '50',
  none: '0',
};

export const REWARD = {
  guestReward: 'guest_reward',
  userReward: 'user_reward',
  guestTransfer: 'user_to_guest_transfer',
  overpayment_refund: 'overpayment_refund',
};

export const guestTransferId = {
  HIVE: {
    guestReward: 'guest_reward',
    userReward: 'user_reward',
    guestTransfer: 'user_to_guest_transfer',
    overpayment_refund: 'overpayment_refund',
  },
  WAIV: {
    guestReward: 'guest_reward',
    userReward: 'user_reward',
    guestTransfer: 'transferToGuest',
    overpayment_refund: 'transferFromGuest',
  },
};

export const TYPE = {
  transfer: 'transfer',
  transferToGuest: 'transferToGuest',
  demoDebt: 'demo_debt',
  overpaymentRefund: 'overpayment_refund',
};

export const REWARDS_TYPES_MESSAGES = {
  assigned: 'Reserved',
  completed: 'Completed',
  unassigned: 'Released',
  expired: 'Expired',
  rejected: 'Rejected',
};

export const CAMPAIGNS_TYPES_MESSAGES = {
  all: 'all',
  open: 'open',
  close: 'closed',
};

export const GUIDE_HISTORY = 'guideHistory';

export const MESSAGES = 'messages';

export const FRAUD_DETECTION = 'fraud-detection';

export const HISTORY = 'history';

export const ASSIGNED = 'assigned';
export const UNASSIGNED = 'unassigned';

export const IS_RESERVED = 'reserved';
export const IS_ALL = 'all';
export const IS_ACTIVE = 'active';
export const CAMPAIGNS = 'campaigns';
export const PAYABLES = 'payables';
export const RECEIVABLES = 'receivables';

export const PATH_NAME_GUIDE_HISTORY = '/rewards/guideHistory';
export const PATH_NAME_MESSAGES = '/rewards/messages';
export const PATH_NAME_HISTORY = '/rewards/history';
export const PATH_NAME_ACTIVE = '/rewards/eligible';
export const PATH_NAME_DISCOVER = '/discover';
export const PATH_NAME_CREATE = '/rewards/create';
export const PATH_NAME_MATCH_BOT = '/rewards/match-bot';
export const PATH_NAME_MANAGE = '/rewards/manage';
export const NEW_PATH_NAME_MANAGE = '/rewards-new/manage';
export const PATH_NAME_PAYABLES = '/rewards/payables';
export const PATH_NAME_PAYABLES_NEW = '/rewards-new/payables';
export const PATH_NAME_BLACKLIST = '/rewards/blacklist';

export const CAMPAIGN_STATUS = {
  inactive: 'inactive',
  expired: 'expired',
  deleted: 'deleted',
  onHold: 'onHold',
  active: 'active',
  pending: 'pending',
  payed: 'payed',
  reachedLimit: 'reachedLimit',
};

export const isDisabledStatus = [
  CAMPAIGN_STATUS.inactive,
  CAMPAIGN_STATUS.expired,
  CAMPAIGN_STATUS.deleted,
  CAMPAIGN_STATUS.onHold,
  CAMPAIGN_STATUS.active,
];

export const isCheckedStatus = [
  CAMPAIGN_STATUS.active,
  CAMPAIGN_STATUS.payed,
  CAMPAIGN_STATUS.reachedLimit,
];

export const isInactiveStatus = [
  CAMPAIGN_STATUS.inactive,
  CAMPAIGN_STATUS.expired,
  CAMPAIGN_STATUS.deleted,
  CAMPAIGN_STATUS.onHold,
];

export default null;

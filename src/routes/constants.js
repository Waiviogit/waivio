import { objMenuTypes, supportedObjectFields } from '../common/constants/listOfFields';

export default {
  WOBJ: {
    tabs: [
      'about',
      'gallery',
      'updates',
      'reviews',
      'followers',
      'expertise',
      'menu',
      'page',
      'list',
      'blog',
      'form',
    ].join('|'),
    filters: [...supportedObjectFields, ...objMenuTypes, 'album'].join('|'),
  },
  USER: {
    tabs: [
      'comments',
      'followers',
      'following',
      'reblogs',
      'transfers',
      'activity',
      'expertise',
      'about',
    ].join('|'),
  },
  FEED: {
    tabs: ['trending', 'created', 'hot', 'promoted', 'feed', 'blog', 'notifications-list'].join(
      '|',
    ),
  },
  REWARDS: {
    tabs: [
      'create',
      'manage',
      'match-bots-sponsors',
      'match-bots-curators',
      'match-bots-authors',
      'edit',
      'history',
      'guideHistory',
      'messages',
      'reports',
      'fraud-detection',
      'receivables',
      'details',
      'createDublicate',
    ].join('|'),
    sideBar: [
      'all',
      'create',
      'manage',
      'payables',
      'reports',
      'guideHistory',
      'messages',
      'match',
      'blacklist',
      'details',
      'createDuplicate',
      'duplicate',
      'active',
      'reserved',
      'history',
      'promoted',
      'created',
      'receivables',
      'match-bot',
      'fraud-detection',
      'match-bots-authors',
      'match-bots-curators',
      'match-bots-sponsors',
      'eligible',
    ].join('|'),
  },
  NEW_REWARDS: {
    tabs: [
      'create',
      'manage',
      'match-bots-sponsors',
      'match-bots-curators',
      'match-bots-authors',
      'edit',
      'history',
      'messages',
      'reports',
      'fraud-detection',
      'receivables',
      'all',
      'details',
      'duplicate',
      'reserved',
      'payables',
      'match-bots-sponsors',
      'reservations',
      'black-list',
    ].join('|'),
    sideBar: [
      'all',
      'create',
      'manage',
      'payables',
      'reports',
      'guideHistory',
      'messages',
      'match',
      'blacklist',
      'details',
      'createDuplicate',
      'active',
      'reserved',
      'history',
      'promoted',
      'created',
      'receivables',
      'reservations',
      'match-bot',
      'all',
      'create',
      'manage',
      'payables',
      'guideHistory',
      'messages',
      'match',
      'blacklist',
      'reports',
      'details',
      'createDuplicate',
      'duplicate',
      'active',
      'reserved',
      'history',
      'promoted',
      'created',
      'receivables',
      'match-bot',
      'fraud-detection',
      'match-bots-authors',
      'match-bots-curators',
      'match-bots-sponsors',
      'eligible',
      'black-list',
    ].join('|'),
  },
  SETTINGS: {
    tabs: [
      'bookmarks',
      'drafts',
      'edit-profile',
      'settings',
      'invite',
      'guests-settings',
      'notification-settings',
      'create',
      'manage',
      'payments',
      'new-accounts',
    ].join('|'),
  },
  WEBSITES: {
    tabs: [
      'configuration',
      'settings',
      'administrations',
      'moderators',
      'authorities',
      'objects',
      'objects-filters',
      'muted-users',
    ].join('|'),
  },
  REFERRAL: {
    tabs: ['referral-details', 'referral-instructions', 'referral-status'].join('|'),
  },
};

import { objMenuTypes, supportedObjectFields } from '../common/constants/listOfFields';

export default {
  WOBJ: {
    tabs: [
      'about',
      'gallery',
      'updates',
      'description',
      'reviews',
      'threads',
      'followers',
      'expertise',
      'menu',
      'page',
      'webpage',
      'widget',
      'newsfeed',
      'map',
      'list',
      'blog',
      'form',
      'products',
      'books',
      'group',
    ].join('|'),
    filters: [...supportedObjectFields, ...objMenuTypes, 'album'].join('|'),
  },
  USER: {
    tabs: [
      'comments',
      'threads',
      'mentions',
      'followers',
      'following',
      'following-objects',
      'reblogs',
      'transfers',
      'activity',
      'expertise-hashtags',
      'expertise-objects',
      'about',
      'shop',
      'map',
      'recipe',
    ].join('|'),
  },
  FEED: {
    tabs: ['trending', 'created', 'hot', 'promoted', 'feed', 'blog', 'notifications-list'].join(
      '|',
    ),
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
      'receivable',
      'all',
      'details',
      'duplicate',
      'reserved',
      'payable',
      'match-bots-sponsors',
      'reservations',
      'black-list',
      'referral-details',
      'referral-instructions',
      'referral-status',
    ].join('|'),
    sideBar: [
      'all',
      'create',
      'manage',
      'payable',
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
      'receivable',
      'reservations',
      'match-bot',
      'global',
      'local',
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
      'referral-details',
      'referral-instructions',
      'referral-status',
    ].join('|'),
  },
  SETTINGS: {
    tabs: [
      'user-affiliate-codes',
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
      'data-import',
      'ASIN-scanner',
      'chrome-extension',
      'claim-authority',
      'departments-bot',
      'tags-bot',
      'descriptions-bot',
      'list-duplication',
    ].join('|'),
  },
  WEBSITES: {
    tabs: [
      'affiliate-codes',
      'configuration',
      'settings',
      'administrations',
      'moderators',
      'authorities',
      'objects',
      'objects-filters',
      'muted-users',
      'adsense',
    ].join('|'),
  },
  REFERRAL: {
    tabs: ['referral-details', 'referral-instructions', 'referral-status'].join('|'),
  },
};

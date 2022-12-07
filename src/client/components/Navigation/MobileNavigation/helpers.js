import { CAMPAIGNS } from '../../../../common/constants/rewards';

export const pages = {
  hive: {
    trending: 'trending',
    regExp: /(^\/)(created|hot|trending)$/,
    id: 'hive',
  },
  personal: {
    myFeed: 'my_feed',
    regExp: /(^\/)(notifications-list|updates|rewards-list)$/,
    id: 'personal',
  },
  people: {
    regExp: /(^\/blog)\/(@[\w\d.-]{3,})$/,
    id: 'people',
  },
  objectsUpdates: {
    regExp: /(^\/feed\/)([\w\d.-]{3,})/,
  },
  discoverObjects: {
    all: 'all',
    regExp: /(^\/discover-objects)\/?(.*)/,
    id: 'objects',
  },

  rewards: {
    regExp: /(^\/rewards\/)(all|eligible|reserved|history)/,
    id: 'rewards',
  },
  rewardsCampaigns: {
    regExp: /(^\/rewards\/)(create|manage|reservations|messages|match-bot|black-list|fraud-detection|reports)$/,
    id: CAMPAIGNS,
  },
  rewardsMatchBots: {
    regExp: /(^\/rewards-\/)(match-bots-sponsors|match-bots-author|match-bots-curators)$/,
    id: 'Match Bots',
  },
  rewardsRefferal: {
    regExp: /(^\/rewards\/)(referral-details|referral-instructions|referral-status)$/,
    id: 'Refferal',
  },
};

export default {};

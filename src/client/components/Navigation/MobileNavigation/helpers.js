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
    regExp: /(^\/rewards\/)(all|active|reserved|receivables|history)/,
    id: 'rewards',
  },
  rewardsCampaigns: {
    regExp: /(^\/rewards\/)(create|manage|payables|reservations|messages|match-bot|blacklist)$/,
    id: CAMPAIGNS,
  },
};

export default {};

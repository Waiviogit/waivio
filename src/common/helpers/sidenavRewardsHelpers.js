import { PATH_NAME_HISTORY, HISTORY, MESSAGES } from '../constants/rewards';

export const getSectionItemsRewards = (hasReceivables, countTookPartCampaigns) => [
  {
    path: '/rewards/active',
    sectionItemNameId: 'eligible',
    sectionItemName: 'Eligible',
  },
  {
    path: '/rewards/reserved',
    sectionItemNameId: 'reserved',
    sectionItemName: 'Reserves',
  },
  {
    isShow: !!hasReceivables,
    path: '/rewards/receivables',
    sectionItemNameId: 'sidenav_rewards_receivables',
    sectionItemName: 'Receivables',
  },
  {
    isShow: !!countTookPartCampaigns,
    path: PATH_NAME_HISTORY,
    sectionItemNameId: HISTORY,
    sectionItemName: 'History',
  },
];

export const getSectionItemsReferrals = authUserName => [
  {
    path: `/rewards/referral-details/${authUserName}`,
    sectionItemNameId: 'referrals_details',
    sectionItemName: 'Details',
  },
  {
    path: `/rewards/referral-instructions/${authUserName}`,
    sectionItemNameId: 'referrals_instructions',
    sectionItemName: 'Instructions',
  },
  {
    path: `/rewards/referral-status/${authUserName}`,
    sectionItemNameId: 'referrals_status',
    sectionItemName: 'Status',
  },
];

export const getSectionItemsCampaigns = () => [
  {
    path: '/rewards/reports',
    sectionItemNameId: 'sidenav_rewards_reports',
    sectionItemName: 'Reports',
  },
  {
    path: '/rewards/guideHistory',
    sectionItemNameId: 'reservations',
    sectionItemName: 'Reservations',
  },
  {
    path: '/rewards/messages',
    sectionItemNameId: MESSAGES,
    sectionItemName: 'Messages',
  },
  {
    path: '/rewards/fraud-detection',
    sectionItemNameId: 'fraud_detection',
    sectionItemName: 'Fraud detection',
  },
  {
    path: '/rewards/blacklist',
    sectionItemNameId: 'blacklist',
    sectionItemName: 'Blacklist',
  },
];

export const getSectionItemsMatchBots = () => [
  {
    path: '/rewards/match-bots-authors',
    sectionItemNameId: 'authorsBots',
    sectionItemName: 'Authors',
  },
  {
    path: '/rewards/match-bots-curators',
    sectionItemNameId: 'curatorsBots',
    sectionItemName: 'Curators',
  },
  {
    path: '/rewards/match-bots-sponsors',
    sectionItemNameId: 'sponsorsBots',
    sectionItemName: 'Sponsors',
  },
];

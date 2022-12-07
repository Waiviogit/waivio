export const rewardsSettings = {
  tab: {
    name: 'rewards',
    id: 'sideBar_rewards',
    defaultMessage: 'Rewards:',
  },
  settings: [
    {
      to: '/rewards/all',
      id: 'all',
      defaultMessage: 'All',
    },
    {
      to: '/rewards/eligible',
      id: 'eligible',
      defaultMessage: 'Eligible',
      forAuth: true,
    },
    {
      to: '/rewards/reserved',
      id: 'reserved',
      defaultMessage: 'Reserved',
      forAuth: true,
    },
    {
      to: '/rewards/receivable',
      id: 'receivable',
      defaultMessage: 'Receivable',
      forAuth: true,
    },
    {
      to: '/rewards/history',
      id: 'history',
      defaultMessage: 'History',
      forAuth: true,
    },
  ],
};

export const campaingSettings = withWarning => ({
  tab: {
    name: 'campaing',
    id: 'campaings',
    defaultMessage: 'Campaings:',
  },
  settings: [
    {
      to: '/rewards/create',
      id: 'create',
      defaultMessage: 'Create',
      paths: ['/rewards/duplicate', '/rewards/details', '/rewards/create'],
      forUser: true,
    },
    {
      to: '/rewards/manage',
      id: 'manage',
      defaultMessage: 'Manage',
      forUser: true,
    },
    {
      to: '/rewards/payable',
      id: 'payable',
      defaultMessage: 'Payable',
      withWarning,
      forUser: true,
    },
    {
      to: '/rewards/reports',
      id: 'reports',
      defaultMessage: 'Reports',
    },
    {
      to: '/rewards/reservations',
      id: 'reservations',
      defaultMessage: 'Reservations',
      forUser: true,
    },
    {
      to: '/rewards/messages',
      id: 'messages',
      defaultMessage: 'Messages',
      forUser: true,
    },
    {
      to: '/rewards/fraud-detection',
      id: 'fraud-detection',
      defaultMessage: 'Fraud detection',
      forUser: true,
    },
    {
      to: '/rewards/black-list',
      id: 'blackList',
      defaultMessage: 'Blacklist',
      forUser: true,
    },
  ],
});

export const matchBotsSettings = {
  tab: {
    name: 'matchbots',
    id: 'match_bots',
    defaultMessage: 'Match bots',
    forUser: true,
  },
  settings: [
    {
      to: '/rewards/match-bots-authors',
      id: 'authors',
      defaultMessage: 'Authors',
    },
    {
      to: '/rewards/match-bots-curators',
      id: 'curators',
      defaultMessage: 'Curators',
    },
    {
      to: '/rewards/match-bots-sponsors',
      id: 'sponsors',
      defaultMessage: 'Sponsors',
    },
  ],
};

export const refferalsSettings = {
  tab: {
    name: 'refferals',
    id: 'refferals',
    defaultMessage: 'Refferals',
    forUser: true,
  },
  settings: [
    {
      to: '/rewards/referral-details',
      id: 'details',
      defaultMessage: 'Details',
    },
    {
      to: '/rewards/referral-instructions',
      id: 'instructions',
      defaultMessage: 'Instructions',
    },
    {
      to: '/rewards/referral-status',
      id: 'status',
      defaultMessage: 'Status',
    },
  ],
};

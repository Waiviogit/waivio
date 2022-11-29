export const rewardsSettings = {
  tab: {
    name: 'rewards',
    id: 'sideBar_rewards',
    defaultMessage: 'Rewards:',
  },
  settings: [
    {
      to: '/rewards-new/all',
      id: 'all',
      defaultMessage: 'All',
    },
    {
      to: '/rewards-new/eligible',
      id: 'eligible',
      defaultMessage: 'Eligible',
      forAuth: true,
    },
    {
      to: '/rewards-new/reserved',
      id: 'reserved',
      defaultMessage: 'Reserved',
      forAuth: true,
    },
    {
      to: '/rewards-new/receivables',
      id: 'receivable',
      defaultMessage: 'Receivable',
      forAuth: true,
    },
    {
      to: '/rewards-new/history',
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
      to: '/rewards-new/create',
      id: 'create',
      defaultMessage: 'Create',
      paths: ['/rewards-new/duplicate', '/rewards-new/details', '/rewards-new/create'],
      forUser: true,
    },
    {
      to: '/rewards-new/manage',
      id: 'manage',
      defaultMessage: 'Manage',
      forUser: true,
    },
    {
      to: '/rewards-new/payables',
      id: 'payable',
      defaultMessage: 'Payable',
      withWarning,
      forUser: true,
    },
    {
      to: '/rewards-new/reports',
      id: 'reports',
      defaultMessage: 'Reports',
    },
    {
      to: '/rewards-new/reservations',
      id: 'reservations',
      defaultMessage: 'Reservations',
      forUser: true,
    },
    {
      to: '/rewards-new/messages',
      id: 'messages',
      defaultMessage: 'Messages',
      forUser: true,
    },
    {
      to: '/rewards-new/fraud-detection',
      id: 'fraud-detection',
      defaultMessage: 'Fraud detection',
      forUser: true,
    },
    {
      to: '/rewards-new/black-list',
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
      to: '/rewards-new/match-bots-authors',
      id: 'authors',
      defaultMessage: 'Authors',
    },
    {
      to: '/rewards-new/match-bots-curators',
      id: 'curators',
      defaultMessage: 'Curators',
    },
    {
      to: '/rewards-new/match-bots-sponsors',
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
      to: '/rewards-new/referral-details',
      id: 'details',
      defaultMessage: 'Details',
    },
    {
      to: '/rewards-new/referral-instructions',
      id: 'instructions',
      defaultMessage: 'Instructions',
    },
    {
      to: '/rewards-new/referral-status',
      id: 'status',
      defaultMessage: 'Status',
    },
  ],
};

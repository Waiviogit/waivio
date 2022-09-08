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
    },
    {
      to: '/rewards-new/reserved',
      id: 'reserved',
      defaultMessage: 'Reserved',
    },
    {
      to: '/rewards-new/receivables',
      id: 'receivable',
      defaultMessage: 'Receivable',
    },
    {
      to: '/rewards-new/history',
      id: 'history',
      defaultMessage: 'History',
    },
  ],
};

export const campaingSettings = {
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
    },
    {
      to: '/rewards-new/manage',
      id: 'manage',
      defaultMessage: 'Manage',
    },
    {
      to: '/rewards-new/payables',
      id: 'payable',
      defaultMessage: 'Payable',
    },
    {
      to: '/rewards-new/reservations',
      id: 'reservations',
      defaultMessage: 'Reservations',
    },
    {
      to: '/rewards-new/messages',
      id: 'messages',
      defaultMessage: 'Messages',
    },
    {
      to: '/rewards-new/fraud-detection',
      id: 'fraud-detection',
      defaultMessage: 'Fraud detection',
    },
    {
      to: '/rewards-new/black-list',
      id: 'blackList',
      defaultMessage: 'Blacklist',
    },
  ],
};

export const matchBotsSettings = {
  tab: {
    name: 'matchbots',
    id: 'match_bots',
    defaultMessage: 'Match bots',
  },
  settings: [
    {
      to: '/rewards-new/match-bots-sponsors',
      id: 'sponsors',
      defaultMessage: 'Sponsors',
    },
  ],
};

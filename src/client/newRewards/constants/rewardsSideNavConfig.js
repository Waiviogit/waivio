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
  ],
};

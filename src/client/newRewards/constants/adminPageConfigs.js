export const websiteStatisticsConfig = [
  [
    {
      id: 'userName',
      intl: {
        id: 'owner',
        defaultMessage: 'Owner',
      },
      type: 'link',
      to: item => `/@${item.userName}`,
      getName: item => item.userName,
    },
    {
      id: 'accountBalance.paid',
      intl: {
        id: 'balance_usd',
        defaultMessage: 'Balance ({currency})',
      },
    },
    {
      id: 'accountBalance.avgDau',
      intl: {
        id: 'average_dau',
        defaultMessage: 'Average DAU*',
      },
    },
    {
      id: 'accountBalance.dailyCost',
      intl: {
        id: 'daily_usd',
        defaultMessage: 'Daily cost ({currency})',
      },
    },
    {
      id: 'accountBalance.remainingDays',
      intl: {
        id: 'days_remaining',
        defaultMessage: 'Days remaining',
      },
    },
    {
      id: 'websites[0].host',
      intl: {
        id: 'website',
        defaultMessage: 'Website',
      },
      type: 'websiteName',
      to: item => `https://${item.websites[0].host}`,
      getName: item => item.websites[0].host,
    },
    {
      id: 'websites[0].parent',
      intl: {
        id: 'template',
        defaultMessage: 'Template',
      },
    },
    {
      id: 'websites[0].status',
      intl: {
        id: 'status',
        defaultMessage: 'Status',
      },
    },
    {
      id: 'websites[0].averageDau',
      intl: {
        id: 'site_dau',
        defaultMessage: 'Site DAU*',
      },
    },
    {
      id: 'delete',
      intl: {
        id: 'actions',
        defaultMessage: 'Actions',
      },
      type: 'delete',
      checkShowItem: (item, getBody) =>
        ['pending', 'inactive', 'suspended'].includes(item.websites[0].status)
          ? getBody(item, { type: 'delete' })
          : '-',
    },
  ],
];
export const websiteNewAccountsConfig = [
  [
    {
      id: 'userName',
      intl: {
        id: 'user',
        defaultMessage: 'User',
      },
      type: 'link',
      to: item => `/@${item.result.userName}`,
      getName: item => item.result.userName,
    },
    {
      id: 'purchased',
      intl: {
        id: 'purchased',
        defaultMessage: 'Purchased',
      },
    },
    {
      id: 'used',
      intl: {
        id: 'used',
        defaultMessage: 'Used',
      },
    },
  ],
];

export default null;

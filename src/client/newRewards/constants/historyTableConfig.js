export const configHistoryTableHeader = [
  {
    id: 'createdAt',
    intl: {
      id: 'from',
      defaultMessage: 'From',
    },
    type: 'date',
  },
  {
    id: 'expiredAt',
    intl: {
      id: 'till',
      defaultMessage: 'Till',
    },
    type: 'date',
  },
  {
    id: 'name',
    intl: {
      id: 'campaign',
      defaultMessage: 'Campaign',
    },
    type: 'link',
    to: item => `/rewards/details/${item._id}`,
  },
  {
    id: 'status',
    intl: {
      id: 'status',
      defaultMessage: 'Status',
    },
  },
  {
    id: 'type',
    intl: {
      id: 'type',
      defaultMessage: 'Type',
    },
  },
  {
    id: 'rewardInUSD',
    intl: {
      id: 'reward',
      defaultMessage: 'Reward',
    },
  },
  {
    id: 'currency',
    intl: {
      id: 'currency',
      defaultMessage: 'Currency',
    },
  },
  {
    id: 'completedTotal',
    intl: {
      id: 'reviews',
      defaultMessage: 'Reviews',
    },
  },
  {
    id: 'completed',
    intl: {
      id: 'paid',
      defaultMessage: 'Paid (WAIV)',
    },
  },
];

export default null;

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
    to: item => `/rewards-new/details/${item._id}`,
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
    hideForMobile: true,
  },
  {
    id: 'reward',
    type: 'round',
    precision: 3,
    intl: {
      id: 'reward',
      defaultMessage: 'Reward',
    },
    hideForMobile: true,
  },
  {
    id: 'currency',
    intl: {
      id: 'currency',
      defaultMessage: 'Currency',
    },
    hideForMobile: true,
  },
  {
    id: 'completedTotal',
    intl: {
      id: 'reviews',
      defaultMessage: 'Reviews',
    },
    hideForMobile: true,
  },
  {
    id: 'payed',
    type: 'round',
    precision: 3,
    intl: {
      id: 'paid_waiv',
      defaultMessage: 'Paid (WAIV)',
    },
    hideForMobile: true,
  },
];

export default null;

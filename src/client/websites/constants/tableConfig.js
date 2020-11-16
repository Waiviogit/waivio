export const configBalanceTableHeader = [
  {
    id: 'paid',
    intl: {
      id: 'paid_hbd',
      defaultMessage: 'Paid (HBD)',
    },
  },
  {
    id: 'avgDau',
    intl: {
      id: 'average_dau',
      defaultMessage: 'Average DAU*',
    },
  },
  {
    id: 'dailyCost',
    intl: {
      id: 'daily_cost',
      defaultMessage: 'Daily cost(HBD)',
    },
  },
  {
    id: 'remainingDays',
    intl: {
      id: 'days_remaning',
      defaultMessage: 'Days remaining',
    },
  },
];
export const configUsersWebsitesTableHeader = [
  {
    id: 'active',
    type: 'checkbox',
    intl: {
      id: 'active',
      defaultMessage: 'Active',
    },
  },
  {
    id: 'name',
    intl: {
      id: 'website',
      defaultMessage: 'Website',
    },
  },
  {
    id: 'parent',
    intl: {
      id: 'template',
      defaultMessage: 'Template',
    },
  },
  {
    id: 'status',
    intl: {
      id: 'status',
      defaultMessage: 'Status',
    },
  },
  {
    id: 'averageDau',
    intl: {
      id: 'average_dau',
      defaultMessage: 'Average DAU*',
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
      item.status === 'pending' ? getBody(item, { type: 'delete' }) : '-',
  },
];
export const configReportsWebsitesTableHeader = [
  {
    id: 'createdAt',
    intl: {
      id: 'date',
      defaultMessage: 'Date',
    },
  },
  {
    id: 'type',
    intl: {
      id: 'action',
      defaultMessage: 'Action',
    },
  },
  {
    id: 'countUsers',
    intl: {
      id: 'DAU',
      defaultMessage: 'DAU',
    },
  },
  {
    id: 'amount',
    intl: {
      id: 'amount_hbd',
      defaultMessage: 'Amount (HBD)',
    },
  },
  {
    id: 'balance',
    intl: {
      id: 'balance_hbd',
      defaultMessage: 'Balance (HBD)',
    },
  },
];

export default null;

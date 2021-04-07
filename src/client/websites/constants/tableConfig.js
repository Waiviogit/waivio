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
    style: {
      overflow: 'hidden',
      maxWidth: '150px',
      textOverflow: 'ellipsis',
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
      ['pending', 'inactive'].includes(item.status) ? getBody(item, { type: 'delete' }) : '-',
  },
];

export const configReportsWebsitesTableHeader = [
  {
    id: 'createdAt',
    intl: {
      id: 'payments_table_name_data',
      defaultMessage: 'Date',
    },
  },
  {
    id: 'message',
    style: {
      textAlign: 'left',
      padding: '0 0 0 5px',
      overflow: 'hidden',
      maxWidth: '150px',
      textOverflow: 'ellipsis',
    },
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
      id: 'payments_table_amount_hbd',
      defaultMessage: 'Amount (HBD)',
    },
  },
  {
    id: 'balance',
    intl: {
      id: 'payments_table_balance_hbd',
      defaultMessage: 'Balance (HBD)',
    },
  },
];

export const configActiveVipTicketTableHeader = [
  {
    id: 'createdAt',
    intl: {
      id: 'purchased',
      defaultMessage: 'Purchased',
    },
  },
  {
    id: 'ticket',
    intl: {
      id: 'vip_ticket',
      defaultMessage: 'VIP ticket',
    },
  },
  {
    id: 'link',
    intl: {
      id: 'link',
      defaultMessage: 'Link',
    },
  },
  {
    id: 'share',
    intl: {
      id: 'share',
      defaultMessage: 'Share',
    },
  },
];

export const configCreateAccountsTableHeader = [
  {
    id: 'createdAt',
    intl: {
      id: 'created',
      defaultMessage: 'Created',
    },
  },
  {
    id: 'ticket',
    intl: {
      id: 'vip_ticket',
      defaultMessage: 'VIP ticket',
    },
  },
];

export default null;

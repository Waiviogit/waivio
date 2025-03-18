export const configBalanceTableHeader = currency => [
  {
    id: 'paid',
    intl: {
      id: 'paid_usd',
      defaultMessage: 'Paid ({currency})',
    },
    value: { currency },
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
      id: 'daily_usd',
      defaultMessage: 'Daily cost({currency})',
    },
    value: { currency },
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
    type: 'websiteName',
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
    id: 'website_canonical',
    type: 'radio',
    intl: {
      id: 'primary_canonical',
      defaultMessage: 'Primary canonical',
    },
  },
  {
    id: 'paypal',
    type: 'paypal',
    intl: {
      id: 'payPal',
      defaultMessage: 'PayPal',
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
      ['pending', 'inactive', 'suspended'].includes(item.status)
        ? getBody(item, { type: 'delete' })
        : '-',
  },
];

export const configReportsWebsitesTableHeader = currency => [
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
      id: 'payments_table_amount_usd',
      defaultMessage: 'Amount ({currency})',
    },
    value: { currency },
  },
  {
    id: 'balance',
    intl: {
      id: 'payments_table_balance_usd',
      defaultMessage: 'Balance ({currency})',
    },
    value: { currency },
  },
];

export default null;

export const creditsAdminConfig = [
  {
    type: 'date',
    id: 'createdAt',
    intl: {
      id: 'payments_table_name_data',
      defaultMessage: 'Date',
    },
  },
  {
    id: 'description',
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
    id: 'amount',
    intl: {
      id: 'amount_usd',
      defaultMessage: 'Amount (USD)',
    },
  },

  {
    id: 'userName',
    intl: {
      id: 'to',
      defaultMessage: 'To',
    },
    type: 'link',
    to: i => `/@${i.userName}`,
  },
];

export default null;

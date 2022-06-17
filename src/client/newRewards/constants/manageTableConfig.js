export const manageTableHeaderConfig = [
  [
    {
      type: 'checkbox',
      intl: {
        id: 'active',
        defaultMessage: 'Active',
      },
      rowspan: 2,
    },
    {
      intl: {
        id: 'campaign',
        defaultMessage: 'Campaign',
      },
      rowspan: 2,
    },
    {
      intl: {
        id: 'status',
        defaultMessage: 'Status**',
      },
      rowspan: 2,
    },
    {
      intl: {
        id: 'Type',
        defaultMessage: 'Type',
      },
      rowspan: 2,
    },
    {
      intl: {
        id: 'Budget Target',
        defaultMessage: 'Budget Target',
      },
      colspan: 2,
      hidden: true,
    },
    {
      intl: {
        id: 'Current Month',
        defaultMessage: 'Current Month',
      },
      colspan: 2,
      hidden: true,
    },
    {
      intl: {
        id: 'Remaining',
        defaultMessage: 'Remaining',
      },
      rowspan: 2,
    },
  ],
  [
    {
      intl: {
        id: 'Monthly',
        defaultMessage: 'Monthly({currency})',
      },
    },
    {
      intl: {
        id: 'Reward',
        defaultMessage: 'Reward({currency})',
      },
    },
    {
      intl: {
        id: 'reserved',
        defaultMessage: 'Reserved',
      },
    },
    {
      intl: {
        id: 'Completed',
        defaultMessage: 'Completed',
      },
    },
  ],
];

export default null;

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
        id: 'status**',
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
      hideForMobile: true,
    },
    {
      intl: {
        id: 'Current Month',
        defaultMessage: 'Current Month',
      },
      colspan: 2,
      hidden: true,
      hideForMobile: true,
    },
    {
      intl: {
        id: 'Remaining',
        defaultMessage: 'Remaining',
      },
      rowspan: 2,
      type: 'round',
      precision: 3,
      hideForMobile: true,
    },
  ],
  [
    {
      intl: {
        id: 'Monthly',
        defaultMessage: 'Monthly({currency})',
      },
      hideForMobile: true,
    },
    {
      intl: {
        id: 'Reward',
        defaultMessage: 'Reward({currency})',
      },
      hideForMobile: true,
    },
    {
      intl: {
        id: 'reserved',
        defaultMessage: 'Reserved',
      },
      hideForMobile: true,
    },
    {
      intl: {
        id: 'Completed',
        defaultMessage: 'Completed',
      },
      hideForMobile: true,
    },
  ],
];

export default null;

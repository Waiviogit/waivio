export const configReportsWebsitesTableHeader = type => [
  {
    id: 'checked',
    type: 'checkbox',
    intl: {
      id: 'x',
      defaultMessage: 'X',
    },
  },
  {
    id: 'time',
    style: {
      width: '120px',
    },
    intl: {
      id: 'table_date',
      defaultMessage: 'Date',
    },
  },
  {
    id: 'fieldHIVE',
    style: {
      width: '120px',
    },
    intl: {
      id: 'table_HIVE',
      defaultMessage: 'HIVE',
    },
  },
  {
    id: 'fieldHP',
    style: {
      width: '120px',
    },
    intl: {
      id: 'table_HP',
      defaultMessage: 'HP',
    },
  },
  {
    id: 'fieldHBD',
    style: {
      width: '120px',
    },
    intl: {
      id: 'table_HBD',
      defaultMessage: 'HBD',
    },
  },
  {
    id: 'hiveCurrentCurrency',
    style: {
      width: '120px',
    },
    intl: {
      id: 'table_HIVE_USD',
      defaultMessage: `HIVE/${type}`,
    },
  },
  {
    id: 'hbdCurrentCurrency',
    style: {
      width: '120px',
    },
    intl: {
      id: 'table_HBD_USD',
      defaultMessage: `HBD/${type}`,
    },
  },
  {
    id: 'withdrawDeposit',
    style: {
      textTransform: 'upperCase',
      width: '25px',
    },
    intl: {
      id: '±',
      defaultMessage: '±',
    },
  },
  {
    id: 'userName',
    intl: {
      id: 'account',
      defaultMessage: 'Account',
    },
  },
  {
    id: 'fieldDescription',
    style: {
      maxWidth: '300px',
      wordWrap: 'break-word',
    },
    intl: {
      id: 'table_description',
      defaultMessage: 'Description',
    },
  },
  {
    id: 'fieldMemo',
    style: {
      maxWidth: '335px',
      wordWrap: 'break-word',
    },
    intl: {
      id: 'memo',
      defaultMessage: 'Memo',
    },
  },
];
export const configActiveReportsTableHeader = [
  {
    id: 'active',
    type: 'checkbox',
    intl: {
      id: 'active',
      defaultMessage: 'active',
    },
    getChecked: i => i.status === 'IN_PROGRESS',
  },
  {
    id: 'endDate',
    type: 'date',
    intl: {
      id: 'end_date',
      defaultMessage: 'End date',
    },
  },
  {
    id: 'startDate',
    type: 'date',
    intl: {
      id: 'start_date',
      defaultMessage: 'Start date',
    },
  },
  {
    id: 'accounts',
    type: 'list',
    key: 'name',
    intl: {
      id: 'accounts',
      defaultMessage: 'Accounts',
    },
  },
  {
    id: 'currency',
    // type: 'checkbox',
    intl: {
      id: 'currency',
      defaultMessage: 'Currency',
    },
  },
  {
    id: 'deposits',
    type: 'currency',
    view: 'symbol',
    intl: {
      id: 'current_deposits',
      defaultMessage: 'Current deposits',
    },
  },
  {
    id: 'withdrawals',
    type: 'currency',
    view: 'symbol',
    intl: {
      id: 'current_withdrawals',
      defaultMessage: 'Current withdrawals',
    },
  },
  {
    id: 'active',
    type: 'delete',
    intl: {
      id: 'Actions',
      defaultMessage: 'Actions',
    },
    checkShowItem: (item, getBody) =>
      ['IN_PROGRESS', 'PAUSED'].includes(item.status)
        ? getBody(item, { type: 'delete', name: 'stop' })
        : getBody(item, { type: 'delete', name: 'resume' }),
  },
];
export const configHistoryReportsTableHeader = [
  {
    id: 'endDate',
    type: 'date',
    intl: {
      id: 'end_date',
      defaultMessage: 'End date',
    },
  },
  {
    id: 'startDate',
    type: 'date',
    intl: {
      id: 'start_date',
      defaultMessage: 'Start date',
    },
  },
  {
    id: 'accounts',
    type: 'list',
    key: 'name',
    intl: {
      id: 'accounts',
      defaultMessage: 'Accounts',
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
    id: 'deposits',
    type: 'currency',
    view: 'symbol',
    intl: {
      id: 'current_deposits',
      defaultMessage: 'Total deposits',
    },
  },
  {
    id: 'withdrawals',
    type: 'currency',
    view: 'symbol',
    intl: {
      id: 'current_deposits',
      defaultMessage: 'Total withdrawals',
    },
  },
  {
    id: 'active',
    type: 'action',
    intl: {
      id: 'details',
      defaultMessage: 'details',
    },
  },
  {
    id: 'active',
    type: 'action',
    intl: {
      id: 'CSV',
      defaultMessage: 'CSV',
    },
  },
];

export default null;

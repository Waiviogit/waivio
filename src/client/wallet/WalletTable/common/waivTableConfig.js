export const configWaivReportsWebsitesTableHeader = type => [
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
    id: 'fieldWAIV',
    style: {
      width: '120px',
    },
    intl: {
      id: 'table_WAIV',
      defaultMessage: 'WAIV',
    },
  },
  {
    id: 'fieldWP',
    style: {
      width: '120px',
    },
    intl: {
      id: 'table_WP',
      defaultMessage: 'WP',
    },
  },
  {
    id: 'waivCurrentCurrency',
    style: {
      width: '120px',
    },
    intl: {
      id: 'table_WAIV_USD',
      defaultMessage: `WAIV/${type}`,
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

export default null;

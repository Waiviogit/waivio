export const stateOnGetAccountStart = {
  countTookPartCampaigns: 0,
  createdCampaignsCount: 0,
  hasReceivables: '',
  tabType: '',
  users: {
    asd09: {
      failed: false,
      fetching: true,
      loaded: false,
    },
  },
  topExperts: {
    list: [],
    isFetching: false,
    hasMore: true,
  },
  randomExperts: {
    list: [],
    isFetching: false,
    fetched: false,
  },
};

export const stateOnGetAccountSuccess = {
  users: {
    asd09: {
      failed: false,
      fetching: false,
      loaded: true,
    },
  },
  countTookPartCampaigns: 0,
  createdCampaignsCount: 0,
  hasReceivables: '',
  tabType: '',
  topExperts: {
    list: [],
    isFetching: false,
    hasMore: true,
  },
  randomExperts: {
    list: [],
    isFetching: false,
    fetched: false,
  },
};

export const stateOnGetAccountError = {
  countTookPartCampaigns: 0,
  createdCampaignsCount: 0,
  hasReceivables: '',
  tabType: '',
  users: {
    asd09: {
      failed: true,
      fetching: false,
      loaded: false,
    },
  },
  topExperts: {
    list: [],
    isFetching: false,
    hasMore: true,
  },
  randomExperts: {
    list: [],
    isFetching: false,
    fetched: false,
  },
};

export const stateOnGetRandomStart = {
  countTookPartCampaigns: 0,
  createdCampaignsCount: 0,
  hasReceivables: '',
  tabType: '',
  users: {},
  topExperts: {
    list: [],
    isFetching: false,
    hasMore: true,
  },
  randomExperts: {
    list: [],
    isFetching: true,
    fetched: false,
  },
};

export const stateOnGetRandomSuccess = {
  countTookPartCampaigns: 0,
  createdCampaignsCount: 0,
  hasReceivables: '',
  tabType: '',
  users: {},
  topExperts: {
    list: [],
    isFetching: false,
    hasMore: true,
  },
  randomExperts: {
    list: [
      {
        _id: '5cb0cb93f03c2c421e9e2b72',
        read_locales: [],
        objects_follow: [],
        name: 'trafalgar',
        createdAt: '2019-04-12T17:32:03.903Z',
        updatedAt: '2020-02-28T06:00:00.008Z',
      },
      {
        _id: '5cb0554b4f111432b44e6092',
        read_locales: [],
        objects_follow: [],
        name: 'goodhello',
        createdAt: '2019-04-12T09:07:23.636Z',
        updatedAt: '2020-02-28T06:30:28.799Z',
      },
    ],
    isFetching: false,
    fetched: true,
  },
};

export const stateOnGetRandomError = {
  countTookPartCampaigns: 0,
  createdCampaignsCount: 0,
  hasReceivables: '',
  tabType: '',
  users: {},
  topExperts: {
    list: [],
    isFetching: false,
    hasMore: true,
  },
  randomExperts: {
    list: [],
    isFetching: false,
    fetched: false,
  },
};

export const stateOnGetTopStart = {
  countTookPartCampaigns: 0,
  createdCampaignsCount: 0,
  hasReceivables: '',
  tabType: '',
  users: {},
  topExperts: {
    list: [],
    isFetching: true,
    hasMore: true,
  },
  randomExperts: {
    list: [],
    isFetching: false,
    fetched: false,
  },
};

export const stateOnGetTopSuccess = {
  countTookPartCampaigns: 0,
  createdCampaignsCount: 0,
  hasReceivables: '',
  tabType: '',
  users: {},
  topExperts: {
    list: [
      {
        _id: '5cb0b229f03c2c421e46f33b',
        read_locales: [],
        objects_follow: [],
        name: 'blocktrades',
        createdAt: '2019-04-12T15:43:37.421Z',
        updatedAt: '2020-02-28T13:00:00.013Z',
      },
      {
        _id: '5cb03ccb231b962d811f0d0b',
        read_locales: [],
        objects_follow: [],
        name: 'haejin',
        createdAt: '2019-04-12T07:22:51.114Z',
        updatedAt: '2020-02-28T13:00:00.013Z',
      },
    ],
    isFetching: false,
    hasMore: false,
  },
  randomExperts: {
    list: [],
    isFetching: false,
    fetched: false,
  },
};

export const stateOnGetTopError = {
  countTookPartCampaigns: 0,
  createdCampaignsCount: 0,
  hasReceivables: '',
  tabType: '',
  users: {},
  topExperts: {
    list: [],
    isFetching: false,
    hasMore: false,
  },
  randomExperts: {
    list: [],
    isFetching: false,
    fetched: false,
  },
};

export const randomExpertsList = [
  {
    _id: '5cb0cb93f03c2c421e9e2b72',
    read_locales: [],
    objects_follow: [],
    name: 'trafalgar',
    createdAt: '2019-04-12T17:32:03.903Z',
    updatedAt: '2020-02-28T06:00:00.008Z',
  },
  {
    _id: '5cb0554b4f111432b44e6092',
    read_locales: [],
    objects_follow: [],
    name: 'goodhello',
    createdAt: '2019-04-12T09:07:23.636Z',
    updatedAt: '2020-02-28T06:30:28.799Z',
  },
];

export const topExpertsList = [
  {
    _id: '5cb0b229f03c2c421e46f33b',
    read_locales: [],
    objects_follow: [],
    name: 'blocktrades',
    createdAt: '2019-04-12T15:43:37.421Z',
    updatedAt: '2020-02-28T13:00:00.013Z',
  },
  {
    _id: '5cb03ccb231b962d811f0d0b',
    read_locales: [],
    objects_follow: [],
    name: 'haejin',
    createdAt: '2019-04-12T07:22:51.114Z',
    updatedAt: '2020-02-28T13:00:00.013Z',
  },
];

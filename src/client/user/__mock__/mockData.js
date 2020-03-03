export const stateOnGetAccountStart = {
  users: {
    'user-asd09': {
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
    'user-asd09': {
      failed: false,
      fetching: false,
      loaded: true,
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

export const stateOnGetAccountError = {
  users: {
    'user-asd09': {
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

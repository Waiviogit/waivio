// eslint-disable-next-line import/prefer-default-export
export const mockData = {
  username: 'vallon',
  isAuthUser: true,
  currentUserCards: [
    {
      alias: 'Waivio Service',
      guideName: 'sor31',
      lastCreatedAt: '2020-08-31T07:40:03.623Z',
      payable: 0.008,
      payed: false,
    },
    {
      alias: 'Waivio Service',
      guideName: 'asd09',
      lastCreatedAt: '2020-10-13T15:07:13.471Z',
      payable: 0.006,
      payed: false,
    },
    {
      alias: '',
      guideName: 'vallon',
      lastCreatedAt: '2020-06-22T07:39:21.654Z',
      payable: 0.004,
      payed: false,
    },
  ],
  hasMore: false,
  isErrorLoading: false,
  isLoadingMoreUserCards: false,
  getMoreUserCards: jest.fn(),
  sortBy: 'recency',
  setSortBy: jest.fn(),
  history: {},
};

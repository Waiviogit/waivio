// eslint-disable-next-line
export const getAuthorsChildWobjects = (author_permlink, skip, limit) => {
  return Promise.resolve([
    { author_permlink: 'test 1', weight: 10 },
    { author_permlink: 'test 2', weight: 11 },
    { author_permlink: 'test 3', weight: 12 },
  ]);
};

export const getAuthorsChildWobjects = () =>
  Promise.resolve([
    { author_permlink: 'test 1', weight: 10 },
    { author_permlink: 'test 2', weight: 11 },
    { author_permlink: 'test 3', weight: 12 },
  ]);

export const getObjectExpertiseByType = (objectType, skip = 0, limit = 5) =>
  Promise.resolve(
    [
      { name: 'blocktrades', weight: 1505893859.8626847 },
      { name: 'zaku', weight: 1306784628.9575205 },
      { name: 'exyle', weight: 1151773051.6096184 },
      { name: 'ocd', weight: 975369373.4495138 },
      { name: 'steemmonsters', weight: 895798629.6185874 },
      { name: 'test1', weight: 458945629.6185874 },
      { name: 'test2', weight: 658945629.6185874 },
      { name: 'test3', weight: 758945629.6185874 },
    ].slice(skip, skip + limit),
  );

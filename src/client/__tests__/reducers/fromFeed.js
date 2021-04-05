import { getFeed } from '../../reducers';

jest.mock('../../vendor/steemitHelpers.js', () => {});

describe('fromFeed', () => {
  it('Should return feed', () => {
    const state = { feed: {} };

    expect(getFeed(state)).toEqual(state.feed);
  });
});

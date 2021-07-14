import {
  getIsPostFailed,
  getIsPostFetching,
  getIsPostLoaded,
  getPendingLikes,
  getPostContent,
  getPosts,
} from '../../../store/postsStore/postsSelectors';

jest.mock('../../vendor/steemitHelpers.js', () => {});

describe('fromPosts', () => {
  let state;
  let author;
  let permlink;

  beforeEach(() => {
    permlink = 'permlink';
    author = 'author';

    state = {
      posts: {
        list: [
          {
            author: 'author',
            permlink: 'permlink',
          },
        ],
        pendingLikes: 'pendingLikes',
        postsStates: {
          'author/permlink': {
            fetching: 'fetching',
            loaded: 'loaded',
            failed: 'failed',
          },
        },
      },
    };
  });

  it('Should return posts list', () => {
    expect(getPosts(state, author, permlink)).toEqual(state.posts.list);
  });

  it('Should return post', () => {
    expect(getPostContent(state, permlink)).toEqual(state.posts.list[0]);
  });

  it('Should return pendingLikes', () => {
    expect(getPendingLikes(state, author, permlink)).toBe('pendingLikes');
  });

  it('Should return fetching', () => {
    expect(getIsPostFetching(state, author, permlink)).toBe('fetching');
  });

  it('Should return loaded', () => {
    expect(getIsPostLoaded(state, author, permlink)).toBe('loaded');
  });

  it('Should return failed', () => {
    expect(getIsPostFailed(state, author, permlink)).toBe('failed');
  });
});

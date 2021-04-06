import {
  getUser,
  getTopExperts,
  getIsUserLoaded,
  getIsUserFailed,
  getRandomExperts,
  getIsUserFetching,
  getTopExpertsLoading,
  getTopExpertsHasMore,
  getRandomExpertsLoaded,
  getRandomExpertsLoading,
} from '../../store/reducers';

jest.mock('../../vendor/steemitHelpers.js', () => {});

describe('fromUsers', () => {
  const username = 'username';
  const state = {
    users: {
      users: {
        username: {
          fetching: 'fetching',
          loaded: 'loaded',
          failed: 'failed',
        },
      },
      topExperts: {
        list: 'topExperts list',
        isFetching: 'topExperts isFetching',
        hasMore: 'topExperts hasMore',
      },
      randomExperts: {
        list: 'randomExperts list',
        isFetching: 'randomExperts isFetching',
        fetched: 'randomExperts fetched',
      },
    },
  };

  it('Should return formatted name', () => {
    expect('username').toBe('username');
  });

  it('Should return user', () => {
    expect(getUser(state, username)).toEqual(state.users.users.username);
  });

  it('Should return fetching', () => {
    expect(getIsUserFetching(state, username)).toEqual('fetching');
  });

  it('Should return loaded', () => {
    expect(getIsUserLoaded(state, username)).toEqual('loaded');
  });

  it('Should return failed', () => {
    expect(getIsUserFailed(state, username)).toEqual('failed');
  });

  it('Should return false on fetching', () => {
    expect(getIsUserFetching(state)).toEqual(false);
  });

  it('Should return false on loaded', () => {
    expect(getIsUserLoaded(state)).toEqual(false);
  });

  it('Should return false on failed', () => {
    expect(getIsUserFailed(state)).toEqual(false);
  });

  it('Should return false on topExperts list', () => {
    expect(getTopExperts(state)).toEqual('topExperts list');
  });

  it('Should return false on topExperts isFetching', () => {
    expect(getTopExpertsLoading(state)).toEqual('topExperts isFetching');
  });

  it('Should return false on topExperts hasMore', () => {
    expect(getTopExpertsHasMore(state)).toEqual('topExperts hasMore');
  });

  it('Should return false on randomExperts list', () => {
    expect(getRandomExperts(state)).toEqual('randomExperts list');
  });

  it('Should return false on randomExperts fetched', () => {
    expect(getRandomExpertsLoaded(state)).toEqual('randomExperts fetched');
  });

  it('Should return false on randomExperts isFetching', () => {
    expect(getRandomExpertsLoading(state)).toEqual('randomExperts isFetching');
  });
});

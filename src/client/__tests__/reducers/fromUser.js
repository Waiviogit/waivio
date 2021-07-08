import {
  getFetchFollowListError,
  getFollowingFetched,
  getFollowingList,
  getFollowingObjectsList,
  getFollowingObjectsUpdatesByType,
  getFollowingUpdates,
  getFollowingUpdatesFetched,
  getFollowingUsersUpdates,
  getIsFetchingFollowingList,
  getIsLoadingNotifications,
  getLatestNotification,
  getNotifications,
  getPendingFollowingObjects,
  getPendingFollows,
  getPendingUpdate,
  getRecommendedObjects,
  getUserLocation,
} from '../../../store/userStore/userSelectors';

jest.mock('../../vendor/steemitHelpers.js', () => {});

describe('fromUser', () => {
  const state = {
    user: {
      following: {
        list: [],
        fetched: 'fetched',
        isFetching: 'isFetching',
        pendingFollows: 'following pendingFollows',
      },
      followingObjects: {
        pendingFollows: 'followingObjects pendingFollows',
      },
      recommendedObjects: 'recommendedObjects',
      notifications: 'notifications',
      loadingNotifications: 'loadingNotifications',
      fetchFollowListError: 'fetchFollowListError',
      latestNotification: 'latestNotification',
      location: 'location',
      followingUpdates: {
        usersUpdates: 'usersUpdates',
        objectsUpdates: {
          objType: {
            related_wobjects: 'related_wobjects',
          },
        },
        fetched: 'followingUpdates fetched',
      },
      pendingUpdate: 'pendingUpdate',
    },
  };

  it('Should return following list', () => {
    expect(getFollowingList(state)).toEqual(state.user.following.list);
  });

  it('Should return followingObjects list', () => {
    expect(getFollowingObjectsList(state)).toEqual(state.user.followingObjects.list);
  });

  it('Should return following pendingFollows', () => {
    expect(getPendingFollows(state)).toBe('following pendingFollows');
  });

  it('Should return pendingFollows', () => {
    expect(getPendingFollowingObjects(state)).toBe('followingObjects pendingFollows');
  });

  it('Should return isFetching', () => {
    expect(getIsFetchingFollowingList(state)).toBe('isFetching');
  });

  it('Should return recommendedObjects', () => {
    expect(getRecommendedObjects(state)).toBe('recommendedObjects');
  });

  it('Should return fetched', () => {
    expect(getFollowingFetched(state)).toBe('fetched');
  });

  it('Should return notifications', () => {
    expect(getNotifications(state)).toBe('notifications');
  });

  it('Should return loadingNotifications', () => {
    expect(getIsLoadingNotifications(state)).toBe('loadingNotifications');
  });

  it('Should return fetchFollowListError', () => {
    expect(getFetchFollowListError(state)).toBe('fetchFollowListError');
  });

  it('Should return latestNotification', () => {
    expect(getLatestNotification(state)).toBe('latestNotification');
  });

  it('Should return location', () => {
    expect(getUserLocation(state)).toBe('location');
  });

  it('Should return followingUpdates', () => {
    expect(getFollowingUpdates(state)).toEqual(state.user.followingUpdates);
  });

  it('Should return usersUpdates', () => {
    expect(getFollowingUsersUpdates(state)).toEqual('usersUpdates');
  });

  it('Should return following Updates by type', () => {
    const objType = 'objType';

    expect(getFollowingObjectsUpdatesByType(state, objType)).toEqual('related_wobjects');
  });

  it('Should return followingUpdates fetched', () => {
    expect(getFollowingUpdatesFetched(state)).toEqual('followingUpdates fetched');
  });

  it('Should return followingUpdates pendingUpdate', () => {
    expect(getPendingUpdate(state)).toEqual('pendingUpdate');
  });
});

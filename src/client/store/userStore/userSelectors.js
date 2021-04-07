import { get } from 'lodash';
import { createSelector } from 'reselect';

// selector
export const userState = state => state.user;

// reselect function
export const getFollowingObject = createSelector([userState], state => state.following);

export const getFollowingObjectsObject = createSelector(
  [userState],
  state => state.followingObjects,
);

export const getFollowingList = createSelector([getFollowingObject], following =>
  Object.keys(following.list),
);

export const getPendingFollows = createSelector(
  [getFollowingObject],
  following => following.pendingFollows,
);

export const getIsFetchingFollowingList = createSelector(
  [getFollowingObject],
  following => following.isFetching,
);

export const getFollowingFetched = createSelector(
  [getFollowingObject],
  following => following.fetched,
);

export const getFollowingObjectsList = createSelector(
  [getFollowingObjectsObject],
  followingObjects => followingObjects.list,
);

export const getPendingFollowingObjects = createSelector(
  [getFollowingObjectsObject],
  followingObjects => followingObjects.pendingFollows,
);

export const getRecommendedObjects = createSelector([userState], user => user.recommendedObjects);

export const getNotifications = createSelector([userState], user => user.notifications);

export const getIsLoadingNotifications = createSelector(
  [userState],
  user => user.loadingNotifications,
);

export const getFetchFollowListError = createSelector(
  [userState],
  user => user.fetchFollowListError,
);

export const getLatestNotification = createSelector([userState], user => user.latestNotification);

export const getUserLocation = createSelector([userState], user => user.location);

export const getFollowingUpdates = createSelector([userState], user => user.followingUpdates);

export const getFollowingUsersUpdates = createSelector(
  [getFollowingUpdates],
  followingUpdates => followingUpdates.usersUpdates,
);

export const getFollowingObjectsUpdatesByType = createSelector(
  getFollowingUpdates,
  (state, objType) => objType,
  (followingUpdates, objType) =>
    get(followingUpdates, ['objectsUpdates', objType, 'related_wobjects'], []),
);

export const getFollowingUpdatesFetched = createSelector(
  [getFollowingUpdates],
  followingUpdates => followingUpdates.fetched,
);

export const getPendingUpdate = createSelector([userState], user => user.pendingUpdate);

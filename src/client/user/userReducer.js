import { get, keyBy, orderBy, slice, omit } from 'lodash';
import * as authActions from '../auth/authActions';
import * as userActions from './userActions';
import * as wobjActions from '../object/wobjActions';
import * as appTypes from '../app/appActions';

const initialState = {
  recommendedObjects: [],
  recommendedTopics: [],
  recommendedExperts: [],
  location: {},
  following: {
    list: {},
    pendingFollows: [],
    isFetching: false,
    fetched: false,
  },
  followingObjects: {
    list: [],
    pendingFollows: [],
    isFetching: false,
    fetched: false,
  },
  followingUpdates: {
    usersUpdates: {
      users: [],
      hasMore: false,
    },
    objectsUpdates: {},
    isFetching: false,
    fetched: false,
  },
  notifications: [],
  latestNotification: {},
  loadingNotifications: false,
  fetchFollowListError: false,
  pendingUpdate: false,
};

const filterRecommendedObjects = (objects, count = 5) => {
  const ordered = orderBy(objects, ['weight'], ['desc']);
  return slice(ordered, 0, count);
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case userActions.GET_FOLLOWING_START:
      return {
        ...state,
        following: {
          ...state.following,
          list: {},
          isFetching: true,
          fetched: false,
        },
        fetchFollowListError: false,
      };

    case userActions.GET_FOLLOWING_ERROR:
      return {
        ...state,
        following: {
          ...state.following,
          list: {},
          isFetching: false,
          fetched: true,
        },
        fetchFollowListError: true,
      };

    // eslint-disable-next-line no-case-declarations
    case userActions.GET_FOLLOWING_SUCCESS:
      const following = {};
      action.payload.forEach(user => {
        following[user.name] = true;
      });
      return {
        ...state,
        following: {
          ...state.following,
          list: following,
          isFetching: false,
          fetched: true,
        },
        fetchFollowListError: false,
      };

    case userActions.GET_FOLLOWING_OBJECTS_START:
      return {
        ...state,
        followingObjects: {
          ...state.followingObjects,
          list: [],
          isFetching: true,
          fetched: false,
        },
        fetchFollowListError: false,
      };

    case userActions.GET_FOLLOWING_OBJECTS_ERROR:
      return {
        ...state,
        followingObjects: {
          ...state.followingObjects,
          list: [],
          isFetching: false,
          fetched: true,
        },
        fetchFollowListError: true,
      };

    case userActions.GET_FOLLOWING_OBJECTS_SUCCESS:
      return {
        ...state,
        followingObjects: {
          ...state.followingObjects,
          list: action.payload,
          isFetching: false,
          fetched: true,
        },
        fetchFollowListError: false,
      };

    case userActions.FOLLOW_USER_START:
    case userActions.UNFOLLOW_USER.START:
      return {
        ...state,
        following: {
          ...state.following,
          pendingFollows: [...state.following.pendingFollows, action.meta.username],
        },
      };
    case userActions.GET_USER_LOCATION.SUCCESS:
      return {
        ...state,
        location: action.payload,
      };
    case userActions.FOLLOW_USER_SUCCESS:
      return {
        ...state,
        following: {
          ...state.following,
          list: { ...state.following.list, [action.meta.username]: true },
          pendingFollows: state.following.pendingFollows.filter(
            user => user !== action.meta.username,
          ),
        },
      };
    case userActions.UNFOLLOW_USER.SUCCESS:
      return {
        ...state,
        following: {
          ...state.following,
          list: omit(state.following.list, action.meta.username),
          pendingFollows: state.following.pendingFollows.filter(
            user => user !== action.meta.username,
          ),
        },
      };

    case userActions.FOLLOW_USER_ERROR:
    case userActions.UNFOLLOW_USER.ERROR:
      return {
        ...state,
        following: {
          ...state.following,
          pendingFollows: state.following.pendingFollows.filter(
            user => user !== action.meta.username,
          ),
        },
      };

    case userActions.GET_FOLLOWING_UPDATES.START:
      return {
        ...state,
        followingUpdates: {
          ...state.followingUpdates,
          isFetching: true,
          fetched: false,
        },
      };

    case userActions.GET_FOLLOWING_UPDATES.SUCCESS: {
      const { users_updates: usersUpdates, wobjects_updates: objectsUpdates } = action.payload;
      return {
        ...state,
        followingUpdates: {
          usersUpdates,
          objectsUpdates: keyBy(objectsUpdates, 'object_type'),
          isFetching: false,
          fetched: true,
        },
      };
    }

    case userActions.GET_FOLLOWING_UPDATES.ERROR: {
      const { followingUpdates } = initialState;
      return {
        ...state,
        followingUpdates,
      };
    }

    case userActions.GET_FOLLOWING_USERS_UPDATES.SUCCESS: {
      const { users, hasMore } = action.payload;
      return {
        ...state,
        followingUpdates: {
          ...state.followingUpdates,
          usersUpdates: {
            users: [...state.followingUpdates.usersUpdates.users, ...users],
            hasMore,
          },
        },
      };
    }
    case userActions.GET_FOLLOWING_USERS_UPDATES.ERROR:
      return state;

    case userActions.GET_FOLLOWING_OBJECTS_UPDATES.SUCCESS: {
      const { related_wobjects: relatedObjects, hasMore } = action.payload;
      const { objectType } = action.meta;
      return {
        ...state,
        followingUpdates: {
          ...state.followingUpdates,
          objectsUpdates: {
            ...state.followingUpdates.objectsUpdates,
            [objectType]: {
              ...state.followingUpdates.objectsUpdates[objectType],
              related_wobjects: [
                ...state.followingUpdates.objectsUpdates[objectType].related_wobjects,
                ...relatedObjects,
              ],
              hasMore,
            },
          },
        },
      };
    }
    case userActions.GET_FOLLOWING_OBJECTS_UPDATES.ERROR:
      return state;

    case wobjActions.FOLLOW_WOBJECT_START:
    case wobjActions.UNFOLLOW_WOBJECT_START:
      return {
        ...state,
        followingObjects: {
          ...state.followingObjects,
          pendingFollows: [...state.followingObjects.pendingFollows, action.meta.authorPermlink],
        },
      };
    case wobjActions.FOLLOW_WOBJECT_SUCCESS:
      return {
        ...state,
        followingObjects: {
          ...state.followingObjects,
          list: [...state.followingObjects.list, action.meta.authorPermlink],
          pendingFollows: state.followingObjects.pendingFollows.filter(
            obj => obj !== action.meta.authorPermlink,
          ),
        },
      };
    case wobjActions.UNFOLLOW_WOBJECT_SUCCESS:
      return {
        ...state,
        followingObjects: {
          ...state.followingObjects,
          list: state.followingObjects.list.filter(obj => obj !== action.meta.authorPermlink),
          pendingFollows: state.followingObjects.pendingFollows.filter(
            obj => obj !== action.meta.authorPermlink,
          ),
        },
      };

    case wobjActions.FOLLOW_WOBJECT_ERROR:
    case wobjActions.UNFOLLOW_WOBJECT_ERROR:
      return {
        ...state,
        followingObjects: {
          ...state.followingObjects,
          pendingFollows: state.followingObjects.pendingFollows.filter(
            obj => obj !== action.meta.authorPermlink,
          ),
        },
      };

    case userActions.GET_NOTIFICATIONS.START:
      return {
        ...state,
        loadingNotifications: true,
      };

    case userActions.GET_NOTIFICATIONS.SUCCESS:
      return {
        ...state,
        notifications: action.payload,
        loadingNotifications: false,
      };

    case userActions.GET_NOTIFICATIONS.ERROR:
      return {
        ...state,
        loadingNotifications: false,
      };

    case appTypes.ADD_NEW_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        latestNotification: action.payload,
      };
    case userActions.GET_RECOMMENDED_OBJECTS_SUCCESS:
      return {
        ...state,
        recommendedObjects: filterRecommendedObjects(action.payload.wobjects),
      };

    case userActions.GET_RECOMMENDS_HASHTAGS.SUCCESS:
      return {
        ...state,
        recommendedTopics: action.payload.wobjects,
      };

    case userActions.GET_RECOMMENDS_HASHTAGS.ERROR:
      return state;

    case userActions.GET_RECOMMENDS_EXPERTS.SUCCESS:
      return {
        ...state,
        recommendedExperts: action.payload.users,
      };

    case userActions.GET_RECOMMENDS_EXPERTS.ERROR:
      return state;

    case authActions.LOGOUT:
      return initialState;

    case userActions.SET_PENDING_UPDATE.START:
      return {
        ...state,
        pendingUpdate: true,
      };
    case userActions.SET_PENDING_UPDATE.SUCCESS:
      return {
        ...state,
        pendingUpdate: false,
      };

    default: {
      return state;
    }
  }
}

export const getFollowingList = state => Object.keys(state.following.list);
export const getFollowingObjectsList = state => state.followingObjects.list;
export const getPendingFollows = state => state.following.pendingFollows;
export const getPendingFollowingObjects = state => state.followingObjects.pendingFollows;
export const getIsFetchingFollowingList = state => state.following.isFetching;
export const getRecommendedObjects = state => state.recommendedObjects;
export const getFollowingFetched = state => state.following.fetched;
export const getNotifications = state => state.notifications;
export const getIsLoadingNotifications = state => state.loadingNotifications;
export const getFetchFollowListError = state => state.fetchFollowListError;
export const getLatestNotification = state => state.latestNotification;
export const getUserLocation = state => state.location;
export const getFollowingUpdates = state => state.followingUpdates;
export const getFollowingUsersUpdates = state => state.followingUpdates.usersUpdates;
export const getFollowingObjectsUpdatesByType = (state, objType) =>
  get(state, ['followingUpdates', 'objectsUpdates', objType, 'related_wobjects'], []);
export const getFollowingUpdatesFetched = state => state.followingUpdates.fetched;
export const getPendingUpdate = state => state.pendingUpdate;

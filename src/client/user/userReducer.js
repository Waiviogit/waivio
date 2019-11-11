import _ from 'lodash';
import * as userActions from './userActions';
import * as wobjActions from '../object/wobjActions';
import * as appTypes from '../app/appActions';


const initialState = {
  recommendedObjects: [],
  location: {},
  following: {
    list: [],
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
  notifications: [],
  latestNotification: {},
  loadingNotifications: false,
  fetchFollowListError: false,
  statistics:
    {
      isForecastAccuracyChart: false
    }
};

const filterRecommendedObjects = (objects, count = 5) => {
  const ordered = _.orderBy(objects, ['weight'], ['desc']);
  return _.slice(ordered, 0, count);
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case userActions.GET_FOLLOWING_START:
      return {
        ...state,
        following: {
          ...state.following,
          list: [],
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
          list: [],
          isFetching: false,
          fetched: true,
        },
        fetchFollowListError: true,
      };
    case userActions.GET_FOLLOWING_SUCCESS:
      return {
        ...state,
        following: {
          ...state.following,
          list: action.payload,
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
    case userActions.UNFOLLOW_USER_START:
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
          list: [...state.following.list, action.meta.username],
          pendingFollows: state.following.pendingFollows.filter(
            user => user !== action.meta.username,
          ),
        },
      };
    case userActions.UNFOLLOW_USER_SUCCESS:
      return {
        ...state,
        following: {
          ...state.following,
          list: state.following.list.filter(user => user !== action.meta.username),
          pendingFollows: state.following.pendingFollows.filter(
            user => user !== action.meta.username,
          ),
        },
      };

    case userActions.FOLLOW_USER_ERROR:
    case userActions.UNFOLLOW_USER_ERROR:
      return {
        ...state,
        following: {
          ...state.following,
          pendingFollows: state.following.pendingFollows.filter(
            user => user !== action.meta.username,
          ),
        },
      };

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
    case userActions.GET_FORECAST_CHART_CONDITION:
      return {
        ...state,
        statistics: {
          ...state.statistics,
          isForecastAccuracyChart: action.payload
        }
      };
    default: {
      return state;
    }
  }
}

export const getFollowingList = state => state.following.list;
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
export const getUserForecastAccuracyChartCondition = state => state.statistics.isForecastAccuracyChart;


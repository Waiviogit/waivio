import * as store from '../reducers';
import { getAllFollowing } from '../helpers/apiHelpers';
import { createAsyncActionType } from '../helpers/stateHelpers';
import * as ApiClient from '../../waivioApi/ApiClient';
import { getUserCoordinatesByIpAdress } from '../components/Maps/mapHelper';
import { rewardPostContainerData } from '../rewards/rewardsHelper';

require('isomorphic-fetch');

// region Followings
export const FOLLOW_USER = '@user/FOLLOW_USER';
export const FOLLOW_USER_START = '@user/FOLLOW_USER_START';
export const FOLLOW_USER_SUCCESS = '@user/FOLLOW_USER_SUCCESS';
export const FOLLOW_USER_ERROR = '@user/FOLLOW_USER_ERROR';

export const followUser = username => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();

  if (!store.getIsAuthenticated(state)) {
    return Promise.reject('User is not authenticated');
  }

  return dispatch({
    type: FOLLOW_USER,
    payload: {
      promise: steemConnectAPI.follow(store.getAuthenticatedUserName(state), username),
    },
    meta: {
      username,
    },
  });
};

export const UNFOLLOW_USER = '@user/UNFOLLOW_USER';
export const UNFOLLOW_USER_START = '@user/UNFOLLOW_USER_START';
export const UNFOLLOW_USER_SUCCESS = '@user/UNFOLLOW_USER_SUCCESS';
export const UNFOLLOW_USER_ERROR = '@user/UNFOLLOW_USER_ERROR';

export const unfollowUser = username => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();

  if (!store.getIsAuthenticated(state)) {
    return Promise.reject('User is not authenticated');
  }

  return dispatch({
    type: UNFOLLOW_USER,
    payload: {
      promise: steemConnectAPI.unfollow(store.getAuthenticatedUserName(state), username),
    },
    meta: {
      username,
    },
  });
};

export const GET_FOLLOWING = '@user/GET_FOLLOWING';
export const GET_FOLLOWING_START = '@user/GET_FOLLOWING_START';
export const GET_FOLLOWING_SUCCESS = '@user/GET_FOLLOWING_SUCCESS';
export const GET_FOLLOWING_ERROR = '@user/GET_FOLLOWING_ERROR';

export const getFollowing = username => (dispatch, getState) => {
  const state = getState();

  if (!username && !store.getIsAuthenticated(state)) {
    return dispatch({ type: GET_FOLLOWING_ERROR });
  }

  const targetUsername = username || store.getAuthenticatedUserName(state);

  return dispatch({
    type: GET_FOLLOWING,
    meta: targetUsername,
    payload: {
      promise: getAllFollowing(targetUsername),
    },
  });
};

export const GET_FOLLOWING_OBJECTS = '@user/GET_FOLLOWING_OBJECTS';
export const GET_FOLLOWING_OBJECTS_START = '@user/GET_FOLLOWING_OBJECTS_START';
export const GET_FOLLOWING_OBJECTS_SUCCESS = '@user/GET_FOLLOWING_OBJECTS_SUCCESS';
export const GET_FOLLOWING_OBJECTS_ERROR = '@user/GET_FOLLOWING_OBJECTS_ERROR';

export const getFollowingObjects = username => (dispatch, getState) => {
  const state = getState();

  if (!username && !store.getIsAuthenticated(state)) {
    return dispatch({ type: GET_FOLLOWING_ERROR });
  }

  const targetUsername = username || store.getAuthenticatedUserName(state);
  return dispatch({
    type: GET_FOLLOWING_OBJECTS,
    payload: {
      promise: ApiClient.getAllFollowingObjects(targetUsername),
    },
  });
};

export const GET_FOLLOWING_UPDATES = createAsyncActionType('@user/GET_FOLLOWING_UPDATES');
export const getFollowingUpdates = (count = 5) => (dispatch, getState) => {
  const state = getState();
  const isUpdatesFetched = store.getFollowingUpdatesFetched(state);
  const userName = store.getAuthenticatedUserName(state);
  if (!isUpdatesFetched && userName) {
    dispatch({
      type: GET_FOLLOWING_UPDATES.ACTION,
      payload: {
        promise: ApiClient.getFollowingUpdates(userName, count),
      },
    });
  }
};

export const GET_FOLLOWING_OBJECTS_UPDATES = createAsyncActionType(
  '@user/GET_FOLLOWING_OBJECTS_UPDATES',
);
export const getFollowingObjectsUpdatesMore = (objectType, count = 5) => (dispatch, getState) => {
  const state = getState();
  const followingObjects = store.getFollowingObjectsUpdatesByType(state, objectType);
  const userName = store.getAuthenticatedUserName(state);

  dispatch({
    type: GET_FOLLOWING_OBJECTS_UPDATES.ACTION,
    payload: {
      promise: ApiClient.getFollowingObjectsUpdates(
        userName,
        objectType,
        count,
        followingObjects.length,
      ),
    },
    meta: {
      objectType,
    },
  });
};

export const GET_FOLLOWING_USERS_UPDATES = createAsyncActionType(
  '@user/GET_FOLLOWING_USERS_UPDATES',
);
export const getFollowingUsersUpdatesMore = (count = 5) => (dispatch, getState) => {
  const state = getState();
  const followingUsers = store.getFollowingUsersUpdates(state);
  const userName = store.getAuthenticatedUserName(state);

  dispatch({
    type: GET_FOLLOWING_USERS_UPDATES.ACTION,
    payload: {
      promise: ApiClient.getFollowingUsersUpdates(userName, count, followingUsers.users.length),
    },
  });
};

// endregion

export const GET_RECOMMENDED_OBJECTS = '@user/GET_RECOMMENDED_OBJECTS';
export const GET_RECOMMENDED_OBJECTS_START = '@user/GET_RECOMMENDED_OBJECTS_START';
export const GET_RECOMMENDED_OBJECTS_SUCCESS = '@user/GET_RECOMMENDED_OBJECTS_SUCCESS';
export const GET_RECOMMENDED_OBJECTS_ERROR = '@user/GET_RECOMMENDED_OBJECTS_ERROR';

export const getRecommendedObj = () => dispatch =>
  dispatch({
    type: GET_RECOMMENDED_OBJECTS,
    payload: {
      promise: ApiClient.getRecommendedObjects(),
    },
  });

export const GET_NOTIFICATIONS = createAsyncActionType('@user/GET_NOTIFICATIONS');

export const getNotifications = username => (dispatch, getState, { busyAPI }) => {
  const state = getState();

  if (!username && !store.getIsAuthenticated(state)) {
    return dispatch({ type: GET_NOTIFICATIONS.ERROR });
  }

  const targetUsername = username || store.getAuthenticatedUserName(state);

  return dispatch({
    type: GET_NOTIFICATIONS.ACTION,
    meta: targetUsername,
    payload: {
      promise: busyAPI.sendAsync('get_notifications', [targetUsername]),
    },
  });
};

export const GET_USER_LOCATION = createAsyncActionType('@user/GET_USER_LOCATION');

export const getCoordinates = () => dispatch =>
  dispatch({
    type: GET_USER_LOCATION.ACTION,
    payload: getUserCoordinatesByIpAdress(),
  });

// region Campaigns
export const assignProposition = ({ companyAuthor, companyPermlink, resPermlink, objPermlink }) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const username = store.getAuthenticatedUserName(getState());
  const commentOp = [
    'comment',
    {
      parent_author: companyAuthor,
      parent_permlink: companyPermlink,
      author: username,
      permlink: resPermlink,
      title: 'reserve object for rewards',
      body: `User @${username} reserve [object](https://www.waivio.com/object/${objPermlink}), from [campaign](https://www.waivio.com/@${companyAuthor}/${companyPermlink})`,
      json_metadata: JSON.stringify({
        waivioRewards: { type: 'waivio_assign_campaign', approved_object: objPermlink },
      }),
    },
  ];

  return new Promise((resolve, reject) => {
    steemConnectAPI
      .broadcast([commentOp])
      .then(() => resolve('SUCCESS'))
      .catch(error => reject(error));
  });
};

export const declineProposition = ({
  companyAuthor,
  companyPermlink,
  objPermlink,
  unreservationPermlink,
  reservationPermlink,
}) => (dispatch, getState, { steemConnectAPI }) => {
  const username = store.getAuthenticatedUserName(getState());
  const commentOp = [
    'comment',
    {
      parent_author: companyAuthor,
      parent_permlink: companyPermlink,
      author: username,
      permlink: unreservationPermlink,
      title: 'reject object for rewards',
      body: `User @${username} reject [object](https://www.waivio.com/object/${objPermlink}), from [campaign](https://www.waivio.com/@${companyAuthor}/${companyPermlink})`,
      json_metadata: JSON.stringify({
        waivioRewards: {
          type: 'waivio_reject_object_campaign',
          reservation_permlink: reservationPermlink,
        },
      }),
    },
  ];
  return new Promise((resolve, reject) => {
    steemConnectAPI
      .broadcast([commentOp])
      .then(() => resolve('SUCCESS'))
      .catch(error => reject(error));
  });
};
export const activateCampaign = (company, campaignPermlink) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const username = store.getAuthenticatedUserName(getState());
  const commentOp = [
    'comment',
    {
      parent_author: rewardPostContainerData.author,
      parent_permlink: rewardPostContainerData.permlink,
      author: username,
      permlink: campaignPermlink,
      title: 'activate object for rewards',
      body: `Campaign ${company.name} was activated by ${username} `,
      json_metadata: JSON.stringify({
        // eslint-disable-next-line no-underscore-dangle
        waivioRewards: { type: 'waivio_activate_campaign', campaign_id: company._id },
      }),
    },
  ];

  return new Promise((resolve, reject) => {
    steemConnectAPI
      .broadcast([commentOp])
      .then(() => resolve('SUCCESS'))
      .catch(error => reject({ ...error }));
  });
};

export const inactivateCampaign = (company, inactivatePermlink) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const username = store.getAuthenticatedUserName(getState());
  const commentOp = [
    'comment',
    {
      parent_author: username,
      parent_permlink: company.activation_permlink,
      author: username,
      permlink: inactivatePermlink,
      title: 'unactivate object for rewards',
      body: `Campaign ${company.name} was inactivated by ${username} `,
      json_metadata: JSON.stringify({
        // eslint-disable-next-line no-underscore-dangle
        waivioRewards: { type: 'waivio_stop_campaign', campaign_id: company._id },
      }),
    },
  ];

  return new Promise((resolve, reject) => {
    steemConnectAPI
      .broadcast([commentOp])
      .then(() => resolve('SUCCESS'))
      .catch(error => reject(error));
  });
};
// endregion

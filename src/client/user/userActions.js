import { getAuthenticatedUserName, getIsAuthenticated, isGuestUser } from '../reducers';
import { createAsyncActionType } from '../helpers/stateHelpers';
import * as ApiClient from '../../waivioApi/ApiClient';
import { rewardPostContainerData } from '../rewards/rewardsHelper';

require('isomorphic-fetch');

export const FOLLOW_USER = '@user/FOLLOW_USER';
export const FOLLOW_USER_START = '@user/FOLLOW_USER_START';
export const FOLLOW_USER_SUCCESS = '@user/FOLLOW_USER_SUCCESS';
export const FOLLOW_USER_ERROR = '@user/FOLLOW_USER_ERROR';

export const followUser = username => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();

  if (!getIsAuthenticated(state)) {
    return Promise.reject('User is not authenticated');
  }

  return dispatch({
    type: FOLLOW_USER,
    payload: {
      promise: steemConnectAPI.follow(getAuthenticatedUserName(state), username),
    },
    meta: {
      username,
    },
  });
};

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

export const CHANGE_CHAT_CONDITION = '@user/CHANGE_CHAT_CONDITION';
export const changeChatCondition = () => dispatch =>
  dispatch({
    type: CHANGE_CHAT_CONDITION,
  });

export const UNFOLLOW_USER = createAsyncActionType('@user/UNFOLLOW_USER');

export const unfollowUser = username => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();

  if (!getIsAuthenticated(state)) {
    return Promise.reject('User is not authenticated');
  }

  return dispatch({
    type: UNFOLLOW_USER.ACTION,
    payload: {
      promise: steemConnectAPI.unfollow(getAuthenticatedUserName(state), username),
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

export const getFollowing = (username, skip, limit) => (dispatch, getState) => {
  const state = getState();

  if (!username && !getIsAuthenticated(state)) {
    return dispatch({ type: GET_FOLLOWING_ERROR });
  }

  const targetUsername = username || getAuthenticatedUserName(state);

  return dispatch({
    type: GET_FOLLOWING,
    meta: targetUsername,
    payload: {
      promise: ApiClient.getFollowingsFromAPI(targetUsername, skip, limit).then(data => data.users),
    },
  });
};

export const GET_FOLLOWING_OBJECTS = '@user/GET_FOLLOWING_OBJECTS';
export const GET_FOLLOWING_OBJECTS_START = '@user/GET_FOLLOWING_OBJECTS_START';
export const GET_FOLLOWING_OBJECTS_SUCCESS = '@user/GET_FOLLOWING_OBJECTS_SUCCESS';
export const GET_FOLLOWING_OBJECTS_ERROR = '@user/GET_FOLLOWING_OBJECTS_ERROR';

export const getFollowingObjects = username => (dispatch, getState) => {
  const state = getState();
  const skip = 0;
  const limit = state.auth.user.objects_following_count;

  if (!username && !getIsAuthenticated(state)) {
    return dispatch({ type: GET_FOLLOWING_ERROR });
  }

  const targetUsername = username || getAuthenticatedUserName(state);
  return dispatch({
    type: GET_FOLLOWING_OBJECTS,
    payload: {
      promise: ApiClient.getAllFollowingObjects(targetUsername, skip, limit),
    },
  });
};

export const GET_NOTIFICATIONS = createAsyncActionType('@user/GET_NOTIFICATIONS');

export const getNotifications = username => (dispatch, getState, { busyAPI }) => {
  const state = getState();

  if (!username && !getIsAuthenticated(state)) {
    return dispatch({ type: GET_NOTIFICATIONS.ERROR });
  }

  if ((!username && !getIsAuthenticated(state)) || isGuestUser(state)) {
    return dispatch({ type: GET_NOTIFICATIONS.ERROR });
  }

  const targetUsername = username || getAuthenticatedUserName(state);

  return dispatch({
    type: GET_NOTIFICATIONS.ACTION,
    meta: targetUsername,
    payload: {
      promise: busyAPI.sendAsync('get_notifications', [targetUsername]),
    },
  });
};

export const assignProposition = ({ companyAuthor, companyPermlink, resPermlink, objPermlink }) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const username = getAuthenticatedUserName(getState());
  const commentOp = [
    'comment',
    {
      parent_author: companyAuthor,
      parent_permlink: companyPermlink,
      author: username,
      permlink: resPermlink,
      title: 'reserve topic for rewards',
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
  const username = getAuthenticatedUserName(getState());
  const commentOp = [
    'comment',
    {
      parent_author: companyAuthor,
      parent_permlink: companyPermlink,
      author: username,
      permlink: unreservationPermlink,
      title: 'reject topic for rewards',
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
  const username = getAuthenticatedUserName(getState());
  const commentOp = [
    'comment',
    {
      parent_author: rewardPostContainerData.author,
      parent_permlink: rewardPostContainerData.permlink,
      author: username,
      permlink: campaignPermlink,
      title: 'activate topic for rewards',
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
      .catch(error => reject(error));
  });
};

export const inactivateCampaign = (company, inactivatePermlink) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const username = getAuthenticatedUserName(getState());
  const commentOp = [
    'comment',
    {
      parent_author: username,
      parent_permlink: company.activation_permlink,
      author: username,
      permlink: inactivatePermlink,
      title: 'unactivate topic for rewards',
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

export const SET_ACCURACY_CHART_LOADED = '@user/SET_ACCURACY_CHART_CONDITION';

export const setAccuracyChartLoaded = () => dispatch =>
  dispatch({
    type: SET_ACCURACY_CHART_LOADED,
    payload: true,
  });

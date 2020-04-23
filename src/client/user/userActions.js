import moment from 'moment';
import * as store from '../reducers';
import { createAsyncActionType } from '../helpers/stateHelpers';
import * as ApiClient from '../../waivioApi/ApiClient';
import { getUserCoordinatesByIpAdress } from '../components/Maps/mapHelper';
import { rewardPostContainerData, getDetailsBody } from '../rewards/rewardsHelper';
import { getFieldWithMaxWeight } from '../object/wObjectHelper';
import { newUserRecommendExperts, newUserRecommendTopics } from '../../common/constants/waivio';
import { getAuthenticatedUserName } from '../reducers';

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

export const UNFOLLOW_USER = createAsyncActionType('@user/UNFOLLOW_USER');

export const unfollowUser = username => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();

  if (!store.getIsAuthenticated(state)) {
    return Promise.reject('User is not authenticated');
  }

  return dispatch({
    type: UNFOLLOW_USER.ACTION,
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

export const getFollowing = (username, skip, limit) => (dispatch, getState) => {
  const state = getState();
  const user = getAuthenticatedUserName(state);

  if (!username && !store.getIsAuthenticated(state)) {
    return dispatch({ type: GET_FOLLOWING_ERROR });
  }

  const targetUsername = username || store.getAuthenticatedUserName(state);

  return dispatch({
    type: GET_FOLLOWING,
    meta: targetUsername,
    payload: {
      promise: ApiClient.getFollowingsFromAPI(targetUsername, skip, limit, user).then(
        data => data.users,
      ),
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
  const authUserName = getAuthenticatedUserName(state);

  if (!username && !store.getIsAuthenticated(state)) {
    return dispatch({ type: GET_FOLLOWING_ERROR });
  }

  const targetUsername = username || store.getAuthenticatedUserName(state);
  return dispatch({
    type: GET_FOLLOWING_OBJECTS,
    payload: {
      promise: ApiClient.getAllFollowingObjects(targetUsername, skip, limit, authUserName),
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
export const SET_PENDING_UPDATE = createAsyncActionType('@user/SET_PANDING_UPDATE');

export const assignProposition = ({
  companyAuthor,
  companyPermlink,
  resPermlink,
  objPermlink,
  appName,
  primaryObjectName,
  secondaryObjectName,
  amount,
  proposition,
  proposedWobj,
}) => (dispatch, getState, { steemConnectAPI }) => {
  const username = store.getAuthenticatedUserName(getState());
  const proposedWobjName = proposedWobj.name;
  const proposedWobjAuthorPermlink = proposedWobj.author_permlink;
  const detailsBody = getDetailsBody(
    proposition,
    proposedWobjName,
    proposedWobjAuthorPermlink,
    primaryObjectName,
  );
  const commentOp = [
    'comment',
    {
      parent_author: companyAuthor,
      parent_permlink: companyPermlink,
      author: username,
      permlink: resPermlink,
      primaryObjectName,
      secondaryObjectName,
      amount,
      proposition,
      proposedWobj,
      title: 'Rewards reservations',
      body: `<p>User ${username} (@${username}) has reserved the rewards of ${amount} HIVE for a period of ${proposition.count_reservation_days} days to write a review of <a href="/object/${proposedWobj.id}">${secondaryObjectName}</a>, ${primaryObjectName}</p>${detailsBody}`,
      json_metadata: JSON.stringify({
        waivioRewards: {
          type: 'waivio_assign_campaign',
          approved_object: objPermlink,
          app: appName,
        },
      }),
    },
  ];
  return new Promise((resolve, reject) => {
    steemConnectAPI
      .broadcast([commentOp])
      .then(() => resolve('SUCCESS'))
      .then(() =>
        dispatch({
          type: SET_PENDING_UPDATE.START,
        }),
      )
      .catch(error => reject(error));
  });
};

export const pendingUpdateSuccess = () => dispatch =>
  dispatch({
    type: SET_PENDING_UPDATE.SUCCESS,
  });

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
      .then(() =>
        dispatch({
          type: SET_PENDING_UPDATE.START,
        }),
      )
      .catch(error => reject(error));
  });
};
export const activateCampaign = (company, campaignPermlink) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const username = store.getAuthenticatedUserName(getState());
  const proposedWobjName = getFieldWithMaxWeight(company.objects[0], 'name');
  const proposedAuthorPermlink = company.objects[0].author_permlink;
  const primaryObjectName = getFieldWithMaxWeight(company.requiredObject, 'name');
  const processingFees = company.commissionAgreement * 100;
  const expiryDate = moment(company.expired_at).format('YYYY-MM-DD');
  const detailsBody = getDetailsBody(
    company,
    proposedWobjName,
    proposedAuthorPermlink,
    primaryObjectName,
  );
  const commentOp = [
    'comment',
    {
      parent_author: rewardPostContainerData.author,
      parent_permlink: rewardPostContainerData.permlink,
      author: username,
      permlink: campaignPermlink,
      company,
      title: 'Activate rewards campaign',
      body: `${username} (@${username}) activated rewards campaign for <a href="/object/${company.requiredObject.author_permlink}">${primaryObjectName}</a> (${company.requiredObject.object_type}) ${detailsBody} Campaign expiry date: ${expiryDate}. Processing fees: ${processingFees}% of the total amount of rewards (Campaign server @waivio.campaigns offers 50% commissions to index services for reservations). `,
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

export const GET_RECOMMENDS_HASHTAGS = createAsyncActionType('@user/GET_RECOMMENDS_HASHTAGS');
export const GET_RECOMMENDS_EXPERTS = createAsyncActionType('@user/GET_RECOMMENDS_EXPERTS');

export const getRecommendTopics = () => dispatch => {
  const topicList = Object.values(newUserRecommendTopics).reduce(
    (arr, acc) => [...acc, ...arr],
    [],
  );
  dispatch({
    type: GET_RECOMMENDS_HASHTAGS.ACTION,
    payload: {
      promise: ApiClient.getRecommendTopic(topicList.length, 'en-US', 0, topicList),
    },
  });
};

export const getRecommendExperts = () => dispatch => {
  const userList = Object.values(newUserRecommendExperts).reduce(
    (arr, acc) => [...acc, ...arr],
    [],
  );
  dispatch({
    type: GET_RECOMMENDS_EXPERTS.ACTION,
    payload: {
      promise: ApiClient.getUsers({ listUsers: userList, limit: userList.length }),
    },
  });
};
// endregion

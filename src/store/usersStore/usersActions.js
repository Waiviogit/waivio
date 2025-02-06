import { message } from 'antd';
import { isEmpty, isNil } from 'lodash';
import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import * as ApiClient from '../../waivioApi/ApiClient';
import { getUser } from './usersSelectors';
import { LIKE_POST } from '../postsStore/postActions';
import { subscribeMethod, subscribeTypes } from '../../common/constants/blockTypes';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
  isGuestUser,
} from '../authStore/authSelectors';
import { calculateMana, dHive, getLastBlockNum } from '../../client/vendor/steemitHelpers';
import { guestUserRegex } from '../../common/helpers/regexHelpers';

export const GET_INFO_FOR_SIDEBAR = createAsyncActionType('@users/GET_INFO_FOR_SIDEBAR');

export const getInfoForSideBar = (username, lastActiv) => async dispatch => {
  dispatch({
    type: GET_INFO_FOR_SIDEBAR.START,
    meta: { username },
  });
  try {
    let lastActivity = lastActiv;
    const [acc] = await dHive.database.getAccounts([username]);
    const rc = await dHive.rc.getRCMana(username, acc);
    const voting_mana = await dHive.rc.calculateVPMana(acc);
    const waivVotingMana = await ApiClient.getWaivVoteMana(username, acc);
    const userVoteValue = await ApiClient.getUserVoteValueInfo(username, acc);
    const waivPowerMana = waivVotingMana ? calculateMana(waivVotingMana) : null;

    if (isEmpty(lastActiv) || isNil(lastActiv)) {
      lastActivity = await ApiClient.getUserLastActivity(username, acc);
    }

    const data = {
      balance: acc?.balance,
      hbd_balance: acc?.hbd_balance,
      savings_balance: acc?.savings_balance,
      vesting_shares: acc?.vesting_shares,
      savings_hbd_balance: acc?.savings_hbd_balance,
      savings_hbd_seconds: acc?.savings_hbd_seconds,
      savings_hbd_seconds_last_update: acc?.savings_hbd_seconds_last_update,
      received_vesting_shares: acc?.received_vesting_shares,
      delegated_vesting_shares: acc?.delegated_vesting_shares,
      downvote_manabar: acc?.downvote_manabar,
      voting_manabar: voting_mana,
      posting_json_metadata: acc.posting_json_metadata,
      vesting_withdraw_rate: acc.vesting_withdraw_rate,
      to_withdraw: acc.to_withdraw,
      withdrawn: acc.withdrawn,
      next_vesting_withdrawal: acc.next_vesting_withdrawal,
    };

    data.rc_percentage = rc.percentage * 0.01 || 0;
    data.voting_mana = voting_mana.max_mana ? voting_mana.percentage * 0.01 || 0 : 100;
    data.waivVotingPower = waivPowerMana?.votingPower ? waivPowerMana.votingPower : 100;
    data.waivDownvotingPower = waivVotingMana ? waivPowerMana.downvotingPower : 100;
    data.waivVotingPowerPrice = userVoteValue.estimatedWAIV;
    data.hiveVotingPowerPrice = userVoteValue.estimatedHIVE;
    data.last_activity = lastActivity || acc.created || acc.createdAt;
    data.totalVotingPowerPrice = userVoteValue.estimatedHIVE + userVoteValue.estimatedWAIV;

    return dispatch({
      type: GET_INFO_FOR_SIDEBAR.SUCCESS,
      payload: data,
      meta: { username },
    });
  } catch (e) {
    return dispatch({
      type: GET_INFO_FOR_SIDEBAR.ERROR,
      payload: {},
      meta: { username },
    });
  }
};

export const SET_GUEST_MANA = '@users/SET_GUEST_MANA';
export const setGuestMana = name => async dispatch => {
  const guestManaRes = await ApiClient.getGuestUserMana(name);

  return dispatch({
    type: SET_GUEST_MANA,
    payload: guestManaRes.result,
    meta: { username: name },
  });
};

export const GET_ACCOUNT = createAsyncActionType('@users/GET_ACCOUNT');

export const getUserAccount = name => async (dispatch, getState) => {
  const state = getState();
  const authUser = getAuthenticatedUserName(state);
  const isGuest = guestUserRegex.test(name);
  const guestManaRes = isGuest ? await ApiClient.getGuestUserMana(name) : {};
  const guestMana = isGuest ? { guestMana: guestManaRes.result } : {};

  return dispatch({
    type: GET_ACCOUNT.ACTION,
    payload: ApiClient.getUserAccount(name, false, authUser).then(res => ({
      ...res,
      ...guestMana,
    })),
    meta: { username: name },
  });
};

export const GET_RANDOM_EXPERTS = '@users/GET_RANDOM_EXPERTS';
export const GET_RANDOM_EXPERTS_START = '@users/GET_RANDOM_EXPERTS_START';
export const GET_RANDOM_EXPERTS_SUCCESS = '@users/GET_RANDOM_EXPERTS_SUCCESS';
export const GET_RANDOM_EXPERTS_ERROR = '@users/GET_RANDOM_EXPERTS_ERROR';

export const getRandomExperts = () => (dispatch, getState) => {
  const user = getAuthenticatedUserName(getState());

  dispatch({
    type: GET_RANDOM_EXPERTS,
    payload: ApiClient.getTopUsers(user, { isRandom: true }),
  });
};

export const GET_TOP_EXPERTS = '@users/GET_TOP_EXPERTS';
export const GET_TOP_EXPERTS_START = '@users/GET_TOP_EXPERTS_START';
export const GET_TOP_EXPERTS_SUCCESS = '@users/GET_TOP_EXPERTS_SUCCESS';
export const GET_TOP_EXPERTS_ERROR = '@users/GET_TOP_EXPERTS_ERROR';

export const getTopExperts = (limit = 20, skip = 0) => (dispatch, getState) => {
  const user = getAuthenticatedUserName(getState());

  dispatch({
    type: GET_TOP_EXPERTS,
    payload: ApiClient.getTopUsers(user, { limit, skip }),
    meta: { limit },
  });
};

export const GET_USER_METADATA = createAsyncActionType('@users/GET_USER_METADATA');

export const getUserMetadata = () => (dispatch, getState) => {
  const state = getState();
  const userName = getAuthenticatedUserName(state);

  if (userName) {
    return dispatch({
      type: GET_USER_METADATA.ACTION,
      payload: ApiClient.getAuthenticatedUserMetadata(userName),
    });
  }

  return dispatch({ type: GET_USER_METADATA.ERROR, payload: Promise.resolve(null) });
};

export const UNFOLLOW_USER = createAsyncActionType('@users/UNFOLLOW_USER');

export const unfollowUser = (username, top = false) => (
  dispatch,
  getState,
  { steemConnectAPI, busyAPI },
) => {
  const state = getState();

  if (!getIsAuthenticated(state)) {
    return Promise.reject('User is not authenticated');
  }
  const isGuest = isGuestUser(state);
  const authUser = getAuthenticatedUserName(state);

  return dispatch({
    type: UNFOLLOW_USER.ACTION,
    payload: {
      promise: steemConnectAPI
        .unfollow(authUser, username)
        .then(async data => {
          if (isGuest && !data.ok) {
            const guestMana = await dispatch(setGuestMana(authUser));

            if (guestMana.payload < 0.1) {
              message.error('Guest mana is too low. Please wait for recovery.');
            }
          }
          const res = isGuest ? await data.json() : data.result;
          const blockNumber = await getLastBlockNum();

          if (!blockNumber) throw new Error('Something went wrong');

          busyAPI.instance.sendAsync(subscribeMethod, [
            authUser,
            blockNumber,
            subscribeTypes.posts,
          ]);
          busyAPI.instance.subscribeBlock(subscribeTypes.posts, blockNumber);

          return res;
        })
        .catch(() => {
          message.error('Something went wrong');
          dispatch({
            type: LIKE_POST.ERROR,
          });
        }),
    },
    meta: {
      username,
      top,
    },
  });
};
export const FOLLOW_USER = createAsyncActionType('@user/FOLLOW_USER');

export const followUser = (username, top = false) => (
  dispatch,
  getState,
  { steemConnectAPI, busyAPI },
) => {
  const state = getState();
  const isGuest = isGuestUser(state);
  const authUser = getAuthenticatedUserName(state);

  if (!getIsAuthenticated(state)) {
    return Promise.reject('User is not authenticated');
  }

  return dispatch({
    type: FOLLOW_USER.ACTION,
    payload: {
      promise: steemConnectAPI
        .follow(authUser, username)
        .then(async data => {
          if (isGuest && !data.ok) {
            const guestMana = await dispatch(setGuestMana(authUser));

            if (guestMana.payload < 0.1) {
              message.error('Guest mana is too low. Please wait for recovery.');
            }
          }
          const res = isGuest ? await data.json() : data.result;
          const blockNumber = await getLastBlockNum();

          if (!blockNumber) throw new Error('Something went wrong');

          busyAPI.instance.sendAsync(subscribeMethod, [
            authUser,
            blockNumber,
            subscribeTypes.posts,
          ]);
          busyAPI.instance.subscribeBlock(subscribeTypes.posts, blockNumber);

          return res;
        })
        .catch(() => {
          message.error('Something went wrong');
          dispatch({
            type: LIKE_POST.ERROR,
          });
        }),
    },
    meta: {
      username,
      top,
    },
  });
};

export const GET_USER_PRIVATE_EMAIL = createAsyncActionType('@user/GET_USER_PRIVATE_EMAIL');

export const getUserPrivateEmail = () => (dispatch, getState) => {
  const state = getState();
  const userName = getAuthenticatedUserName(state);

  if (userName) {
    return dispatch({
      type: GET_USER_PRIVATE_EMAIL.ACTION,
      payload: ApiClient.getPrivateEmail(userName),
    });
  }

  return dispatch({ type: GET_USER_PRIVATE_EMAIL.ERROR, payload: Promise.resolve(null) });
};

export const CHANGE_COUNTER = '@users/CHANGE_COUNTER';

export const changeCounterFollow = (username, type, follow = false) => (dispatch, getState) => {
  const state = getState();
  const user = getUser(state, username);
  const authUserName = getAuthenticatedUserName(state);

  if (authUserName !== username) return null;

  const key = type === 'user' ? 'users_following_count' : 'objects_following_count';
  const counter = follow ? user[key] + 1 : user[key] - 1;

  return dispatch({
    type: CHANGE_COUNTER,
    payload: {
      counter,
      username,
      key,
    },
  });
};

export const RESET_USERS = '@users/RESET_USERS';

export const resetUsers = () => ({
  type: RESET_USERS,
});

export const UPDATE_USER_METADATA = '@auth/UPDATE_USER_METADATA';

export const updateUserMetadata = metadata => dispatch =>
  dispatch({
    type: UPDATE_USER_METADATA,
    payload: metadata,
  });

export const MUTE_CURRENT_USER = createAsyncActionType('@auth/MUTE_CURRENT_USER');

export const muteUserBlog = user => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();
  const userName = getAuthenticatedUserName(state);
  const action = user.muted ? [] : ['ignore'];

  return dispatch({
    type: MUTE_CURRENT_USER.ACTION,
    payload: {
      promise: steemConnectAPI.muteUser(userName, user.name, action),
    },
    meta: {
      muted: user.name,
      userName,
    },
  });
};

import { get, isEmpty } from 'lodash';
import { message } from 'antd';
import * as ApiClient from '../../waivioApi/ApiClient';
import { createAsyncActionType } from '../../client/helpers/stateHelpers';
import { subscribeMethod, subscribeTypes } from '../../common/constants/blockTypes';

export const GET_USER_REFERRAL_INFO = createAsyncActionType('@referral/GET_USER_REFERRAL_INFO');
export const GET_USER_REFERRAL_DETAILS = createAsyncActionType(
  '@referral/GET_USER_REFERRAL_DETAILS',
);
export const GET_IS_USER_IN_BLACKLIST = createAsyncActionType('@referral/GET_IS_USER_IN_BLACKLIST');
export const REFERRAL_CONFIRM_RULES = createAsyncActionType('@referral/REFERRAL_CONFIRM_RULES');
export const REFERRAL_GET_ADDITION_FIELDS = createAsyncActionType(
  '@referral/REFERRAL_GET_ADDITION_FIELDS',
);
export const REFERRAL_REJECT_RULES = createAsyncActionType('@referral/REFERRAL_REJECT_RULES');
export const HANDLE_REF_AUTH_USER = createAsyncActionType('@referral/HANDLE_REF_AUTH_USER');
export const GET_USER_STATUS_CARDS = createAsyncActionType('@referral/GET_USER_STATUS_CARDS');
export const GET_MORE_USER_STATUS_CARDS = createAsyncActionType(
  '@referral/GET_MORE_USER_STATUS_CARDS',
);
export const GET_ERROR_MORE_USER_STATUS_CARDS = createAsyncActionType(
  '@referral/GET_ERROR_MORE_USER_STATUS_CARDS',
);
export const GET_STATUS_SPONSORED_REWARDS = createAsyncActionType(
  '@referral/GET_STATUS_SPONSORED_REWARDS',
);

export const getUserReferralInfo = username => ({
  type: GET_USER_REFERRAL_INFO.ACTION,
  payload: ApiClient.getUserAccount(username).then(res => ({
    referralStatus: res.referralStatus,
    referralList: res.referral,
  })),
});

export const getUserReferralDetails = () => ({
  type: GET_USER_REFERRAL_DETAILS.ACTION,
  payload: ApiClient.getReferralDetails(),
});

export const getIsUserInBlackList = username => ({
  type: GET_IS_USER_IN_BLACKLIST.ACTION,
  payload: ApiClient.getUserIsBlackListed(username),
});

export const getChangeOnConfirmReferral = (username, isGuestName, blockNum) => (
  dispatch,
  getState,
  { busyAPI },
) => {
  busyAPI.instance.sendAsync(subscribeMethod, [username, blockNum, subscribeTypes.posts]);
  busyAPI.instance.subscribe((response, mess) => {
    if (subscribeTypes.posts === mess.type && mess.notification.blockParsed === blockNum) {
      dispatch({
        type: REFERRAL_GET_ADDITION_FIELDS.ACTION,
        payload: {
          promise: ApiClient.getUserAccount(username)
            .then(res => {
              dispatch({
                type: REFERRAL_CONFIRM_RULES.SUCCESS,
              });

              return {
                referralStatus: res.referralStatus,
                referralList: res.referral,
              };
            })
            .catch(error => error),
        },
      });
    }
  });
};

export const referralConfirmRules = (username, isGuest) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  dispatch({
    type: REFERRAL_CONFIRM_RULES.START,
  });
  steemConnectAPI
    .referralConfirmRules(username, isGuest)
    .then(async res => {
      if (!res.message) {
        const data = isGuest ? await res.json() : await res.result;

        return dispatch(getChangeOnConfirmReferral(username, isGuest, get(data, 'block_num')));
      }

      return dispatch({
        type: REFERRAL_CONFIRM_RULES.ERROR,
      });
    })
    .catch(err => {
      message.error(err.message);

      return dispatch({
        type: REFERRAL_CONFIRM_RULES.ERROR,
      });
    });
};

export const getChangeOnRejectReferral = (username, isGuestName, blockNum) => (
  dispatch,
  getState,
  { busyAPI },
) => {
  busyAPI.instance.sendAsync(subscribeMethod, [username, blockNum, subscribeTypes.posts]);
  busyAPI.instance.subscribe((response, mess) => {
    if (subscribeTypes.posts === mess.type && mess.notification.blockParsed === blockNum) {
      dispatch({
        type: REFERRAL_GET_ADDITION_FIELDS.ACTION,
        payload: {
          promise: ApiClient.getUserAccount(username)
            .then(res => {
              dispatch({
                type: REFERRAL_REJECT_RULES.SUCCESS,
              });

              return {
                referralStatus: res.referralStatus,
                referralList: res.referral,
              };
            })
            .catch(error => error),
        },
      });
    }
  });
};

export const referralRejectRules = (username, isGuest) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  dispatch({
    type: REFERRAL_REJECT_RULES.START,
  });
  steemConnectAPI
    .referralRejectRules(username, isGuest)
    .then(async res => {
      if (!res.message) {
        const data = isGuest ? await res.json() : await res.result;

        return dispatch(getChangeOnRejectReferral(username, isGuest, get(data, 'block_num')));
      }

      return dispatch({
        type: REFERRAL_REJECT_RULES.ERROR,
      });
    })
    .catch(err => {
      message.error(err.message);

      return dispatch({
        type: REFERRAL_REJECT_RULES.ERROR,
      });
    });
};

export const handleRefAuthUser = (username, refUser, isGuest) => (
  dispatch,
  getState,
  { steemConnectAPI },
) =>
  ApiClient.getUserAccount(username)
    .then(res => {
      if (isEmpty(res.referral)) {
        dispatch({
          type: HANDLE_REF_AUTH_USER.ACTION,
          payload: {
            promise: steemConnectAPI
              .addReferralAgent(username, refUser, isGuest)
              .then(result => result)
              .catch(error => error),
          },
        });
      }
    })
    .catch(error => error);

export const getUserStatusCards = (username, sort, skip, limit) => ({
  type: GET_USER_STATUS_CARDS.ACTION,
  payload: {
    promise: ApiClient.getUserStatusCards(username, sort, skip, limit)
      .then(data => ({
        hasMore: data.hasMore,
        userCards: data.users,
      }))
      .catch(error => error),
  },
});

export const getMoreUserStatusCards = (username, sort, skip, limit) => ({
  type: GET_MORE_USER_STATUS_CARDS.ACTION,
  payload: {
    promise: ApiClient.getUserStatusCards(username, sort, skip, limit)
      .then(data => ({
        hasMore: data.hasMore,
        userCards: data.users,
      }))
      .catch(() => ({
        type: GET_ERROR_MORE_USER_STATUS_CARDS,
      })),
  },
});

export const getStatusSponsoredRewards = (referral, username) => ({
  type: GET_STATUS_SPONSORED_REWARDS.ACTION,
  payload: {
    promise: ApiClient.getStatusSponsoredRewards(referral, username)
      .then(data => data)
      .catch(error => error),
  },
});

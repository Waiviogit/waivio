import { get } from 'lodash';
import { message } from 'antd';
import * as ApiClient from '../../../waivioApi/ApiClient';
import { createAsyncActionType } from '../../helpers/stateHelpers';
import { subscribeMethod, subscribeTypes } from '../../../common/constants/blockTypes';

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

export const getUserReferralInfo = username => dispatch => {
  dispatch({
    type: GET_USER_REFERRAL_INFO.ACTION,
    payload: ApiClient.getUserAccount(username),
  });
};

export const getUserReferralDetails = () => dispatch =>
  dispatch({
    type: GET_USER_REFERRAL_DETAILS.ACTION,
    payload: ApiClient.getReferralDetails(),
  });

export const getIsUserInBlackList = username => dispatch =>
  dispatch({
    type: GET_IS_USER_IN_BLACKLIST.ACTION,
    payload: ApiClient.getUserIsBlackListed(username),
  });

export const getChangeOnConfirmReferral = (username, isGuestName, blockNum) => (
  dispatch,
  getState,
  { busyAPI },
) => {
  busyAPI.sendAsync(subscribeMethod, [username, blockNum, subscribeTypes.posts]);
  busyAPI.subscribe((response, mess) => {
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
        const data = await res;
        return dispatch(
          getChangeOnConfirmReferral(username, isGuest, get(data, 'result.block_num')),
        );
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
  busyAPI.sendAsync(subscribeMethod, [username, blockNum, subscribeTypes.posts]);
  busyAPI.subscribe((response, mess) => {
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
        const data = await res;
        return dispatch(
          getChangeOnRejectReferral(username, isGuest, get(data, 'result.block_num')),
        );
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

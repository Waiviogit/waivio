import { message } from 'antd';
import * as ApiClient from '../../../waivioApi/ApiClient';
import { createAsyncActionType } from '../../helpers/stateHelpers';

export const GET_USER_REFERRAL_DETAILS = createAsyncActionType(
  '@referral/GET_USER_REFERRAL_DETAILS',
);
export const getUserReferralDetails = () => dispatch =>
  dispatch({
    type: GET_USER_REFERRAL_DETAILS.ACTION,
    payload: ApiClient.getReferralDetails(),
  });

export const GET_IS_USER_IN_BLACKLIST = createAsyncActionType('@referral/GET_IS_USER_IN_BLACKLIST');
export const getIsUserInBlackList = username => dispatch =>
  dispatch({
    type: GET_IS_USER_IN_BLACKLIST.ACTION,
    payload: ApiClient.getUserIsBlackListed(username),
  });

export const REFERRAL_CONFIRM_RULES = createAsyncActionType('@referral/REFERRAL_CONFIRM_RULES');
export const referralConfirmRules = (username, isGuest) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const data = {
    username,
    isGuest,
  };
  dispatch({
    type: REFERRAL_CONFIRM_RULES.START,
    payload: data,
  });
  steemConnectAPI
    .referralConfirmRules(username, isGuest)
    .then(res => {
      if (!res.message) {
        return dispatch({
          type: REFERRAL_CONFIRM_RULES.SUCCESS,
          payload: data,
        });
      }
      return dispatch({
        type: REFERRAL_CONFIRM_RULES.ERROR,
        payload: data,
      });
    })
    .catch(err => {
      message.error(err.message);
      return dispatch({
        type: REFERRAL_CONFIRM_RULES.ERROR,
        payload: data,
      });
    });
};

export const REFERRAL_REJECT_RULES = createAsyncActionType('@referral/REFERRAL_REJECT_RULES');
export const referralRejectRules = (username, isGuest) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const data = {
    username,
    isGuest,
  };
  dispatch({
    type: REFERRAL_REJECT_RULES.START,
    payload: data,
  });
  steemConnectAPI
    .referralRejectRules(username, isGuest)
    .then(res => {
      if (!res.message) {
        return dispatch({
          type: REFERRAL_REJECT_RULES.SUCCESS,
          payload: data,
        });
      }
      return dispatch({
        type: REFERRAL_REJECT_RULES.ERROR,
        payload: data,
      });
    })
    .catch(err => {
      message.error(err.message);
      return dispatch({
        type: REFERRAL_REJECT_RULES.ERROR,
        payload: data,
      });
    });
};

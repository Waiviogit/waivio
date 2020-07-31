import { getAuthenticatedUserName } from '../reducers';
import { createAsyncActionType } from '../helpers/stateHelpers';
import * as ApiClient from '../../waivioApi/ApiClient';

export const SET_MATCH_BOT_RULE = createAsyncActionType('@rewards/SET_MATCH_BOT_RULE');

export const setMatchBotRules = ruleObj => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();
  const username = getAuthenticatedUserName(state);
  return dispatch({
    type: SET_MATCH_BOT_RULE.ACTION,
    payload: {
      promise: steemConnectAPI.settingMatchBotRule(username, ruleObj),
    },
  });
};

export const SET_MATCH_BOT_VOTING_POWER = createAsyncActionType(
  '@rewards/SET_MATCH_BOT_VOTING_POWER',
);

export const setMatchBotVotingPower = votingPower => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();
  const username = getAuthenticatedUserName(state);
  return dispatch({
    type: SET_MATCH_BOT_VOTING_POWER.ACTION,
    payload: {
      promise: steemConnectAPI.settingMatchBotVotingPower(username, votingPower),
    },
  });
};

export const DEL_MATCH_BOT_RULE = createAsyncActionType('@rewards/DEL_MATCH_BOT_RULE');

export const deleteMatchBotRule = sponsorName => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();
  const username = getAuthenticatedUserName(state);
  return dispatch({
    type: DEL_MATCH_BOT_RULE.ACTION,
    payload: {
      promise: steemConnectAPI.deleteMatchBotRule(username, sponsorName),
    },
  });
};

export const SET_DATA_FOR_SINGLE_REPORT = createAsyncActionType(
  '@rewards/SET_DATA_FOR_SINGLE_REPORT',
);

export const setDataForSingleReport = payload => dispatch =>
  dispatch({
    type: SET_DATA_FOR_SINGLE_REPORT.ACTION,
    payload,
  });

export const SET_DATA_FOR_GLOBAL_REPORT = createAsyncActionType(
  '@rewards/SET_DATA_FOR_GLOBAL_REPORT',
);

export const setDataForGlobalReport = payload => dispatch =>
  dispatch({
    type: SET_DATA_FOR_GLOBAL_REPORT.ACTION,
    payload,
  });

export const CHANGE_BLACK_AND_WHITE_LISTS = '@rewards/CHANGE_BLACK_AND_WHITE_LISTS';

export const changeBlackAndWhiteLists = (id, user) => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();
  const username = getAuthenticatedUserName(state);
  return dispatch({
    type: CHANGE_BLACK_AND_WHITE_LISTS,
    payload: {
      promise: steemConnectAPI.changeBlackAndWhiteLists(username, id, user),
    },
  });
};

export const GET_BLACKLIST = '@rewards/GET_BLACKLIST';

export const getBlacklist = userName => dispatch =>
  dispatch({
    type: GET_BLACKLIST,
    payload: ApiClient.getBlacklist(userName),
  });

export const GET_REWARDS_GENERAL_COUNTS = createAsyncActionType(
  '@rewards/GET_REWARDS_GENERAL_COUNTS',
);

export const getRewardsGeneralCounts = () => (dispatch, getState) => {
  const state = getState();
  const authUserName = getAuthenticatedUserName(state);
  return dispatch({
    type: GET_REWARDS_GENERAL_COUNTS.ACTION,
    payload: {
      promise: ApiClient.getRewardsGeneralCounts({ userName: authUserName }),
    },
  });
};

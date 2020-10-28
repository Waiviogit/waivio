import { getAuthenticatedUserName, getLocale } from '../reducers';
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

export const getRewardsGeneralCounts = ({ userName, sort, match, area }) => (
  dispatch,
  getState,
) => {
  const state = getState();
  const locale = getLocale(state);

  return dispatch({
    type: GET_REWARDS_GENERAL_COUNTS.ACTION,
    payload: {
      promise: ApiClient.getRewardsGeneralCounts({ userName, sort, match, area, locale }),
    },
  });
};

export const GET_FOLLOWING_SPONSORS_REWARDS = createAsyncActionType(
  '@rewards/GET_FOLLOWING_SPONSORS_REWARDS',
);

export const getFollowingSponsorsRewards = skip => (dispatch, getState) => {
  const state = getState();
  const userName = getAuthenticatedUserName(state);
  return dispatch({
    type: GET_FOLLOWING_SPONSORS_REWARDS.ACTION,
    payload: ApiClient.getFollowingSponsorsRewards({ userName, skip }),
  });
};

export const CLEAR_FOLLOWING_SPONSORS_REWARDS = createAsyncActionType(
  '@rewards/CLEAR_FOLLOWING_SPONSORS_REWARDS',
);

export const clearFollowingSponsorsRewards = () => dispatch =>
  dispatch({
    type: CLEAR_FOLLOWING_SPONSORS_REWARDS.ACTION,
  });

export const GET_FRAUD_SUSPICION = createAsyncActionType('@rewards/GET_FRAUD_SUSPICION');

export const getFraudSuspicion = ({ fraudSuspicion, sort, skip }) => (dispatch, getState) => {
  const state = getState();
  const guideName = getAuthenticatedUserName(state);
  return dispatch({
    type: GET_FRAUD_SUSPICION.ACTION,
    payload: ApiClient.getHistory({ guideName, fraudSuspicion, sort, skip }),
  });
};

export const GET_PROPOSITIONS_LIST_CONTAINER = createAsyncActionType(
  '@rewards/GET_PROPOSITIONS_LIST_CONTAINER',
);

export const getPropositionsForListContainer = reqData => ({
  type: GET_PROPOSITIONS_LIST_CONTAINER.ACTION,
  payload: ApiClient.getPropositions(reqData),
});

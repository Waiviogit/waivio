import * as ApiClient from '../../waivioApi/ApiClient';
import { getLocale } from '../settingsStore/settingsSelectors';
import { getLastBlockNum } from '../../client/vendor/steemitHelpers';
import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import { getAuthenticatedUserName, isGuestUser } from '../authStore/authSelectors';
import { subscribeMethod, subscribeTypes } from '../../common/constants/blockTypes';

export const CLEAR_MATCH_BOTS = '@rewards/CLEAR_MATCH_BOTS';
export const SET_MATCH_BOT_RULE = createAsyncActionType('@rewards/SET_MATCH_BOT_RULE');
export const GET_MATCH_BOTS = createAsyncActionType('@rewards/GET_MATCH_BOTS');
export const SET_MATCH_BOT = createAsyncActionType('@rewards/SET_MATCH_BOT');
export const UNSET_MATCH_BOT = createAsyncActionType('@rewards/UNSET_MATCH_BOT');

export const clearMatchBots = () => ({ type: CLEAR_MATCH_BOTS });

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

export const GET_REWARDS_HISTORY = createAsyncActionType('@rewards/GET_REWARDS_HISTORY');

export const getRewardsHistory = requestData => ({
  type: GET_REWARDS_HISTORY.ACTION,
  payload: ApiClient.getHistory(requestData),
});

export const GET_MORE_REWARDS_HISTORY = createAsyncActionType('@rewards/GET_MORE_REWARDS_HISTORY');

export const getMoreRewardsHistory = requestData => ({
  type: GET_MORE_REWARDS_HISTORY.ACTION,
  payload: ApiClient.getHistory(requestData),
});

export const SET_TOGGLE_FLAG = '@rewards/SET_TOGGLE_FLAG';

export const setToggleFlag = () => ({
  type: SET_TOGGLE_FLAG,
});

export const REMOVE_TOGGLE_FLAG = '@rewards/REMOVE_TOGGLE_FLAG';

export const removeToggleFlag = () => ({
  type: REMOVE_TOGGLE_FLAG,
});

export const CHECK_EXPIRED_PAYMENTS = createAsyncActionType('@rewards/CHECK_EXPIRED_PAYMENTS');

export const checkExpiredPayment = name => ({
  type: CHECK_EXPIRED_PAYMENTS.ACTION,
  payload: ApiClient.checkExpiredPayment(name).then(data => data.warning),
});

export const getMatchBots = botType => (dispatch, getState) => {
  const state = getState();
  const botName = getAuthenticatedUserName(state);

  return dispatch({
    type: GET_MATCH_BOTS.ACTION,
    payload: {
      promise: ApiClient.getMatchBots(botName, botType),
    },
  });
};

export const setMatchBot = ruleObj => (dispatch, getState, { steemConnectAPI, busyAPI }) => {
  const state = getState();
  const voter = getAuthenticatedUserName(state);
  const isGuest = isGuestUser(state);

  return dispatch({
    type: SET_MATCH_BOT.ACTION,
    payload: {
      promise: steemConnectAPI.setMatchBot(voter, ruleObj).then(async data => {
        const res = isGuest ? await data.json() : data.result;
        const blockNumber = await getLastBlockNum();
        const subscribeCallback = () => dispatch(getMatchBots(ruleObj.type));

        if (data.status !== 200 && isGuest) throw new Error(data.message);
        busyAPI.instance.sendAsync(subscribeMethod, [voter, blockNumber, subscribeTypes.campaigns]);
        busyAPI.instance.subscribeBlock(subscribeTypes.campaigns, blockNumber, subscribeCallback);

        return res;
      }),
    },
  });
};

export const unsetMatchBot = (name, type) => (dispatch, getState, { steemConnectAPI, busyAPI }) => {
  const state = getState();
  const username = getAuthenticatedUserName(state);
  const voter = getAuthenticatedUserName(state);
  const isGuest = isGuestUser(state);

  return dispatch({
    type: UNSET_MATCH_BOT.ACTION,
    payload: {
      promise: steemConnectAPI.unsetMatchBot(username, name, type).then(async data => {
        const res = isGuest ? await data.json() : data.result;
        const blockNumber = await getLastBlockNum();
        const subscribeCallback = () => dispatch(getMatchBots(type));

        if (data.status !== 200 && isGuest) throw new Error(data.message);
        busyAPI.instance.sendAsync(subscribeMethod, [voter, blockNumber, subscribeTypes.campaigns]);
        busyAPI.instance.subscribeBlock(subscribeTypes.campaigns, blockNumber, subscribeCallback);

        return res;
      }),
    },
  });
};

export const subscribeSocket = (callback, type) => (dispatch, getState, { busyAPI }) => {
  busyAPI.instance.subscribe((response, mess) => {
    if (type === mess.type) {
      callback();
    }
  });
};

import * as ApiClient from '../../waivioApi/ApiClient';
import { getLastBlockNum } from '../../client/vendor/steemitHelpers';
import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import { getAuthenticatedUserName, isGuestUser } from '../authStore/authSelectors';
import { subscribeMethod, subscribeTypes } from '../../common/constants/blockTypes';
import { getMatchBotsHasMoreSelector, getMatchBotsSelector } from './rewardsSelectors';

export const CLEAR_MATCH_BOTS = '@rewards/CLEAR_MATCH_BOTS';
export const SET_MATCH_BOT_RULE = createAsyncActionType('@rewards/SET_MATCH_BOT_RULE');
export const GET_MATCH_BOTS = createAsyncActionType('@rewards/GET_MATCH_BOTS');
export const LOAD_MORE_MATCH_BOTS = createAsyncActionType('@rewards/LOAD_MORE_MATCH_BOTS');
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

export const GET_FOLLOWING_SPONSORS_REWARDS = createAsyncActionType(
  '@rewards/GET_FOLLOWING_SPONSORS_REWARDS',
);

export const CLEAR_FOLLOWING_SPONSORS_REWARDS = createAsyncActionType(
  '@rewards/CLEAR_FOLLOWING_SPONSORS_REWARDS',
);

export const clearFollowingSponsorsRewards = () => dispatch =>
  dispatch({
    type: CLEAR_FOLLOWING_SPONSORS_REWARDS.ACTION,
  });

export const GET_FRAUD_SUSPICION = createAsyncActionType('@rewards/GET_FRAUD_SUSPICION');

export const GET_REWARDS_HISTORY = createAsyncActionType('@rewards/GET_REWARDS_HISTORY');

export const GET_MORE_REWARDS_HISTORY = createAsyncActionType('@rewards/GET_MORE_REWARDS_HISTORY');

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
      promise: ApiClient.getMatchBots(botName, botType, 0, 20),
    },
  });
};

export const getMatchBotsLoadMore = (botType, skip, limit) => (dispatch, getState) => {
  const state = getState();
  const botName = getAuthenticatedUserName(state);

  return dispatch({
    type: LOAD_MORE_MATCH_BOTS.ACTION,
    payload: {
      promise: ApiClient.getMatchBots(botName, botType, skip, limit),
    },
  });
};

export const setMatchBot = ruleObj => (dispatch, getState, { steemConnectAPI, busyAPI }) => {
  const state = getState();
  const voter = getAuthenticatedUserName(state);
  const isGuest = isGuestUser(state);
  const bots = getMatchBotsSelector(state);
  const hasMore = getMatchBotsHasMoreSelector(state);

  return dispatch({
    type: SET_MATCH_BOT.ACTION,
    payload: {
      promise: steemConnectAPI.setMatchBot(voter, ruleObj).then(async data => {
        const res = isGuest ? await data.json() : data.result;
        const blockNumber = await getLastBlockNum();
        const subscribeCallback = () => {
          if (!hasMore) dispatch(getMatchBotsLoadMore(ruleObj.type, bots?.length || 0, 1));
        };

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

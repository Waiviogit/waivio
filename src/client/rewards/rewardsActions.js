import { getAuthenticatedUserName } from '../reducers';
import { createAsyncActionType } from '../helpers/stateHelpers';

export const SET_MATCH_BOT_RULE = createAsyncActionType('@rewards/SET_MATCH_BOT_RULE');

export const setMatchBotRules = ruleObj => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();
  const username = getAuthenticatedUserName(state);
  const preparedRuleObj = {
    ...ruleObj,
    botName: username,
  };
  return dispatch({
    type: SET_MATCH_BOT_RULE.ACTION,
    payload: {
      promise: steemConnectAPI.settingMatchBotRule(username, preparedRuleObj),
    },
  });
};

export const SET_MATCH_BOT_VOTING_POWER = createAsyncActionType(
  '@rewards/SET_MATCH_BOT_VOTING_POWER',
);

export const setMatchBotVotingPower = minVotingPower => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const state = getState();
  const username = getAuthenticatedUserName(state);
  const preparedObj = {
    minVotingPower,
    botName: username,
  };
  return dispatch({
    type: SET_MATCH_BOT_VOTING_POWER.ACTION,
    payload: {
      promise: steemConnectAPI.settingMatchBotVotingPower(username, preparedObj),
    },
  });
};

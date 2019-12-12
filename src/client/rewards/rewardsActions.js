import { getAuthenticatedUserName } from '../reducers';

export const SET_MATCH_BOT_RULE = '@rewards/SET_MATCH_BOT_RULE';
export const SET_MATCH_BOT_RULE_START = "@rewards/SET_MATCH_BOT_RULE'_START";
export const SET_MATCH_BOT_RULE_ERROR = "@rewards/SET_MATCH_BOT_RULE'_ERROR";
export const SET_MATCH_BOT_RULE_SUCCESS = "@rewards/SET_MATCH_BOT_RULE'_SUCCESS";

export const setMatchBotRules = ruleObj => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();
  const username = getAuthenticatedUserName(state);
  const preparedRuleObj = {
    ...ruleObj,
    botName: username,
  };
  return dispatch({
    type: SET_MATCH_BOT_RULE,
    payload: {
      promise: steemConnectAPI.settingMatchBotRule(username, preparedRuleObj),
    },
  });
};

import { getAuthenticatedUserName } from '../../reducers';

export const SET_SESSION_ID = '@wobj/SET_SESSION_ID';
export const SET_SESSION_ID_START = '@wobj/SET_SESSION_ID_START';
export const SET_SESSION_ID_ERROR = '@wobj/SET_SESSION_ID_ERROR';
export const SET_SESSION_ID_SUCCESS = '@wobj/SET_SESSION_ID_SUCCESS';

export const setSessionId = sessionId => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();
  const username = getAuthenticatedUserName(state);
  return dispatch({
    type: SET_SESSION_ID,
    payload: {
      promise: steemConnectAPI.followObject(username, '', sessionId),
    },
  });
};

export const SET_POSTMESSAGE_ACTION = '@wobj/SET_POSTMESSAGE_ACTION';

export const setPostMessageAction = (messageType, data) => dispatch =>
  dispatch({
    type: SET_POSTMESSAGE_ACTION,
    payload: { messageType, data },
  });

export const SET_DEFAULT_CONDITION = '@wobj/SET_DEFAULT_CONDITION';
export const setDefaultCondition = () => dispatch => {
  dispatch({
    type: SET_DEFAULT_CONDITION,
  });
};

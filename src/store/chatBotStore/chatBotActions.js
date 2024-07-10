export const SET_MESSAGE = '@chatBot/SET_MESSAGE';
export const SET_ID = '@chatBot/SET_ID';
export const SET_HISTORY = '@chatBot/SET_HISTORY';

export const setChatBotMessage = message => dispatch => {
  dispatch({
    type: SET_MESSAGE,
    payload: message,
  });
};
export const setChatBotId = id => dispatch => {
  dispatch({
    type: SET_ID,
    payload: id,
  });
};

export const setChatBotHistory = messages => dispatch => {
  dispatch({
    type: SET_HISTORY,
    payload: messages,
  });
};

export const RESET_MESSAGES = '@chatBot/RESET_MESSAGES';
export const resetChatBotMessages = () => dispatch => {
  dispatch({
    type: RESET_MESSAGES,
  });
};

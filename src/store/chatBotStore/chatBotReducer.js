import * as chatBotActions from './chatBotActions';

const defaultState = {
  messages: [],
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case chatBotActions.SET_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    case chatBotActions.RESET_MESSAGES:
      return {
        ...state,
        messages: [],
      };
    default:
      return state;
  }
};

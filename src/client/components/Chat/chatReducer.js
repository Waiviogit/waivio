import * as chatActions from './chatActions';

const initialState = {
  postMessageType: '',
  data: '',
};

export default function chatReducer(state = initialState, action) {
  switch (action.type) {
    case chatActions.SET_POSTMESSAGE_ACTION:
      return {
        ...state,
        postMessageType: action.payload.messageType,
        data: action.payload.data,
      };
    case chatActions.SET_DEFAULT_CONDITION:
      return {
        ...state,
        postMessageType: '',
        data: '',
      };
    default: {
      return state;
    }
  }
}

export const getPostMessageType = state => state.postMessageType;
export const getPostMessageData = state => state.data;

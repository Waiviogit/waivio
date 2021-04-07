import {
  CHANGE_MAP_MODAL_MODE,
  RESET_UPDATED_STATE,
  SET_UPDATED_STATE,
  GET_PROPOSITIONS_FOR_MAP,
} from './mapActions';

const initialState = {
  isFullscreenMode: false,
  updated: false,
  map: false,
};

const mapReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_MAP_MODAL_MODE:
      return {
        ...state,
        isFullscreenMode: action.payload,
      };
    case RESET_UPDATED_STATE:
      return {
        ...state,
        updated: false,
      };
    case SET_UPDATED_STATE:
      return {
        ...state,
        updated: true,
      };
    case GET_PROPOSITIONS_FOR_MAP: {
      return {
        ...state,
        mapWobjects: action.payload,
      };
    }
    default:
      return state;
  }
};

export default mapReducer;

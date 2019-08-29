import { CHANGE_MAP_MODAL_MODE } from './mapActions';

const initialState = {
  isFullscreenMode: false,
};

const mapReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_MAP_MODAL_MODE:
      return {
        ...state,
        isFullscreenMode: action.payload,
      };
    default:
      return state;
  }
};

export default mapReducer;

export const getIsMapModalOpen = state => state.isFullscreenMode;

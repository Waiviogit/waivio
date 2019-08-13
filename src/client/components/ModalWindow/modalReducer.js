import * as actions from './modalActions';

const initialState = {
  visibility: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_MODAL_VISIBILITY:
      return {
        ...state,
        visibility: !state.visibility,
      };
    default: {
      return state;
    }
  }
};

export const getModalVisability = state => state.visibility;

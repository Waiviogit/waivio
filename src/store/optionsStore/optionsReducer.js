import * as optionsActions from './optionsActions';

const defaultState = {
  activeOption: {},
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case optionsActions.SET_ACTIVE_OPTION:
      return {
        ...state,
        activeOption: action.payload,
      };
    case optionsActions.SET_ACTIVE_CATEGORY:
      return {
        ...state,
        activeCategory: action.payload,
      };
    case optionsActions.SET_GROUP_ID:
      return {
        ...state,
        groupId: action.payload,
      };
    default:
      return state;
  }
};

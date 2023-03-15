import {
  RESET_BREAD_CRUMB,
  SET_BREAD_ACTIVE_CRUMB,
  SET_BREAD_CRUMB,
  SET_EXCLUDED,
} from './shopActions';

const initialState = {
  crumbs: [],
  activeCrumb: null,
  exclude: [],
};

export default function shopReducer(state = initialState, action) {
  switch (action.type) {
    case SET_BREAD_CRUMB:
      const index = state.crumbs.findIndex(crumb => crumb.name === action.crumb.name);
      const crumbs = [...state.crumbs];

      if (index >= 0) crumbs.slice(index + 1);
      else crumbs.push(action.crumb);

      return {
        ...state,
        crumbs,
        activeCrumb: action.crumb,
      };

    case SET_BREAD_ACTIVE_CRUMB:
      return {
        ...state,
        activeCrumb: action.crumb,
      };

    case RESET_BREAD_CRUMB:
      return initialState;

    case SET_EXCLUDED:
      return {
        ...state,
        excluded: action.excluded,
      };

    default:
      return state;
  }
}

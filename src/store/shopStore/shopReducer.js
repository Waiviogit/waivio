import {
  GET_DEPARTMENTS,
  GET_SHOP_LIST,
  RESET_BREAD_CRUMB,
  RESET_OPTION_CLICKED,
  SET_BREAD_ACTIVE_CRUMB,
  SET_BREAD_CRUMB,
  SET_EXCLUDED,
  SET_OPTION_CLICKED,
} from './shopActions';

const initialState = {
  crumbs: [],
  activeCrumb: null,
  exclude: [],
  isOptionClicked: false,
  departmentsList: [],
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
    case SET_OPTION_CLICKED:
      return {
        ...state,
        isOptionClicked: true,
      };
    case RESET_OPTION_CLICKED:
      return {
        ...state,
        isOptionClicked: false,
      };
    case GET_DEPARTMENTS.SUCCESS:
      return {
        ...state,
        departmentsList: action.meta.department ? state.departmentsList : action.payload,
      };
    case GET_SHOP_LIST.SUCCESS:
      if (action.payload.message) return state;

      return {
        ...state,
        shopList: action.meta.isLoadMore
          ? [...state.shopList, ...action.payload.result]
          : action.payload.result,
        shopListHasMore: action.payload.hasMore,
      };

    default:
      return state;
  }
}

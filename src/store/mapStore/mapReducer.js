import {
  CHANGE_MAP_MODAL_MODE,
  RESET_UPDATED_STATE,
  SET_UPDATED_STATE,
  GET_PROPOSITIONS_FOR_MAP,
  SET_MAP_DATA,
  SET_HEIGHT,
  SET_BOUNDS_PARAMS,
  SET_INFOBOX_DATA,
  SET_SHOW_LOCATION,
  SET_AREA,
  SET_LOADING,
} from './mapActions';

const initialState = {
  isFullscreenMode: false,
  updated: false,
  map: false,
  boundsParams: { topPoint: [], bottomPoint: [] },
  infoboxData: null,
  height: '100%',
  showLocation: false,
  area: [],
  mapData: { center: [], zoom: 6 },
  loading: true,
};

const mapReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_MAP_MODAL_MODE:
      return {
        ...state,
        isFullscreenMode: action.payload,
      };
    case SET_MAP_DATA:
      return {
        ...state,
        mapData: action.payload,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case SET_HEIGHT:
      return {
        ...state,
        height: action.payload,
      };
    case SET_BOUNDS_PARAMS:
      return {
        ...state,
        boundsParams: action.payload,
      };
    case SET_INFOBOX_DATA:
      return {
        ...state,
        infoboxData: action.payload,
      };
    case SET_SHOW_LOCATION:
      return {
        ...state,
        showLocation: action.payload,
      };
    case SET_AREA:
      return {
        ...state,
        area: action.payload,
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

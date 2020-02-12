import * as appendActions from './appendActions';
import { LOGOUT } from "../auth/authActions";

const defaultState = {
  loading: false,
  error: null,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case appendActions.APPEND_WAIVIO_OBJECT.START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case appendActions.APPEND_WAIVIO_OBJECT.ERROR:
      return {
        ...state,
        error: action.payload.message,
        loading: false,
      };
    case appendActions.APPEND_WAIVIO_OBJECT.SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
      };
    case LOGOUT:
      return defaultState;
    default:
      return state;
  }
};

export const getIsAppendLoading = state => state.loading;

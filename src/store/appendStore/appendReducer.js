import * as appendActions from './appendActions';

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
    default:
      return state;
  }
};

import * as appendActions from './appendActions';

const defaultState = {
  loading: false,
  error: null,
  hasMore: true,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case appendActions.GET_OBJECT_UPDATES.START:
    case appendActions.GET_MORE_OBJECT_UPDATES.START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case appendActions.GET_OBJECT_UPDATES.ERROR:
    case appendActions.GET_MORE_OBJECT_UPDATES.ERROR:
      return {
        ...state,
        error: action.payload.message,
        loading: false,
      };

    case appendActions.GET_OBJECT_UPDATES.SUCCESS: {
      return {
        ...state,
        fields: action.payload.fields,
        hasMore: action.payload.hasMore,
        error: null,
        loading: false,
      };
    }

    case appendActions.GET_MORE_OBJECT_UPDATES.SUCCESS: {
      return {
        ...state,
        fields: [...state.fields, ...action.payload.fields],
        hasMore: action.payload.hasMore,
        error: null,
        loading: false,
      };
    }

    default:
      return state;
  }
};

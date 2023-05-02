import * as appendActions from './appendActions';
import { GET_CHANGED_WOBJECT_UPDATE } from '../wObjectStore/wobjActions';

const defaultState = {
  loading: false,
  error: null,
  hasMore: true,
  authorityList: {},
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
    case appendActions.APPEND_WAIVIO_OBJECT.ERROR:
      return {
        ...state,
        error: action.payload.message,
        loading: false,
      };

    case appendActions.APPEND_WAIVIO_OBJECT.START:
      return {
        ...state,
        loading: true,
        error: null,
        fields: [],
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
    case appendActions.SET_OBJECT_IN_AUTHORITY: {
      return {
        ...state,
        authorityList: { ...state.authorityList, [action.permlink]: true },
      };
    }
    case appendActions.REMOVE_OBJECT_FROM_AUTHORITY: {
      return {
        ...state,
        authorityList: { ...state.authorityList, [action.permlink]: false },
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

    case GET_CHANGED_WOBJECT_UPDATE.SUCCESS: {
      const { field } = action.payload;
      const fields = [...state.fields];

      if (action.meta.isNew) {
        return state;
      }

      const findIndex = fields.findIndex(fld => fld.permlink === field.permlink);

      fields.splice(findIndex, 1, { ...fields[findIndex], ...field, loading: false });

      return {
        ...state,
        fields,
        loading: false,
      };
    }

    case appendActions.GET_CHANGED_WOBJECT_FIELD.ERROR:
    case appendActions.GET_CHANGED_WOBJECT_FIELD.SUCCESS: {
      return {
        ...state,
        loading: false,
      };
    }

    case appendActions.VOTE_APPEND.START: {
      const matchPostIndex = state.fields.findIndex(
        field => field.permlink === action.payload.permlink,
      );

      if (action.payload.post) {
        state.fields.splice(matchPostIndex, 1, {
          ...action.payload.post,
          loading: true,
        });

        return {
          ...state,
          fields: [...state.fields],
        };
      }

      return state;
    }

    case appendActions.UPDATE_COUNTER: {
      const matchPostIndex = state.fields.findIndex(
        field => field.permlink === action.payload.post.permlink,
      );

      if (action.payload.post) {
        state.fields.splice(matchPostIndex, 1, {
          ...action.payload.post,
          children: action.payload.post.children + 1,
        });

        return {
          ...state,
          fields: [...state.fields],
        };
      }

      return state;
    }

    case appendActions.RESET_UPDATES_LIST: {
      return defaultState;
    }

    case appendActions.VOTE_APPEND.ERROR:
    case appendActions.VOTE_APPEND.SUCCESS: {
      const matchPostIndex = state.fields.findIndex(
        field => field.permlink === action.payload.permlink,
      );

      if (action.payload.post) {
        state.fields.splice(matchPostIndex, 1, {
          ...action.payload.post,
          loading: false,
        });

        return {
          ...state,
          fields: [...state.wobject.fields],
        };
      }

      return state;
    }

    default:
      return state;
  }
};

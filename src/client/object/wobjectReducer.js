import { isEmpty } from 'lodash';

import * as actions from './wobjectsActions';
import * as appendAction from './appendActions';
import {
  FOLLOW_OBJECT,
  RATE_WOBJECT_SUCCESS,
  SEND_COMMENT_APPEND,
  VOTE_APPEND_START,
  UNFOLLOW_OBJECT,
  GET_CHANGED_WOBJECT_FIELD,
  VOTE_APPEND_ERROR,
} from './wobjActions';

const initialState = {
  wobject: {},
  isFetching: false,
};

export default function wobjectReducer(state = initialState, action) {
  switch (action.type) {
    case actions.GET_OBJECT_START:
      return {
        ...state,
        isFetching: true,
      };
    case actions.GET_OBJECT_ERROR:
      return {
        ...state,
        isFetching: false,
      };
    case actions.CLEAR_OBJECT:
      return {
        ...state,
        wobject: {},
      };
    case actions.GET_OBJECT_SUCCESS:
      return {
        ...state,
        wobject: {
          ...action.payload,
        },
        isFetching: false,
      };

    case actions.ADD_ITEM_TO_LIST:
      return {
        ...state,
        wobject: {
          ...state.wobject,
          listItems: [...state.wobject.listItems, action.payload],
        },
      };

    case RATE_WOBJECT_SUCCESS: {
      if (!state.wobject.fields) return state;
      const isNewVote = field =>
        field.rating_votes ? !field.rating_votes.some(v => v.voter === action.meta.voter) : true;

      const vote = {
        rate: action.meta.rate,
        voter: action.meta.voter,
      };

      return {
        ...state,
        wobject: {
          ...state.wobject,
          fields: state.wobject.fields.map(field =>
            field.permlink === action.meta.permlink
              ? {
                  ...field,
                  rating_votes: isNewVote(field)
                    ? (field.rating_votes && [...field.rating_votes, vote]) || [vote]
                    : field.rating_votes.map(rv => (rv.voter === action.meta.voter ? vote : rv)),
                }
              : field,
          ),
        },
      };
    }

    case appendAction.APPEND_WAIVIO_OBJECT.SUCCESS: {
      if (isEmpty(action.payload)) return state;
      const { toDisplay, field } = action.payload;
      return {
        ...state,
        wobject: {
          [field.name]: toDisplay || '',
          ...state.wobject,
          fields: [...state.wobject.fields, field],
        },
      };
    }

    case VOTE_APPEND_START: {
      const matchPostIndex = state.wobject.fields.findIndex(
        field => field.permlink === action.payload.permlink,
      );
      state.wobject.fields.splice(matchPostIndex, 1, {
        ...action.payload.post,
        loading: true,
      });

      return {
        ...state,
        wobject: {
          ...state.wobject,
          fields: [...state.wobject.fields],
        },
      };
    }

    case VOTE_APPEND_ERROR: {
      const matchPostIndex = state.wobject.fields.findIndex(
        field => field.permlink === action.payload.permlink,
      );
      state.wobject.fields.splice(matchPostIndex, 1, {
        ...action.payload.post,
        loading: false,
      });

      return {
        ...state,
        wobject: {
          ...state.wobject,
          fields: [...state.wobject.fields],
        },
      };
    }

    case SEND_COMMENT_APPEND: {
      const matchPostIndex = state.wobject.fields.findIndex(
        field => field.permlink === action.payload.permlink,
      );
      const matchPost = state.wobject.fields.find(
        field => field.permlink === action.payload.permlink,
      );

      state.wobject.fields.splice(matchPostIndex, 1, {
        ...matchPost,
        children: matchPost.children + 1,
      });

      return {
        ...state,
        wobject: {
          ...state.wobject,
          fields: [...state.wobject.fields],
        },
      };
    }

    case FOLLOW_OBJECT.START: {
      if (state.wobject.author_permlink === action.meta.permlink) {
        return {
          ...state,
          wobject: {
            ...state.wobject,
            pending: true,
          },
        };
      }

      return state;
    }
    case FOLLOW_OBJECT.SUCCESS: {
      if (state.wobject.author_permlink === action.meta.permlink) {
        return {
          ...state,
          wobject: {
            ...state.wobject,
            pending: false,
            youFollows: true,
          },
        };
      }

      return state;
    }
    case FOLLOW_OBJECT.ERROR: {
      if (state.wobject.author_permlink === action.meta.permlink) {
        return {
          ...state,
          wobject: {
            ...state.wobject,
            pending: false,
          },
        };
      }

      return state;
    }

    case UNFOLLOW_OBJECT.START: {
      if (state.wobject.author_permlink === action.meta.permlink) {
        return {
          ...state,
          wobject: {
            ...state.wobject,
            pending: true,
          },
        };
      }

      return state;
    }
    case UNFOLLOW_OBJECT.SUCCESS: {
      if (state.wobject.author_permlink === action.meta.permlink) {
        return {
          ...state,
          wobject: {
            ...state.wobject,
            pending: false,
            youFollows: false,
          },
        };
      }

      return state;
    }
    case UNFOLLOW_OBJECT.ERROR: {
      if (state.wobject.author_permlink === action.meta.permlink) {
        return {
          ...state,
          wobject: {
            ...state.wobject,
            pending: false,
          },
        };
      }

      return state;
    }

    case GET_CHANGED_WOBJECT_FIELD.SUCCESS: {
      const { toDisplay, field } = action.payload;
      const fields = [...state.wobject.fields];
      const findIndex = fields.findIndex(fld => fld.permlink === field.permlink);

      fields.splice(findIndex, 1, { ...fields[findIndex], ...field, loading: false });
      console.log(action.payload);
      return {
        ...state,
        wobject: {
          ...state.wobject,
          fields: [...fields],
          [field.name]: toDisplay || '',
          pending: false,
        },
      };
    }

    default: {
      return state;
    }
  }
}

export const getObjectState = state => state.wobject;
export const getObjectFetchingState = state => state.isFetching;
export const getObjectAuthor = state => state.author;
export const getObjectFields = state => state.wobject.fields || [];
export const getObjectAdmins = state => state.wobject.admins || [];
export const getObjectModerators = state => state.wobject.moderators || [];
export const getRatingFields = state => state.wobject.rating;
export const getObjectTagCategory = state => state.wobject.tagCategories;

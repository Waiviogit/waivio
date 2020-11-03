import * as actions from './wobjectsActions';
import {
  FOLLOW_OBJECT,
  RATE_WOBJECT_SUCCESS,
  SEND_COMMENT_APPEND,
  VOTE_APPEND_START,
  UNFOLLOW_OBJECT,
  GET_CHANGED_WOBJECT_FIELD,
  VOTE_APPEND_ERROR,
  SET_CATALOG_BREADCRUMBS,
  SET_WOBJECT_NESTED,
  SET_LIST_ITEMS,
  CLEAR_IS_GET_NESTED_WOBJECT,
} from './wobjActions';
import { objectFields } from '../../common/constants/listOfFields';

export const initialState = {
  wobject: {},
  nestedWobject: {},
  lists: [],
  isFetching: false,
  isFailed: false,
  breadcrumb: [],
  isGetNestedWobject: false,
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
        isFailed: true,
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
        isFailed: false,
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

    case VOTE_APPEND_START: {
      const matchPostIndex = state.wobject.fields.findIndex(
        field => field.permlink === action.payload.permlink,
      );
      if (action.payload.post) {
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

      return state;
    }

    case VOTE_APPEND_ERROR: {
      const matchPostIndex = state.wobject.fields.findIndex(
        field => field.permlink === action.payload.permlink,
      );

      if (action.payload.post) {
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

      return state;
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
      const isArraysFields = [objectFields.categoryItem, objectFields.listItem].includes(
        field.name,
      );
      let key = field.name;

      if (isArraysFields)
        key = key === objectFields.categoryItem ? objectFields.tagCategory : objectFields.menuItems;

      if (action.meta.isNew) {
        return {
          ...state,
          wobject: {
            [key]: toDisplay || '',
            ...state.wobject,
            fields: [...fields, field],
          },
        };
      }

      const findIndex = fields.findIndex(fld => fld.permlink === field.permlink);

      fields.splice(findIndex, 1, { ...fields[findIndex], ...field, loading: false });

      return {
        ...state,
        wobject: {
          ...state.wobject,
          fields,
          [key]: toDisplay || '',
          pending: false,
        },
      };
    }

    case SET_CATALOG_BREADCRUMBS: {
      return {
        ...state,
        breadcrumb: action.payload,
      };
    }

    case SET_WOBJECT_NESTED: {
      return {
        ...state,
        isGetNestedWobject: true,
        nestedWobject: action.payload,
      };
    }

    case CLEAR_IS_GET_NESTED_WOBJECT: {
      return {
        ...state,
        isGetNestedWobject: false,
      };
    }

    case SET_LIST_ITEMS: {
      return {
        ...state,
        lists: action.lists,
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
export const getRatingFields = state => state.wobject.rating || [];
export const getObjectTagCategory = state => state.wobject.tagCategory;
export const getWobjectIsFailed = state => state.wobject.isFailed;
export const getWobjectIsFatching = state => state.wobject.isFetching;
export const getBreadCrumbs = state => state.breadcrumb;
export const getWobjectNested = state => state.nestedWobject;
export const getObjectLists = state => state.lists;
export const getIsNestedWobject = state => state.isGetNestedWobject;

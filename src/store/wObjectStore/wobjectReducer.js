import { uniqBy } from 'lodash';

import * as actions from './wobjectsActions';
import {
  FOLLOW_OBJECT,
  RATE_WOBJECT_SUCCESS,
  SEND_COMMENT_APPEND,
  VOTE_APPEND_START,
  UNFOLLOW_OBJECT,
  VOTE_APPEND_ERROR,
  SET_CATALOG_BREADCRUMBS,
  SET_WOBJECT_NESTED,
  SET_LIST_ITEMS,
  SET_LOADING_NESTED_WOBJECT,
  BELL_WOBJECT_NOTIFICATION,
  GET_WOBJECT_EXPERTISE,
  GET_RELATED_WOBJECT,
  CLEAR_RELATED_OBJECTS,
  FOLLOW_UNFOLLOW_USER_WOBJECT_EXPERTISE,
  GET_CHANGED_WOBJECT_UPDATE,
} from './wobjActions';
import { objectFields } from '../../common/constants/listOfFields';
import { FOLLOW_USER, UNFOLLOW_USER } from '../usersStore/usersActions';

export const initialState = {
  wobject: {},
  nestedWobject: {},
  nearbyWobjects: [],
  objectExpertise: {
    users: [],
    isLoading: true,
  },
  relatedWobjects: {
    skip: 0,
    objects: [],
    isLoading: false,
    hasNext: true,
  },
  lists: [],
  isFetching: false,
  isFailed: false,
  breadcrumb: [],
  isLoadingFlag: true,
  followers: {
    users: [],
    hasMore: false,
    isLoading: false,
  },
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
      const voteRateIndex = state.wobject.rating.findIndex(
        rating => rating.permlink === action.meta.permlink,
      );
      const currRating = state.wobject.rating[voteRateIndex];
      const vote = { rate: action.meta.rate, voter: action.meta.voter };
      const voteIndex = currRating.rating_votes.findIndex(v => v.voter === action.meta.voter);
      const ratingsVoteList = [...currRating.rating_votes];
      const wobjectRatingsVoteList = [...state.wobject.rating];

      if (voteIndex < 0) ratingsVoteList.push(vote);

      wobjectRatingsVoteList.splice(voteRateIndex, 1, {
        ...currRating,
        rating_votes: [...ratingsVoteList],
      });

      return {
        ...state,
        wobject: {
          ...state.wobject,
          rating: [...wobjectRatingsVoteList],
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

    case GET_CHANGED_WOBJECT_UPDATE.SUCCESS: {
      const { toDisplay, field } = action.payload;
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
            ...state.wobject,
            [key]: toDisplay ?? state.wobject[key],
          },
        };
      }

      return {
        ...state,
        wobject: {
          ...state.wobject,
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
        isLoadingFlag: false,
        nestedWobject: action.payload,
      };
    }

    case SET_LOADING_NESTED_WOBJECT: {
      return {
        ...state,
        isLoadingFlag: action.payload,
      };
    }

    case SET_LIST_ITEMS: {
      return {
        ...state,
        lists: action.lists,
      };
    }

    case BELL_WOBJECT_NOTIFICATION.SUCCESS: {
      return {
        ...state,
        wobject: {
          ...state.wobject,
          bell: action.payload.subscribe,
          bellLoading: false,
        },
      };
    }

    case BELL_WOBJECT_NOTIFICATION.START: {
      return {
        ...state,
        wobject: {
          ...state.wobject,
          bellLoading: true,
        },
      };
    }

    case BELL_WOBJECT_NOTIFICATION.ERROR: {
      return {
        ...state,
        wobject: {
          ...state.wobject,
          bellLoading: false,
        },
      };
    }

    case actions.GET_OBJECT_FOLLOWERS.START: {
      return {
        ...state,
        followers: {
          ...state.followers,
          isLoading: true,
        },
      };
    }

    case actions.GET_OBJECT_FOLLOWERS.SUCCESS: {
      return {
        ...state,
        followers: {
          ...state.followers,
          users: action.payload.wobjectFollowers.map(user => ({ ...user, isLoading: false })),
          hasMore: action.payload.hasMore,
        },
      };
    }
    case FOLLOW_USER.START:
    case UNFOLLOW_USER.START:
      return {
        ...state,
        followers: {
          ...state.followers,
          users: state.followers.users.map(user =>
            action.meta.username === user.name ? { ...user, pending: !user.pending } : user,
          ),
        },
      };

    case FOLLOW_USER.SUCCESS:
    case UNFOLLOW_USER.SUCCESS:
      return {
        ...state,
        followers: {
          ...state.followers,
          isLoading: false,
          users: state.followers.users.map(user =>
            action.meta.username === user.name
              ? { ...user, pending: !user.pending, youFollows: !user.youFollows }
              : user,
          ),
        },
      };
    case actions.GET_OBJECTS_NEARBY.START: {
      return {
        ...state,
        nearbyWobjects: {
          ...state.nearbyWobjects,
          isLoading: true,
        },
      };
    }

    case actions.GET_OBJECTS_NEARBY.SUCCESS: {
      return {
        ...state,
        nearbyWobjects: {
          ...state.nearbyWobjects,
          objects: action.payload,
          isLoading: false,
        },
      };
    }
    case GET_WOBJECT_EXPERTISE.START: {
      return {
        ...state,
        objectExpertise: {
          ...state.objectExpertise,
          isLoading: true,
        },
      };
    }
    case GET_WOBJECT_EXPERTISE.SUCCESS: {
      return {
        ...state,
        objectExpertise: {
          users: action.payload.users.map(userExpert => ({ ...userExpert, pending: false })),
          isLoading: false,
        },
      };
    }
    case GET_WOBJECT_EXPERTISE.ERROR: {
      return {
        ...state,
        objectExpertise: {
          users: [],
          isLoading: true,
        },
      };
    }
    case FOLLOW_UNFOLLOW_USER_WOBJECT_EXPERTISE.ERROR:
    case FOLLOW_UNFOLLOW_USER_WOBJECT_EXPERTISE.START: {
      return {
        ...state,
        objectExpertise: {
          ...state.objectExpertise,
          users: state.objectExpertise.users.map(item =>
            item.name === action.meta.userExpert ? { ...item, pending: !item.pending } : item,
          ),
        },
      };
    }
    case FOLLOW_UNFOLLOW_USER_WOBJECT_EXPERTISE.SUCCESS: {
      return {
        ...state,
        objectExpertise: {
          ...state.objectExpertise,
          users: state.objectExpertise.users.map(item =>
            item.name === action.meta.userExpert
              ? { ...item, youFollows: !item.youFollows, pending: !item.pending }
              : item,
          ),
        },
      };
    }
    case GET_RELATED_WOBJECT.START: {
      return {
        ...state,
        relatedWobjects: {
          ...state.relatedWobjects,
          isLoading: true,
        },
      };
    }
    case GET_RELATED_WOBJECT.SUCCESS: {
      const objects = action.payload.map(obj => ({ ...obj, parent: action.meta.wobject }));

      return {
        ...state,
        relatedWobjects: {
          ...state.relatedWobjects,
          objects: uniqBy([...state.relatedWobjects.objects, ...objects], 'author_permlink'),
          isLoading: false,
          skip: state.relatedWobjects.skip + 5,
          hasNext: action.payload.length === 5,
        },
      };
    }
    case GET_RELATED_WOBJECT.ERROR: {
      return {
        ...state,
        relatedWobjects: {
          ...state.relatedWobjects,
          isLoading: false,
          skip: state.relatedWobjects.skip + 5,
          hasNext: action.payload.length === 5,
        },
      };
    }

    case CLEAR_RELATED_OBJECTS:
      return {
        ...state,
        relatedWobjects: initialState.relatedWobjects,
      };
    default: {
      return state;
    }
  }
}

import * as actions from './wobjectsActions';
import * as appendAction from './appendActions';
import {
  GET_OBJECT_APPENDS,
  RATE_WOBJECT_SUCCESS,
  SEND_COMMENT_APPEND,
  VOTE_APPEND_ERROR,
  VOTE_APPEND_START,
  VOTE_APPEND_SUCCESS,
} from '../../client/object/wobjActions';
import { objectFields, TYPES_OF_MENU_ITEM } from '../../common/constants/listOfFields';

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
      if (action.payload.id && state.wobject.id !== action.payload.id) {
        return {
          ...state,
          wobject: {
            ...action.payload,
          },
          isFetching: false,
        };
      }

      return {
        ...state,
        wobject: {
          ...action.payload,
          fields: [...state.wobject.fields],
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
    case GET_OBJECT_APPENDS.SUCCESS: {
      let listFields =
        state.wobject &&
        state.wobject.fields &&
        state.wobject.fields.filter(field =>
          action.payload.find(f => f.permlink === field.permlink),
        );
      listFields = listFields.map(field => {
        const matchPost = action.payload.find(f => f.permlink === field.permlink);
        return {
          ...field,
          ...matchPost,
          author: field.author,
          fullBody: matchPost.body,
          body: field.body,
        };
      });

      return {
        ...state,
        wobject: {
          ...state.wobject,
          fields: [...listFields],
        },
      };
    }

    case appendAction.APPEND_WAIVIO_OBJECT.SUCCESS: {
      const { payload } = action;
      const date = new Date().toISOString().split('.')[0];

      const newField = {
        ...payload,
        active_votes: [
          {
            percent: 50,
            rshares_weight: 1,
            voter: payload.creator,
            weight: 1,
          },
        ],
        created: date,
        append_field_name: payload.name,
        append_field_weight: 1,
        author: payload.author,
        author_original: payload.author,
        author_rank: 0,
        author_reputation: 1039122303835,
        body: payload.body,
        fullBody: `@${payload.creator} added ${payload.name}(${payload.locale}): ${payload.body}`,
        category: 'waivio-object-type',
        children: 0,
        creator: payload.creator,
        curator_payout_value: '0.000 HBD',
        depth: 2,
        locale: payload.locale,
        name: payload.name,
        net_rshares: 0,
        parent_author: payload.author,
        parent_permlink: payload.parentPermlink,
        pending_payout_value: '0.000 HBD',
        percent_steem_dollars: 0,
        permlink: payload.permlink,
        promoted: '0.000 HBD',
        total_payout_value: '0.000 HBD',
        upvotedByModerator: false,
        url: `/waivio-object-type/@et42k/iqx-hashtag#@${payload.author_original}/${payload.permlink}`,
        weight: 1,
      };
      // check menu item appending; type uses for menuItems only. (type values: 'menuList' or 'menuPage')
      if (
        payload.name === 'listItem' &&
        [TYPES_OF_MENU_ITEM.LIST, TYPES_OF_MENU_ITEM.PAGE].includes(payload.type)
      ) {
        const menuItem = {
          author_permlink: payload.body,
          alias: payload.alias,
          name: payload.alias,
          object_type: payload.type.slice(4).toLowerCase(),
        };
        const menuItems = state.wobject.menuItems
          ? [...state.wobject.menuItems, menuItem]
          : [menuItem];
        return {
          ...state,
          wobject: {
            ...state.wobject,
            fields: [...state.wobject.fields, newField],
            menuItems,
          },
        };
      }

      return {
        ...state,
        wobject: {
          ...state.wobject,
          fields: [...state.wobject.fields, newField],
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

    case VOTE_APPEND_SUCCESS: {
      const matchPostIndex = state.wobject.fields.findIndex(
        field => field.permlink === action.payload.permlink,
      );
      const percent = action.payload.type === 'approve' ? 100 : -100;
      const voterIndex = action.payload.post.active_votes.findIndex(
        vote => vote.voter === action.payload.voter,
      );
      const newVoter = {
        voter: action.payload.voter,
        percent: action.payload.weight && percent,
        rshares_weight: 1,
        weight: action.payload.weight,
      };
      let list = [...action.payload.post.active_votes];

      if (voterIndex >= 0) {
        if (!action.payload.weight) {
          list.splice(voterIndex, 1);
        } else {
          list.splice(voterIndex, 1, newVoter);
        }
      } else {
        list = [...action.payload.post.active_votes, newVoter];
      }

      state.wobject.fields.splice(matchPostIndex, 1, {
        ...action.payload.post,
        type: action.payload.type,
        active_votes: list,
        loading: false,
        isLiked: action.payload.weight % 10 === 0 && action.payload.weight !== 0,
        isReject: action.payload.weight % 10 !== 0 && action.payload.weight !== 0,
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
    default: {
      return state;
    }
  }
}

export const getObjectState = state => state.wobject;
export const getObjectFetchingState = state => state.isFetching;
export const getObjectAuthor = state => state.author;
export const getObjectFields = state => state.wobject.fields || [];
export const getRatingFields = state =>
  getObjectFields(state).filter(field => field.name === objectFields.rating);
export const getObjectTagCategory = state => state.wobject.tagCategories;

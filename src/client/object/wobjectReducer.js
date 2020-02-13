import { get, isEmpty } from 'lodash';
import * as actions from './wobjectsActions';
import * as appendAction from './appendActions';
import { SET_USED_LOCALE } from '../app/appActions';
import { RATE_WOBJECT_SUCCESS } from '../../client/object/wobjActions';
import { objectFields, TYPES_OF_MENU_ITEM } from '../../common/constants/listOfFields';
import { getClientWObj } from '../adapters';

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
    case actions.GET_OBJECT_SUCCESS:
      return {
        ...state,
        wobject: action.payload,
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
      const { payload } = action;
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
            fields: [...state.wobject.fields, payload],
            menuItems,
          },
        };
      }

      return {
        ...state,
        wobject: {
          ...state.wobject,
          fields: [...state.wobject.fields, payload],
        },
      };
    }
    case SET_USED_LOCALE: {
      if (!isEmpty(state.wobject)) {
        const usedLocale = action.payload.id;
        return {
          ...state,
          wobject: getClientWObj(state.wobject, usedLocale),
        };
      }
      return state;
    }
    default: {
      return state;
    }
  }
}

export const getObjectState = state => state.wobject;
export const getObjectFetchingState = state => state.isFetching;
export const getObjectAuthor = state => state.author;
export const getObjectFields = state => get(state, ['wobject', 'fields'], []);
export const getRatingFields = state =>
  getObjectFields(state).filter(field => field.name === objectFields.rating);
export const getObjectChartId = state => state.chartid;

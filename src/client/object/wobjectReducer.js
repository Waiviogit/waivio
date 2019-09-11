import { find } from 'lodash';
import * as actions from './wobjectsActions';
import * as appendAction from './appendActions';
import { RATE_WOBJECT_SUCCESS } from '../../client/object/wobjActions';
import {objectFields as supportedFields, objectFields, TYPES_OF_MENU_ITEM} from '../../common/constants/listOfFields';
import { getClientWObj } from '../adapters';
import {getFieldWithMaxWeight} from "./wObjectHelper";

const initialState = {
  wobject: {},
  isFetching: false,
  chartId: '',
};

const getByChartId = wobj => getFieldWithMaxWeight(wobj, supportedFields.chartId);

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
        wobject: getClientWObj(action.payload),
        isFetching: false,
        chartId: getByChartId(action.payload),
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
      if (payload.name === 'listItem') {
        const listItemsKey =
          payload.type === TYPES_OF_MENU_ITEM.PAGE || payload.type === TYPES_OF_MENU_ITEM.LIST
            ? 'menuItems'
            : 'listItems';
        const listItems = state.wobject[listItemsKey]
          ? [...state.wobject[listItemsKey], payload]
          : [payload];
        return {
          ...state,
          wobject: {
            ...state.wobject,
            fields: [...state.wobject.fields, payload],
            [listItemsKey]: listItems,
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
    default: {
      return state;
    }
  }
}

export const getObjectState = state => state.wobject;
export const getObjectAuthor = state => state.author;
export const getObjectFields = state => state.wobject.fields;
export const getRatingFields = state =>
  getObjectFields(state).filter(field => field.name === objectFields.rating);
export const getObjectChartId = state => state.chartId;

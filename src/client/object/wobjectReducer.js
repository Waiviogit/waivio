import * as actions from './wobjectsActions';

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
    default: {
      return state;
    }
  }
}

export const getObjectState = state => state.wobject;
export const getObjectAuthor = state => state.author;
export const getObjectFields = state => state.wobject.fields;

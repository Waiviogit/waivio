import { GET_DRAFTS_LIST, DELETE_DRAFT, SAVE_DRAFT, SET_CURRENT_DRAFT } from './draftsActions';

const initialState = {
  loading: false,
  drafts: [],
  currentDraft: null,
};

const draftsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DRAFTS_LIST.START:
      return {
        ...state,
        loading: true,
      };

    case GET_DRAFTS_LIST.SUCCESS:
      return {
        ...state,
        loading: false,
        drafts: [...action.payload.result],
      };

    case SAVE_DRAFT.SUCCESS:
      return {
        ...state,
        loading: false,
        drafts: [...action.payload],
      };

    case GET_DRAFTS_LIST.ERROR:
      return {
        ...state,
        loading: false,
      };

    case DELETE_DRAFT.START:
      return {
        ...state,
        pendingDrafts: action.meta.ids,
      };

    case DELETE_DRAFT.ERROR:
      return {
        ...state,
        pendingDrafts: [],
      };

    case DELETE_DRAFT.SUCCESS:
      return {
        ...state,
        loading: false,
        drafts: state.drafts.filter(draft => !action.meta.ids.includes(draft.draftId)),
        pendingDrafts: [],
      };

    case SET_CURRENT_DRAFT:
      return {
        ...state,
        currentDraft: action.payload,
      };

    default:
      return state;
  }
};

export default draftsReducer;

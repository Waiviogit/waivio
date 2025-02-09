import { setInitialObjPercentsNew } from '../../common/helpers/wObjInfluenceHelper';
import { SET_LINKED_OBJ, SET_LINKED_OBJS } from '../slateEditorStore/editorActions';
import {
  GET_DRAFTS_LIST,
  DELETE_DRAFT,
  SAVE_DRAFT,
  SET_CURRENT_DRAFT,
  RESET_LINKED_OBJECTS,
  SET_OBJECT_PERCENT,
} from './draftsActions';

const initialState = {
  loading: false,
  drafts: [],
  currentDraft: null,
  linkedObjects: [],
  linkedObjectPermlinks: [],
  hideObjectPermlinks: [],
  objectPercent: {},
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

    case SET_CURRENT_DRAFT: {
      if (!action.payload)
        return {
          ...state,
          currentDraft: null,
          linkedObjects: [],
          linkedObjectPermlinks: [],
          objectPercent: [],
        };
      const linkedObjects = action.payload.jsonMetadata?.linkedObjects || [];

      return {
        ...state,
        currentDraft: action.payload,
        linkedObjects,
        linkedObjectPermlinks: linkedObjects.map(obj => obj.author_permlink) || [],
        objectPercent: setInitialObjPercentsNew(linkedObjects),
      };
    }
    case SET_LINKED_OBJ: {
      const linkedObjects = [...state.linkedObjects, action.payload];

      return {
        ...state,
        linkedObjects,
        linkedObjectPermlinks: [...state.linkedObjectPermlinks, action.payload?.author_permlink],
        objectPercent: setInitialObjPercentsNew(linkedObjects),
      };
    }

    case SET_OBJECT_PERCENT: {
      return {
        ...state,
        objectPercent: {
          ...action.payload,
        },
      };
    }

    case SET_LINKED_OBJS: {
      return {
        ...state,
        linkedObjects: [...state.linkedObjects, ...action.payload],
        linkedObjectPermlinks: [
          ...state.linkedObjectPermlinks,
          action.payload.map(obj => obj.author_permlink),
        ],
      };
    }

    case RESET_LINKED_OBJECTS: {
      return {
        ...state,
        linkedObjects: [],
        linkedObjectPermlinks: [],
        hideObjectPermlinks: [],
      };
    }

    default:
      return state;
  }
};

export default draftsReducer;

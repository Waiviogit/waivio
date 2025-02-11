import { uniqBy } from 'lodash';
import { setInitialObjPercentsNew } from '../../common/helpers/wObjInfluenceHelper';
import {
  SET_LINKED_OBJ,
  SET_LINKED_OBJS,
  SET_CAMPAIGN_LINKED_OBJS,
  SET_CAMPAIGN,
} from '../slateEditorStore/editorActions';
import {
  GET_DRAFTS_LIST,
  DELETE_DRAFT,
  SAVE_DRAFT,
  SET_CURRENT_DRAFT,
  RESET_LINKED_OBJECTS,
  SET_OBJECT_PERCENT,
  TOGGLE_LINKED_OBJ,
} from './draftsActions';

const initialState = {
  loading: false,
  drafts: [],
  currentDraft: null,
  linkedObjects: [],
  objectPercent: {},
  campaign: null,
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

    case SET_CAMPAIGN: {
      return {
        ...state,
        campaign: action.payload,
      };
    }

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
          objectPercent: [],
        };

      const linkedObjects =
        uniqBy(action.payload.jsonMetadata?.linkedObjects, 'author_permlink') || [];

      return {
        ...state,
        currentDraft: action.payload,
        campaign: null,
        objectPercent: linkedObjects.reduce((acc, curr) => {
          acc[curr.author_permlink] = { percent: curr.percent };

          return acc;
        }, {}),
      };
    }

    case SET_LINKED_OBJ: {
      const linkedObjects = uniqBy([...state.linkedObjects, action.payload], 'author_permlink');

      return {
        ...state,
        linkedObjects,
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

    case SET_LINKED_OBJS:
    case SET_CAMPAIGN_LINKED_OBJS: {
      const linkedObjects = uniqBy([...state.linkedObjects, ...action.payload], 'author_permlink');

      return {
        ...state,
        linkedObjects,
        objectPercent: setInitialObjPercentsNew(linkedObjects),
      };
    }

    case RESET_LINKED_OBJECTS: {
      return {
        ...state,
        linkedObjects: [],
        objectPercent: [],
      };
    }

    case TOGGLE_LINKED_OBJ: {
      return {
        ...state,
        linkedObjects: action.payload.linkedObjects,
        objectPercent: action.payload.objPercentage,
      };
    }

    default:
      return state;
  }
};

export default draftsReducer;

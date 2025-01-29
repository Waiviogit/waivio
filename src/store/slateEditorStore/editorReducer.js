import { get, isNil, uniqBy } from 'lodash';
import * as editorActions from './editorActions';

const defaultState = {
  loading: false,
  error: null,
  success: false,
  saving: false,
  pendingDrafts: [],
  editedPosts: [],
  importObject: {},
  loadingImg: false,
  editor: {},
  editorSlate: {},
  editorExtended: {
    wordForCountWidth: '',
    searchSelectionState: {},
    searchCoordinates: {},
    isShowEditorSearch: false,
    isMounted: false,
    editorEnabled: false,
    prevEditorState: null,
    editorState: [],
    titleValue: '',
  },
  linkedObjects: [],
};

const editor = (state = defaultState, action) => {
  switch (action.type) {
    case editorActions.SET_IMPORT_OBJECT:
      return {
        ...state,
        importObject: action.payload,
      };

    case editorActions.CREATE_POST_START:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };
    case editorActions.CREATE_POST_ERROR:
      return {
        ...state,
        error: action.payload?.result || null,
        loading: false,
        success: false,
      };
    case editorActions.CREATE_POST_SUCCESS:
      return {
        ...state,
        error: null,
        success: true,
      };
    case editorActions.UPLOAD_IMG_START:
      return {
        ...state,
        loadingImg: true,
      };
    case editorActions.UPLOAD_IMG_FINISH:
      return {
        ...state,
        loadingImg: false,
      };
    case editorActions.SET_EDITOR_STATE:
      return {
        ...state,
        editor: action.payload,
        editorExtended: {
          ...state.editorExtended,
          isShowEditorSearch: false,
          titleValue: action.payload.draftContent.title,
        },
      };
    case editorActions.SET_UPDATED_EDITOR_DATA: {
      const updatedState = { ...state, editor: { ...state.editor, ...action.payload } };

      return {
        ...updatedState,
        editor: {
          ...updatedState.editor,
          linkedObjects: uniqBy(get(updatedState, 'editor.linkedObjects', []), '_id'),
        },
      };
    }
    case editorActions.SET_LINKED_OBJ: {
      return {
        ...state,
        editor: {
          ...state.editor,
          linkedObjects: [...state.editor.linkedObjects, action.payload],
        },
        linkedObjects: [...state.linkedObjects, action.payload],
      };
    }
    case editorActions.SET_UPDATED_EDITOR_EXTENDED_DATA:
      return {
        ...state,
        editorExtended: { ...state.editorExtended, ...action.payload },
        editor: {
          ...state.editor,
          linkedObjects: uniqBy(get(state, 'editor.linkedObjects', []), '_id'),
        },
      };
    case editorActions.SET_IS_SHOW_EDITOR_SEARCH:
      return {
        ...state,
        editorExtended: {
          ...state.editorExtended,
          isShowEditorSearch: action.payload,
        },
      };
    case editorActions.SET_SEARCH_COORDINATES:
      return {
        ...state,
        editorExtended: {
          ...state.editorExtended,
          searchString: action.payload.searchString,
          searchCoordinates: action.payload.selectionBoundary,
          searchSelectionState: action.payload.selectionState,
          wordForCountWidth: action.payload.wordForCountWidth,
          isShowEditorSearch: isNil(action.payload.isShowEditorSearch)
            ? state.editorExtended.isShowEditorSearch
            : action.payload.isShowEditorSearch,
        },
      };
    case editorActions.SET_EDITOR_EXTENDED_STATE:
      return {
        ...state,
        editorExtended: {
          ...state.editorExtended,
          editorState: action.payload,
          prevEditorState: state.editorExtended.editorState,
        },
      };
    case editorActions.SET_CLEAR_STATE:
      return defaultState;
    case editorActions.CLEAR_EDITOR_SEARCH_OBJECTS:
      return {
        ...state,
        editorExtended: {
          ...state.editorExtended,
          wordForCountWidth: '',
          searchSelectionState: {},
          searchCoordinates: {},
          isShowEditorSearch: false,
        },
      };
    case editorActions.SET_EDITOR:
      return {
        ...state,
        editorSlate: action.payload.editor,
      };
    case editorActions.LEAVE_EDITOR:
      return defaultState;
    default:
      return state;
  }
};

export default editor;

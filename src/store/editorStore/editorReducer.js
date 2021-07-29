import { EditorState } from 'draft-js';
import { get, isNil, uniqBy } from 'lodash';
import * as editorActions from './editorActions';
import * as postActions from '../postsStore/postActions';
import * as authActions from '../authStore/authActions';
import { GET_USER_METADATA } from '../usersStore/usersActions';
import { defaultDecorators } from '../../client/components/EditorExtended/model/content';
import { createEditorState, fromMarkdown } from '../../client/components/EditorExtended';

const defaultState = {
  loading: false,
  error: null,
  success: false,
  saving: false,
  draftPosts: [],
  pendingDrafts: [],
  editedPosts: [],
  loadingImg: false,
  editor: {},
  editorExtended: {
    wordForCountWidth: '',
    searchSelectionState: {},
    searchCoordinates: {},
    isShowEditorSearch: false,
    isMounted: false,
    editorEnabled: false,
    prevEditorState: null,
    editorState: EditorState.createEmpty(defaultDecorators),
    titleValue: '',
  },
};

const editor = (state = defaultState, action) => {
  switch (action.type) {
    case editorActions.ADD_EDITED_POST:
      return {
        ...state,
        editedPosts: [...state.editedPosts, action.payload],
      };
    case postActions.GET_CONTENT.SUCCESS:
      return {
        ...state,
        editedPosts: state.editedPosts.filter(post => post !== action.payload.permlink),
      };
    case editorActions.DELETE_EDITED_POST:
      return {
        ...state,
        editedPosts: state.editedPosts.filter(post => post !== action.payload),
      };
    case authActions.LOGIN_SUCCESS:
      if (action.meta && action.meta.refresh) return state;

      return {
        ...state,
        draftPosts: get(action, ['payload', 'userMetaData', 'drafts'], defaultState.draftPosts),
      };
    case GET_USER_METADATA.SUCCESS:
      if (action.payload && action.payload.drafts) {
        return {
          ...state,
          draftPosts: action.payload.drafts,
        };
      }

      return state;
    case editorActions.NEW_POST:
      return {
        ...state,
        loading: false,
        error: null,
        success: false,
        loadingImg: false,
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
        error: action.payload.result,
        loading: false,
        success: false,
      };
    case editorActions.CREATE_POST_SUCCESS:
      return {
        ...state,
        error: null,
        success: true,
      };
    case editorActions.SAVE_DRAFT_START:
      return {
        ...state,
        saving: true,
        editor: {
          ...state.editor,
          linkedObjects: uniqBy(get(state, 'editor.linkedObjects', []), '_id'),
        },
      };
    case editorActions.SAVE_DRAFT_SUCCESS:
      return {
        ...state,
        draftPosts: [
          ...state.draftPosts.filter(d => d.draftId !== action.meta.postId),
          action.payload,
        ],
        saving: false,
      };
    case editorActions.SAVE_DRAFT_ERROR:
      return {
        ...state,
        saving: false,
      };
    case editorActions.DELETE_DRAFT_START:
      return {
        ...state,
        pendingDrafts: [...state.pendingDrafts, ...action.meta.ids],
      };
    case editorActions.DELETE_DRAFT_SUCCESS: {
      return {
        ...state,
        draftPosts: action.payload,
        pendingDrafts: state.pendingDrafts.filter(id => !action.meta.ids.includes(id)),
      };
    }
    case editorActions.DELETE_DRAFT_ERROR:
      return {
        ...state,
        pendingDrafts: state.pendingDrafts.filter(id => !action.meta.ids.includes(id)),
      };
    case editorActions.DELETE_DRAFT_OBJECT.START:
      return {
        ...state,
      };
    case editorActions.DELETE_DRAFT_OBJECT.SUCCESS: {
      return {
        ...state,
        draftPosts: action.payload,
      };
    }
    case editorActions.DELETE_DRAFT_OBJECT.ERROR:
      return {
        ...state,
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
          editorState: EditorState.moveFocusToEnd(
            createEditorState(fromMarkdown(action.payload.draftContent)),
          ),
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
    case editorActions.LEAVE_EDITOR:
      return {
        ...defaultState,
        draftPosts: state.draftPosts,
      };
    default:
      return state;
  }
};

export default editor;

import { EditorState } from "draft-js";
import { get } from 'lodash';
import * as editorActions from './editorActions';
import * as postActions from '../postsStore/postActions';
import * as authActions from '../authStore/authActions';
import { GET_USER_METADATA } from '../usersStore/usersActions';
import { defaultDecorators } from "../../components/EditorExtended/EditorExtendedComponent/EditorExtended";

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
      return { ...state, editor: action.payload };
    case editorActions.SET_UPDATED_EDITOR_DATA:
      return { ...state, editor: {...state.editor, ...action.payload} };
    default:
      return state;
  }
};

export default editor;

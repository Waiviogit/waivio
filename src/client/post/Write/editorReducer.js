import _ from 'lodash';
import * as authActions from '../../auth/authActions';
import * as editorActions from './editorActions';
import * as postActions from '../postActions';

const defaultState = {
  loading: false,
  error: null,
  success: false,
  saving: false,
  draftPosts: {},
  pendingDrafts: [],
  editedPosts: [],
  loadingImg: false,
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
        draftPosts: _.get(action, 'payload.user_metadata.drafts', defaultState.draftPosts),
      };
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
        loading: false,
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
        draftPosts: { ...state.draftPosts, [action.meta.postId]: action.payload },
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
    default:
      return state;
  }
};

export default editor;

export const getDraftPosts = state => state.draftPosts;
export const getIsEditorLoading = state => state.loading;
export const getIsEditorSaving = state => state.saving;
export const getPendingDrafts = state => state.pendingDrafts;
export const getIsPostEdited = (state, permlink) => state.editedPosts.includes(permlink);
export const getIsImgLoading = state => state.loadingImg;

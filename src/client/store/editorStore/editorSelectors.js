import { createSelector } from 'reselect';

// selector
export const editorState = state => state.editor;

// reselect function
export const getDraftPosts = createSelector([editorState], state => state.draftPosts);

export const getIsEditorLoading = createSelector([editorState], state => state.loading);

export const getIsEditorSaving = createSelector([editorState], state => state.saving);

export const getPendingDrafts = createSelector([editorState], state => state.pendingDrafts);

export const getIsPostEdited = createSelector(editorState, (state, permlink) =>
  state.editedPosts.includes(permlink),
);

export const getIsImageUploading = createSelector([editorState], state => state.loadingImg);

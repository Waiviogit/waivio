import { createSelector } from 'reselect';
import { find, filter, uniqBy } from 'lodash';

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

export const getEditor = createSelector([editorState], state => state.editor);

export const getLinkedObjects = createSelector([getEditor], state => state.linkedObjects);

export const getEditorDraftId = createSelector([getEditor], state => state.draftIdEditor);

export const getCurrentDraft = createSelector(
  getDraftPosts,
  (state, props) => props.draftId,
  (draftPosts, draftId) => draftPosts.find(d => d.draftId === draftId),
);

export const getEditorLinkedObjects = createSelector(getEditor, state => state.linkedObjects || []);

export const getEditorLinkedObjectsCards = createSelector(
  getEditor,
  state => state.hideLinkedObjects || [],
);

export const getFilteredObjectCards = createSelector(getEditor, editor =>
  uniqBy(filter(
    editor.linkedObjects,
    object => object && !find(editor.hideLinkedObjects, { _id: object && object._id }),
  ), '_id'),
);

export const getEditorExtended = createSelector([editorState], state => state.editorExtended);

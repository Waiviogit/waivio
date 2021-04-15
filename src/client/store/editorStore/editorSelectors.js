import { createSelector } from 'reselect';
import { find, filter } from "lodash";

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

export const getEditorLinkedObjects = createSelector(
  getEditor,
  state => state.linkedObjects,
);

export const getEditorLinkedObjectsCards = createSelector(
  getEditor,
  state => state.linkedObjectsCards,
);

export const getFilteredObjectCards = createSelector(
  getEditorLinkedObjects,
  getEditorLinkedObjectsCards,
  (linkedObjects, linkedObjectsCards) => filter(linkedObjects,
      object => !find(linkedObjectsCards, {_id: object._id}),
    )
);

import { createSelector } from 'reselect';
import { find, filter, uniqBy, get } from 'lodash';

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
export const getEditorSlate = createSelector([editorState], state => state.editorSlate);

export const getLinkedObjects = createSelector([getEditor], state => state.linkedObjects);

export const getEditorDraftBody = createSelector([getEditor], state => state.draftContent.body);

export const getCurrentDraft = (state, { draftId }) => {
  const draftPosts = getDraftPosts(state);

  return draftPosts.find(d => d.draftId === draftId);
};

export const getEditorLinkedObjects = createSelector(getEditor, state =>
  get(state, 'linkedObjects', []),
);

export const getEditorLinkedObjectsCards = createSelector(getEditor, state =>
  get(state, 'hideLinkedObjects', []),
);

export const getEditorDraftId = createSelector(getEditor, state => get(state, 'draftId', null));

export const getFilteredObjectCards = createSelector(getEditor, editor =>
  uniqBy(
    filter(
      editor.linkedObjects,
      object => object && !find(editor.hideLinkedObjects, { _id: object && object._id }),
    ),
    '_id',
  ),
);

export const getEditorExtended = createSelector([editorState], state => state.editorExtended);

export const getSearchCoordinates = createSelector(
  [getEditorExtended],
  state => state.searchCoordinates,
);

export const getEditorExtendedState = createSelector(
  [getEditorExtended],
  state => state.editorState,
);

export const getEditorExtendedSelectionState = createSelector(
  [getEditorExtended],
  state => state.searchSelectionState,
);

export const getEditorExtendedIsShowSearch = createSelector(
  [getEditorExtended],
  state => state.isShowEditorSearch,
);

export const getSearchString = createSelector([getEditorExtended], state => state.searchString);

export const getWordForCountWidth = createSelector(
  [getEditorExtended],
  state => state.wordForCountWidth,
);

export const getTitleValue = createSelector([getEditorExtended], state => state.titleValue);

import { createSelector } from 'reselect';
import { filter, uniqBy, get } from 'lodash';

// selector
export const editorState = state => state.editor;

// reselect function
export const getImportObject = createSelector([editorState], state => state.importObject);

export const getIsEditorLoading = createSelector([editorState], state => state.loading);

export const getIsEditorSaving = createSelector([editorState], state => state.saving);

export const getIsImageUploading = createSelector([editorState], state => state.loadingImg);

export const getEditor = createSelector([editorState], state => state.editor);
export const getEditorSlate = createSelector([editorState], state => state.editorSlate);

export const getLinkedObjects = createSelector([getEditor], state => state.linkedObjects);

export const getEditorDraftBody = createSelector(
  [getEditor],
  state => state.draftContent?.body || '',
);

export const getEditorLinkedObjects = createSelector(getEditor, state =>
  get(state, 'linkedObjects', []),
);

export const getEditorLinkedObjectsCards = createSelector(getEditor, state =>
  get(state, 'hideLinkedObjects', []),
);

export const getFilteredObjectCards = createSelector(getEditor, editor =>
  uniqBy(
    filter(editor.linkedObjects, object => object),
    '_id',
  ),
);

export const getEditorExtended = createSelector([editorState], state => state.editorExtended);

export const getSearchCoordinates = createSelector(
  [getEditorExtended],
  state => state.searchCoordinates,
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

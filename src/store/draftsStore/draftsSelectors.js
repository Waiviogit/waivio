import { createSelector } from 'reselect';
import { parseJSON } from '../../common/helpers/parseJSON';

export const getDraftSelector = state => state.draftsStore;

export const getDraftPostsSelector = createSelector([getDraftSelector], state => state.drafts);
export const getDraftLoadingSelector = createSelector([getDraftSelector], state => state.loading);
export const getPendingDraftSelector = createSelector(
  [getDraftSelector],
  state => state.pendingDrafts,
);

export const getCurrentDraftSelector = (state, { draftId }) => {
  const draftPosts = getDraftPostsSelector(state);

  return draftPosts.find(d => d.draftId === draftId);
};

export const getCurrDraftSelector = createSelector([getDraftSelector], state => state.currentDraft);
export const getLinkedObjectPermlinks = createSelector(
  [getDraftSelector],
  state => state.linkedObjectPermlinks,
);
export const getLinkedObjects = createSelector([getDraftSelector], state => state.linkedObjects);
export const getHideObjectPermlinks = createSelector(
  [getDraftSelector],
  state => state.hideObjectPermlinks,
);

export const getObjectPercentageSelector = createSelector(
  [getDraftSelector],
  state => state.objectPercent,
);

export const getLinkedObjFromDraft = (state, { draftId }) => {
  const draftPosts = getCurrentDraftSelector(state, { draftId });

  // console.log(draftPosts);
  return parseJSON(draftPosts?.jsonMetadata)?.linkedObjects || [];
};

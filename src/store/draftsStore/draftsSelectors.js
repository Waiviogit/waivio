import { createSelector } from 'reselect';

export const getDraftSelector = state => state.draftsStore;

export const getDraftPostsSelector = createSelector([getDraftSelector], state => state.drafts);
export const getCurrentDraftDataSelector = createSelector(
  [getDraftSelector],
  state => state.currentDraftData,
);
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

export const getLinkedObjects = createSelector([getDraftSelector], state => state.linkedObjects);
export const getCurrentCampaignSelector = createSelector(
  [getDraftSelector],
  state => state.campaign,
);

export const getObjectPercentageSelector = createSelector(
  [getDraftSelector],
  state => state.objectPercent,
);

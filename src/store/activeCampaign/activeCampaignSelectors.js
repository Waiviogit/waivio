import { createSelector } from 'reselect';

// Base selector
const activeCampaignState = state => state.activeCampaign;

export const getSelectActiveCampaigns = createSelector(
  [activeCampaignState],
  state => state.activeCampaigns,
);

export const getSelectActiveCampaignsTypes = createSelector(
  [activeCampaignState],
  state => state.activeCampaignTypes,
); // Derived selectors

export const getSelectActiveCampaignHasMore = createSelector(
  [activeCampaignState],
  state => state.hasMore,
);

export const getSelectIsLoadingActiveCampaigns = createSelector(
  [activeCampaignState],
  state => state.isLoading,
);

export const getSelectActiveCampaignError = createSelector(
  [activeCampaignState],
  state => state.error,
);

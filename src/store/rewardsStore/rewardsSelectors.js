import { createSelector } from 'reselect';

// selector
export const rewardsState = state => state.rewards;

// reselect function
export const getSingleReportData = createSelector([rewardsState], state => state.singleReportData);
export const getGlobalReportData = createSelector([rewardsState], state => state.globalReportData);
export const getTabType = createSelector([rewardsState], state => state.tabType);
export const getHasReceivables = createSelector([rewardsState], state => state.hasReceivables);
export const getCountTookPartCampaigns = createSelector(
  [rewardsState],
  state => state.countTookPartCampaigns,
);
export const getCreatedCampaignsCount = createSelector(
  [rewardsState],
  state => state.createdCampaignsCount,
);
export const getCommentsFromReserved = createSelector(
  [rewardsState],
  state => state.reservedComments,
);
export const getSponsorsRewards = createSelector([rewardsState], state => state.followingRewards);
export const getFraudSuspicionDataState = createSelector(
  [rewardsState],
  state => state.fraudSuspicionData,
);
export const getHasMoreFollowingRewards = createSelector(
  [rewardsState],
  state => state.hasMoreFollowingRewards,
);
export const getHasMoreFraudSuspicionData = createSelector(
  [rewardsState],
  state => state.hasMoreFraudSuspicionData,
);
export const getIsLoading = createSelector([rewardsState], state => state.loading);
export const getIsLoadingRewardsHistory = createSelector(
  [rewardsState],
  state => state.isLoadingRewardsHistory,
);
export const getCampaignNames = createSelector([rewardsState], state => state.campaignNames);
export const getHistoryCampaigns = createSelector([rewardsState], state => state.historyCampaigns);
export const getHistorySponsors = createSelector([rewardsState], state => state.historySponsors);
export const getHasMoreHistory = createSelector([rewardsState], state => state.hasMoreHistory);
export const getIsOpenWriteReviewModal = createSelector(
  [rewardsState],
  state => state.isOpenWriteReviewModal,
);
export const getExpiredPayment = createSelector([rewardsState], state => state.expiredPayment);
export const getMatchBotsSelector = createSelector([rewardsState], state => state.matchBots);

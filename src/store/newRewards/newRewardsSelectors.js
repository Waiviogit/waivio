import { createSelector } from 'reselect';

// selector
export const newRewardsState = state => state.newRewards;

// reselect function
export const getRewards = createSelector([newRewardsState], state => state.rewards);
export const getRewardsHasMore = createSelector([newRewardsState], state => state.hasMore);
export const getRewardsHasLoading = createSelector([newRewardsState], state => state.loading);

import { createSelector } from 'reselect';

// selector
export const newRewardsState = state => state.newRewards;

// reselect function
export const getRewards = createSelector([newRewardsState], state => state.rewards);
export const getRequiredObject = createSelector([newRewardsState], state => state.requiredObject);
export const getActivationPermlink = createSelector(
  [newRewardsState],
  state => state.activationPermlink,
);
export const getRewardsHasMore = createSelector([newRewardsState], state => state.hasMore);
export const getRewardsHasLoading = createSelector([newRewardsState], state => state.loading);

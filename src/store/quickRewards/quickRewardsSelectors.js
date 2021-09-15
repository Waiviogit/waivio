import { createSelector } from 'reselect';

export const quickRewardsState = state => state.quickRewards;

export const getSelectedRestaurant = createSelector(
  [quickRewardsState],
  state => state.selectedRest,
);

export const getSelectedDish = createSelector([quickRewardsState], state => state.selectedDish);

export const getEligibleRewardsListFromState = createSelector(
  [quickRewardsState],
  state => state.eligibleRestList,
);

export const getDishRewardsListFromState = createSelector(
  [quickRewardsState],
  state => state.eligibleDishFromRest,
);

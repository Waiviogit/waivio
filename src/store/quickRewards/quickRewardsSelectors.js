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
export const getMoreEligibleRewardsListFromState = createSelector(
  [quickRewardsState],
  state => state.eligibleRestList,
);

export const getIsOpenModal = createSelector([quickRewardsState], state => state.isOpen);

export const getDishRewardsListFromState = createSelector(
  [quickRewardsState],
  state => state.eligibleDishFromRest,
);

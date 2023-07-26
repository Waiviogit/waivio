import { createSelector } from 'reselect';

// selector
export const affiliateObjectsState = state => state.affiliateCodes;

// reselect function
export const getAffiliateObjects = createSelector([affiliateObjectsState], state => state.objects);

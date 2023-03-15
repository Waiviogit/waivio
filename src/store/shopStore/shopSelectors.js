import { createSelector } from 'reselect';

// selector
export const shopState = state => state.shop;

export const getBreadCrumbsFromState = createSelector([shopState], state => state.crumbs);

export const getActiveBreadCrumb = createSelector([shopState], state => state.activeCrumb);

export const getExcludedDepartment = createSelector([shopState], state => state.excluded);

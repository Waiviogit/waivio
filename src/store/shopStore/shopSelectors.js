import { createSelector } from 'reselect';

// selector
export const shopState = state => state.shop;

export const getBreadCrumbsFromState = createSelector([shopState], state => state.crumbs);

export const getActiveBreadCrumb = createSelector([shopState], state => state.activeCrumb);

export const getDepartmentsList = createSelector([shopState], state => state.departmentsList);

export const getShopList = createSelector([shopState], state => state.shopList);

export const getShopListHasMore = createSelector([shopState], state => state.shopListHasMore);

export const getExcludedDepartment = createSelector([shopState], state => state.excluded);
export const getIsOptionClicked = createSelector([shopState], state => state.isOptionClicked);

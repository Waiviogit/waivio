// import { createSelector } from 'reselect';
//
// // selector
// const dynamicListState = state => state.dynamicList;

export const getDynamicList = (state, type) =>
  state.dynamicList[type] || { list: [], hasMore: false };
export const getDynamicListLoading = state => state.dynamicList.loading;

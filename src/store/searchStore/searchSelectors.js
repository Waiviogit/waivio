import { get, isEmpty, size } from 'lodash';
import { createSelector } from 'reselect';

// selector
export const searchState = state => state.search;

// reselect function
export const getSearchLoading = createSelector([searchState], state => state.loading);

export const getSearchResults = createSelector([searchState], state => state.searchResults);

export const getAutoCompleteSearchResults = createSelector(
  [searchState],
  state => state.autoCompleteSearchResults,
);

export const getSearchObjectsResults = createSelector(
  [searchState],
  state => state.searchObjectsResults,
);

export const getSearchUsersResults = createSelector(
  [searchState],
  state => state.searchUsersResults,
);

export const getSearchUsersResultsQuantity = createSelector([getSearchUsersResults], state =>
  size(state),
);

export const getSearchUsersResultsForDiscoverPage = createSelector(
  [searchState],
  state => state.usersForDiscoverPage,
);

export const searchObjectTypesResults = createSelector(
  [searchState],
  state => state.searchObjectTypesResults,
);

export const getBeneficiariesUsers = createSelector(
  [searchState],
  state => state.beneficiariesUsers,
);

export const getIsStartSearchAutoComplete = createSelector(
  [searchState],
  state => state.isStartSearchAutoComplete,
);

export const getIsStartSearchUser = createSelector([searchState], state => state.isStartSearchUser);

export const getIsStartSearchObject = createSelector(
  [searchState],
  state => state.isStartSearchObject,
);

export const getIsClearSearchObjects = createSelector(
  [searchState],
  state => state.isClearSearchObjects,
);

export const getWebsiteSearchType = createSelector([searchState], state => state.websiteSearchType);

export const getWebsiteSearchResult = createSelector(
  [searchState],
  state => state.websiteSearchResult,
);

export const getWebsiteSearchResultQuantity = createSelector([getWebsiteSearchResult], state =>
  size(state),
);

export const getHasMoreObjects = createSelector([searchState], state => state.hasMoreObjects);

export const getHasMoreUsers = createSelector([searchState], state => state.hasMoreUsers);

export const getSearchFilters = createSelector([searchState], state => get(state, 'filters', []));

export const getWebsiteSearchString = createSelector([searchState], state =>
  get(state, 'websiteSearchString', []),
);

export const getSearchFiltersTagCategory = createSelector([searchState], state =>
  get(state, 'tagCategory', []),
);

export const tagsCategoryIsEmpty = createSelector(
  [getSearchFiltersTagCategory],
  state => !isEmpty(state),
);

export const getSearchSort = createSelector([searchState], state => get(state, 'sort', ''));

export const getWebsiteSearchResultLoading = createSelector([searchState], state =>
  get(state, 'websiteSearchResultLoading', false),
);

export const getShowSearchResult = createSelector([searchState], state =>
  get(state, 'showSearchResult', ''),
);

export const getAllSearchLoadingMore = createSelector([searchState], state =>
  get(state, 'allSearchLoadingMore', ''),
);

export const getWebsiteMap = createSelector([searchState], state => get(state, 'websiteMap', ''));

export const getHasMoreObjectsForWebsite = createSelector([searchState], state =>
  get(state, 'hasMoreObjectsForWebsite'),
);

export const getSearchInBox = createSelector([searchState], state =>
  get(state, 'searchInBox', true),
);

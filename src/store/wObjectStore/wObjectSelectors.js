import { get } from 'lodash';
import { createSelector } from 'reselect';

// selector
export const objectState = state => state.object;

// reselect function
export const getObject = createSelector([objectState], state => state.wobject);

export const getObjectFields = createSelector([getObject], state => get(state, 'fields', []));

export const getObjectAdmins = createSelector([getObject], state => get(state, 'admins', []));

export const getObjectModerators = createSelector([getObject], state =>
  get(state, 'moderators', []),
);

export const getRatingFields = createSelector([getObject], state => get(state, 'rating', []));

export const getObjectTagCategory = createSelector([getObject], state => state.tagCategory);

export const getWobjectIsFailed = createSelector([getObject], state => state.isFailed);

export const getWobjectIsFatching = createSelector([getObject], state => state.isFetching);

export const getBreadCrumbs = createSelector([objectState], state => state.breadcrumb);

export const getShopBreadCrumbs = createSelector([objectState], state => state.shopBreadcrumbs);

export const getWobjectNested = createSelector([objectState], state => state.nestedWobject);

export const getWobjectAuthors = createSelector([objectState], state => state.authors);

export const getObjectLists = createSelector([objectState], state => state.lists);

export const getLoadingFlag = createSelector([objectState], state => state.isLoadingFlag);

export const getObjectAuthor = createSelector([objectState], state => state.author);

export const getObjectFetchingState = createSelector([objectState], state => state.isFetching);

export const getObjectFollowersState = createSelector([objectState], state => state.followers);

export const getObjectFollowersUsers = createSelector(
  [getObjectFollowersState],
  state => state.users,
);

export const getObjectFollowersHasMore = createSelector(
  [getObjectFollowersState],
  state => state.hasMore,
);

export const getObjectsNearby = createSelector([objectState], state => state.nearbyWobjects);

export const getObjectsNearbyArray = createSelector([getObjectsNearby], state =>
  get(state, 'objects', []),
);

export const getObjectsNearbyIsLoading = createSelector([getObjectsNearby], state =>
  get(state, 'isLoading', true),
);

export const getObjectExpertise = createSelector([objectState], state => state.objectExpertise);

export const getObjectExpertiseUsers = createSelector([getObjectExpertise], state =>
  get(state, 'users', []),
);

export const getObjectExpertiseIsLoading = createSelector([getObjectExpertise], state =>
  get(state, 'isLoading', true),
);

export const getRelatedObjects = createSelector([objectState], state => state.relatedWobjects);

export const getRelatedObjectsSkip = createSelector([getRelatedObjects], state =>
  get(state, 'skip', 0),
);

export const getRelatedObjectsHasNext = createSelector([getRelatedObjects], state =>
  get(state, 'hasNext', false),
);

export const getRelatedObjectsArray = createSelector([getRelatedObjects], state =>
  get(state, 'objects', []),
);

export const getRelatedObjectsForSidebar = createSelector([getRelatedObjectsArray], objects =>
  objects.length ? objects.slice(0, 5) : [],
);

export const getRelatedObjectsIsLoading = createSelector([getRelatedObjects], state =>
  get(state, 'isLoading', []),
);

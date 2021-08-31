import { get } from 'lodash';
import { createSelector } from 'reselect';

// selector
export const websiteState = state => state.website;

// reselect function
export const getParentDomain = createSelector([websiteState], state =>
  get(state, 'parentDomain', []),
);

export const getDomainAvailableStatus = createSelector([websiteState], state =>
  get(state, 'domainAvailableStatus', []),
);

export const getWebsiteLoading = createSelector([websiteState], state => get(state, 'loading'));

export const getCreateWebsiteLoading = createSelector([websiteState], state =>
  get(state, 'loadingWebsite'),
);

export const getManage = createSelector([websiteState], state => get(state, 'manage'));

export const getReports = createSelector([websiteState], state => get(state, 'reports'));

export const getOwnWebsites = createSelector([websiteState], state =>
  get(state, 'ownWebsites', []),
);

export const getConfiguration = createSelector([websiteState], state =>
  get(state, 'configurationWebsite', {}),
);

export const getAdministrators = createSelector([websiteState], state =>
  get(state, 'administrators', {}),
);

export const getModerators = createSelector([websiteState], state => get(state, 'moderators', {}));

export const getAuthorities = createSelector([websiteState], state =>
  get(state, 'authorities', {}),
);

export const getTagsSite = createSelector([websiteState], state => get(state, 'tags', {}));

export const getSettingsSite = createSelector([websiteState], state => get(state, 'settings', {}));

export const getIsLoadingAreas = createSelector([websiteState], state => state.isLoadingAreas);

export const getRestrictions = createSelector([websiteState], state =>
  get(state, 'restrictions', {}),
);

export const getMuteLoading = createSelector([websiteState], state =>
  get(state, 'muteLoading', {}),
);

export const getUnmutedUsers = createSelector([websiteState], state =>
  get(state, 'unmuteUsers', []),
);

export const getWobjectsPoint = createSelector([websiteState], state => state.wobjectsPoint);

export const getIsUsersAreas = createSelector([websiteState], state => state.areas);

export const getShowReloadButton = createSelector([websiteState], state => state.showReloadButton);

export const getListOfDistricts = createSelector([websiteState], state => state.districts);

export const getListOfRestaurant = createSelector([websiteState], state => state.restaurants);

export const getListOfDishAndDrink = createSelector([websiteState], state => state.nearbyFood);

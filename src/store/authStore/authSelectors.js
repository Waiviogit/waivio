import { get } from 'lodash';
import { createSelector } from 'reselect';

import getUserAvatar from '../../client/helpers/authHelper';

// selector
const authState = state => state.auth;

// reselect functions
export const getIsAuthenticated = createSelector([authState], state => state.isAuthenticated);

export const getIsAuthFetching = createSelector([authState], state => state.isFetching);

export const getIsLoaded = createSelector([authState], state => state.loaded);

export const getIsReloading = createSelector([authState], state => state.isReloading);

export const getAuthenticatedUser = createSelector([authState], state => state.user);

export const getAuthenticatedUserName = createSelector([getAuthenticatedUser], user => user.name);

export const getAuthenticatedUserMetaData = createSelector(
  [authState],
  state => state.userMetaData,
);

export const getAuthenticatedUserNotificationsSettings = createSelector(
  [getAuthenticatedUserMetaData],
  userMetaData => get(userMetaData, ['settings', 'userNotifications'], {}),
);

export const getAuthenticatedUserAvatar = createSelector([getAuthenticatedUser], state =>
  getUserAvatar(state),
);

export const isGuestUser = createSelector([authState], state => state.isGuestUser);

export const getAuthenticatedUserPrivateEmail = createSelector(
  [authState],
  state => state.privateEmail,
);

export const getAuthorizationUserFollowSort = createSelector([authState], state => state.sort);

export const getUserPosting = createSelector(getAuthenticatedUser, state => state.posting);

export const getUserAccountsAuth = createSelector(getUserPosting, state =>
  get(state, 'account_auths', []),
);

export const getIsConnectMatchBot = createSelector(
  getUserAccountsAuth,
  (state, props) => props.botType,
  (accounts, botName) => accounts.some(item => item[0] === botName),
);

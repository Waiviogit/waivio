import { createSelector } from 'reselect';
// selector
const getUserState = state => state.entities.user;
// reselect function
export const getIsSignInState = createSelector([getUserState], user => user.isSignIn);

export const getConnectionState = createSelector(
  [getUserState],
  user => user.connectionEstablished,
);

export const isGuestUserSelector = createSelector(state => state.auth, auth => auth.isGuestUser);

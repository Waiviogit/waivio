import { get } from 'lodash';
import { createSelector } from 'reselect';

// selector
export const usersState = state => state.users;

// reselect function
export const getAllUsers = createSelector([usersState], state => get(state, 'users', {}));

export const getUser = createSelector(
  getAllUsers,
  (state, username) => username,
  (users, username) => get(users, `${username}`, {}),
);

export const getIsUserFetching = createSelector(getUser, user => get(user, 'fetching', false));

export const getIsUserLoaded = createSelector(getUser, user => get(user, 'loaded', false));

export const getIsUserFailed = createSelector(getUser, user => get(user, 'failed', false));

export const getSideBarLoading = createSelector(getUser, user =>
  get(user, 'sideBarLoading', false),
);

export const getTopExpertsObject = createSelector([usersState], state => state.topExperts);

export const getTopExperts = createSelector([getTopExpertsObject], topExperts => topExperts.list);

export const getTopExpertsLoading = createSelector(
  [getTopExpertsObject],
  topExperts => topExperts.isFetching,
);

export const getTopExpertsHasMore = createSelector(
  [getTopExpertsObject],
  topExperts => topExperts.hasMore,
);

export const getRandomExpertsObject = createSelector([usersState], state => state.randomExperts);

export const getRandomExperts = createSelector(
  [getRandomExpertsObject],
  randomExperts => randomExperts.list,
);

export const getRandomExpertsLoaded = createSelector(
  [getRandomExpertsObject],
  randomExperts => randomExperts.fetched,
);

export const getRandomExpertsLoading = createSelector(
  [getRandomExpertsObject],
  randomExperts => randomExperts.isFetching,
);

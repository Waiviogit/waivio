import { createSelector } from 'reselect';
// selector
const getDealsState = state => state.deals;
// reselect function
export const getOpenDealsState = createSelector(
  [getDealsState],
  deals => deals.open,
);
export const getClosedDealsState = createSelector(
  [getDealsState],
  deals => deals.closed,
);
export const makeGetPostDealsState = () =>
  createSelector(
    getDealsState,
    (state, props) => props.postId,
    (deals, postId) => deals.postDeals[postId],
  );

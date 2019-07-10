import {createSelector} from 'reselect';
import _ from 'lodash';
// selector
export const getPostsState = state => state.posts;
export const getPostsStat = state => state.posts;

export const makeGetPermlinkFromPostsState = () =>
  createSelector(
    getPostsState,
    (state, props) => props.dateTimeCreate,
    (posts, dateTimeCreate) =>
      _.find(posts.list, list => list.forecast.createdAt === dateTimeCreate).id,
  );

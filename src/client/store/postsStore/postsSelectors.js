import { get } from 'lodash';
import { createSelector } from 'reselect';

// selector
export const postsState = state => state.posts;

// reselect function
export const getPosts = createSelector([postsState], state => state.list);

export const getPostContent = (permlink, author) =>
  createSelector(getPosts, posts =>
    Object.values(posts).find(
      post =>
        post.permlink === permlink &&
        (post.author === author || get(post, ['guestInfo', 'userId']) === author),
    ),
  );

export const getPendingLikes = createSelector([postsState], state => state.pendingLikes);

export const getPostsStates = createSelector([postsState], state => state.postsStates);

export const getPostsStatesOfUser = createSelector(
  getPostsStates,
  (state, props) => props.author,
  (state, props) => props.permlink,
  (state, author, permlink) => get(state, `${author}/${permlink}`),
);

export const getIsPostFetching = createSelector([getPostsStatesOfUser], state =>
  get(state, 'fetching'),
);

export const getIsPostLoaded = createSelector([getPostsStatesOfUser], state =>
  get(state, 'loaded'),
);

export const getIsPostFailed = createSelector([getPostsStatesOfUser], state =>
  get(state, 'failed'),
);

export const getLastPostId = createSelector([postsState], state => state.lastId);

export const getPostsListOfUser = createSelector(
  getPosts,
  (state, props) => get(props, 'author'),
  (state, props) => get(props, 'permlink'),
  (posts, author, permlink) => get(posts, `${author}/${permlink}`),
);

export const getPostTags = createSelector([getPostsListOfUser], state => get(state, 'tags'));

export const getPostCities = createSelector([getPostsListOfUser], state => get(state, 'cities'));

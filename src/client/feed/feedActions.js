import _ from 'lodash';
import { getDiscussionsFromAPI } from '../helpers/apiHelpers';
import {
  createAsyncActionType,
  getFeedFromState,
  getFeedLoadingFromState,
} from '../helpers/stateHelpers';
import {
  getAuthenticatedUserName,
  getFeed,
  getPosts,
  getBookmarks as getBookmarksSelector,
  getObject,
} from '../reducers';

import * as ApiClient from '../../waivioApi/ApiClient';
import { mapObjectAppends } from '../object/wObjectHelper';

export const GET_FEED_CONTENT = createAsyncActionType('@feed/GET_FEED_CONTENT');
export const GET_MORE_FEED_CONTENT = createAsyncActionType('@feed/GET_MORE_FEED_CONTENT');

export const GET_USER_FEED_CONTENT = createAsyncActionType('@feed/GET_USER_FEED_CONTENT');
export const GET_MORE_USER_FEED_CONTENT = createAsyncActionType('@feed/GET_MORE_USER_FEED_CONTENT');

export const GET_USER_COMMENTS = createAsyncActionType('@feed/GET_USER_COMMENTS');
export const GET_MORE_USER_COMMENTS = createAsyncActionType('@feed/GET_MORE_USER_COMMENTS');

export const GET_REPLIES = createAsyncActionType('@user/GET_REPLIES');
export const GET_MORE_REPLIES = createAsyncActionType('@user/GET_MORE_REPLIES');

export const GET_BOOKMARKS = createAsyncActionType('@bookmarks/GET_BOOKMARKS');

export const GET_OBJECT_POSTS = createAsyncActionType('@object/GET_OBJECT_POSTS');
export const GET_MORE_OBJECT_POSTS = createAsyncActionType('@object/GET_MORE_OBJECT_POSTS');

export const CLEAN_FEED = 'CLEAN_FEED';

export const getFeedContent = ({ sortBy = 'trending', category, limit = 20 }) => dispatch =>
  dispatch({
    type: GET_FEED_CONTENT.ACTION,
    payload: getDiscussionsFromAPI(
      sortBy,
      { category: sortBy, tag: category, limit, sortBy },
      ApiClient,
    ),
    meta: {
      sortBy,
      category: category || 'all',
      limit,
    },
  });
export const cleanFeed = () => dispatch =>
  dispatch({
    type: CLEAN_FEED,
    payload: '',
  });

export const getUserFeedContent = ({ userName, limit = 20 }) => dispatch =>
  dispatch({
    type: GET_USER_FEED_CONTENT.ACTION,
    payload: ApiClient.getUserFeedContent(userName, limit),
    meta: {
      sortBy: 'feed',
      category: userName,
      limit,
    },
  });

export const getMoreUserFeedContent = ({ userName, limit = 20 }) => (dispatch, getState) => {
  const state = getState();
  const feed = getFeed(state);
  const feedContent = getFeedFromState('feed', userName, feed);

  if (!feedContent.length || !feed || !feed.feed || !feed.feed[userName])
    return Promise.resolve(null);
  const countWithWobj = feed.feed[userName].list.length;

  return dispatch({
    type: GET_MORE_USER_FEED_CONTENT.ACTION,
    payload: ApiClient.getMoreUserFeedContent({
      userName,
      limit,
      skip: countWithWobj,
    }),
    meta: { sortBy: 'feed', category: userName, limit },
  });
};
export const getMoreFeedContent = ({ sortBy, category, limit = 20 }) => (dispatch, getState) => {
  const state = getState();
  const feed = getFeed(state);
  const posts = getPosts(state);
  const feedContent = getFeedFromState(sortBy, category, feed);

  if (!feedContent.length) return Promise.resolve(null);

  const lastPost = posts[feedContent[feedContent.length - 1]];
  const skip = feed.wia_feed && feed.wia_feed.all ? _.size(feed.wia_feed.all.list) : 0;

  const startAuthor = lastPost.author;
  const startPermlink = lastPost.permlink;

  const query = {
    category: sortBy,
    tag: category,
  };
  if (sortBy === 'wia_feed') {
    query.skip = skip;
    query.limit = limit;
  } else {
    query.limit = limit + 1;
    query.start_author = startAuthor;
    query.start_permlink = startPermlink;
  }

  return dispatch({
    type: GET_MORE_FEED_CONTENT.ACTION,
    payload: getDiscussionsFromAPI(sortBy, query, ApiClient).then(postsData => postsData.slice(1)),
    meta: {
      sortBy,
      category: category || 'all',
      limit,
    },
  });
};

export const getUserComments = ({ username, limit = 20 }) => (dispatch, getState, { steemAPI }) =>
  dispatch({
    type: GET_USER_COMMENTS.ACTION,
    payload: steemAPI
      .sendAsync('get_discussions_by_comments', [{ start_author: username, limit }])
      .then(postsData => postsData),
    meta: { sortBy: 'comments', category: username, limit },
  });

export const getObjectComments = (author, permlink, category = 'waivio-object') => (
  dispatch,
  getState,
  { steemAPI },
) => {
  const state = getState();
  const wobject = getObject(state);
  return dispatch({
    type: GET_USER_COMMENTS.ACTION,
    payload: steemAPI
      .sendAsync('get_state', [`/${category}/@${author}/${permlink}`])
      .then(apiRes => mapObjectAppends(apiRes.content, wobject)),
    meta: { sortBy: 'comments', category: author, limit: 10 },
  });
};

export const getObjectPosts = ({ username, object, limit = 10 }) => dispatch => {
  dispatch({
    type: GET_OBJECT_POSTS.ACTION,
    payload: ApiClient.getFeedContentByObject(object, limit),
    meta: { sortBy: 'objectPosts', category: username, limit },
  });
};

export const getMoreObjectPosts = ({ username, authorPermlink, limit = 10 }) => (
  dispatch,
  getState,
) => {
  const state = getState();
  const feed = getFeed(state);
  const posts = getPosts(state);

  const feedContent = getFeedFromState('objectPosts', username, feed);
  const isLoading = getFeedLoadingFromState('objectPosts', username, feed);

  if (!feedContent.length || isLoading) {
    return null;
  }

  const skip = Object.keys(posts).length;

  return dispatch({
    type: GET_MORE_OBJECT_POSTS.ACTION,
    payload: ApiClient.getMoreFeedContentByObject({
      authorPermlink,
      skip,
      limit,
    }),
    meta: { sortBy: 'objectPosts', category: username, limit },
  });
};

export const getMoreUserComments = ({ username, limit = 20 }) => (
  dispatch,
  getState,
  { steemAPI },
) => {
  const state = getState();
  const feed = getFeed(state);
  const posts = getPosts(state);

  const feedContent = getFeedFromState('comments', username, feed);
  const isLoading = getFeedLoadingFromState('comments', username, feed);

  if (!feedContent.length || isLoading) {
    return null;
  }

  const lastPost = posts[feedContent[feedContent.length - 1]];

  const startAuthor = lastPost.author;
  const startPermlink = lastPost.permlink;

  return dispatch({
    type: GET_MORE_USER_COMMENTS.ACTION,
    payload: steemAPI
      .sendAsync('get_discussions_by_comments', [
        {
          start_author: startAuthor,
          start_permlink: startPermlink,
          limit: limit + 1,
        },
      ])
      .then(postsData => postsData.slice(1)),
    meta: { sortBy: 'comments', category: username, limit },
  });
};

export const getReplies = () => (dispatch, getState, { steemAPI }) => {
  const state = getState();
  const category = getAuthenticatedUserName(state);

  dispatch({
    type: GET_REPLIES.ACTION,
    payload: steemAPI
      .sendAsync('get_state', [`/@${category}/recent-replies`])
      .then(apiRes => Object.values(apiRes.content).sort((a, b) => b.id - a.id)),
    meta: { sortBy: 'replies', category, limit: 50 },
  });
};

export const getMoreReplies = () => (dispatch, getState, { steemAPI }) => {
  const state = getState();
  const feed = getFeed(state);
  const posts = getPosts(state);
  const category = getAuthenticatedUserName(state);

  const lastFetchedReplyId =
    feed.replies[category] && feed.replies[category].list[feed.replies[category].list.length - 1];

  if (!lastFetchedReplyId) {
    return null;
  }

  const startAuthor = posts.list[lastFetchedReplyId].author;
  const startPermlink = posts.list[lastFetchedReplyId].permlink;
  const limit = 10;

  return dispatch({
    type: GET_MORE_REPLIES.ACTION,
    payload: steemAPI
      .sendAsync('get_replies_by_last_update', [startAuthor, startPermlink, limit + 1])
      .then(postsData => postsData.slice(1)),
    meta: { sortBy: 'replies', category, limit },
  });
};

/**
 * Use async await to load all the posts of bookmarked from steemAPI and returns a Promise
 *
 * @param bookmarks from localStorage only contain author and permlink
 * @param steemAPI
 * @returns Promise - bookmarksData
 */
async function getBookmarksData(bookmarks) {
  const bookmarksData = [];
  for (let idx = 0; idx < Object.keys(bookmarks).length; idx += 1) {
    const postId = Object.keys(bookmarks)[idx];

    const postData = ApiClient.getContent(bookmarks[postId].author, bookmarks[postId].permlink);
    bookmarksData.push(postData);
  }
  return Promise.all(bookmarksData.sort((a, b) => a.timestamp - b.timestamp).reverse());
}

export const getBookmarks = () => (dispatch, getState, { steemAPI }) => {
  const state = getState();
  const bookmarks = getBookmarksSelector(state);

  dispatch({
    type: GET_BOOKMARKS.ACTION,
    payload: getBookmarksData(bookmarks, steemAPI).then(posts =>
      posts.filter(post => post.id !== 0),
    ),
    meta: {
      sortBy: 'bookmarks',
      category: 'all',
      once: true,
    },
  });
};

/* eslint-disable camelcase */
import { isEmpty, get } from 'lodash';
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
  getLocale,
  getReadLanguages,
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

const getUserLocalesArray = getState => {
  let locales = ['en-US'];
  const state = getState();
  const readLanguages = getReadLanguages(state);
  if (isEmpty(readLanguages)) {
    const interfaceLanguage = getLocale(state);
    if (interfaceLanguage && interfaceLanguage !== 'auto') locales = [interfaceLanguage];
  } else locales = readLanguages;
  return locales;
};

export const getFeedContent = ({ sortBy = 'trending', category, limit = 20 }) => (
  dispatch,
  getState,
) => {
  const user_languages = getUserLocalesArray(getState);

  const doApiRequest = () => {
    if (category === 'wia_feed') {
      return ApiClient.getFeedContentByObject('vmf-wtrade', limit, user_languages);
    }
    return ApiClient.getFeedContent(sortBy, {
      category: sortBy,
      tag: category,
      skip: 0,
      limit,
      user_languages,
    })
  };

  dispatch({
    type: GET_FEED_CONTENT.ACTION,
    payload: doApiRequest(),
    meta: {
      sortBy,
      category: category || 'all',
      limit,
    },
  });
};

export const getMoreFeedContent = ({ sortBy, category, limit = 20 }) => (dispatch, getState) => {
  const state = getState();
  const feed = getFeed(state);
  const feedContent = getFeedFromState(sortBy, category, feed);
  const user_languages = getUserLocalesArray(getState);

  if (!feedContent.length) return Promise.resolve(null);

  const doApiRequest = () => {
    if (category === 'wia_feed') {
      return ApiClient.getMoreFeedContentByObject({
        authorPermlink: 'vmf-wtrade',
        skip: feedContent.length,
        limit,
        user_languages,
      });
    }
    return ApiClient.getFeedContent(sortBy, {
      category: sortBy,
      tag: category,
      skip: feedContent.length,
      limit,
      user_languages,
    })
  };
  return dispatch({
    type: GET_MORE_FEED_CONTENT.ACTION,
    payload: doApiRequest(),
    meta: {
      sortBy,
      category: category || 'all',
      limit,
    },
  });
};

export const getUserProfileBlogPosts = (userName, { limit = 10, initialLoad = true }) => (
  dispatch,
  getState,
) => {
  let startAuthor = '';
  let startPermlink = '';
  if (!initialLoad) {
    const state = getState();
    const feed = getFeed(state);
    const posts = getPosts(state);
    const feedContent = getFeedFromState('blog', userName, feed);

    if (!feedContent.length) return Promise.resolve(null);

    const lastPost = posts[feedContent[feedContent.length - 1]];

    startAuthor = lastPost.author;
    startPermlink = lastPost.permlink;
  }
  return dispatch({
    type: initialLoad ? GET_FEED_CONTENT.ACTION : GET_MORE_FEED_CONTENT.ACTION,
    payload: ApiClient.getUserProfileBlog(userName, {
      startAuthor,
      startPermlink,
      limit,
    }),
    meta: {
      sortBy: 'blog',
      category: userName,
      limit,
    },
  });
};

export const cleanFeed = () => dispatch =>
  dispatch({
    type: CLEAN_FEED,
    payload: '',
  });

export const getUserFeedContent = ({ userName, limit = 20 }) => (dispatch, getState) => {
  const user_languages = getUserLocalesArray(getState);
  dispatch({
    type: GET_USER_FEED_CONTENT.ACTION,
    payload: ApiClient.getUserFeedContent(userName, limit, user_languages),
    meta: {
      sortBy: 'feed',
      category: userName,
      limit,
    },
  });
};

export const getMoreUserFeedContent = ({ userName, limit = 20 }) => (dispatch, getState) => {
  const state = getState();
  const feed = getFeed(state);
  const feedContent = getFeedFromState('feed', userName, feed);
  const user_languages = getUserLocalesArray(getState);

  if (!feedContent.length || !feed || !feed.feed || !feed.feed[userName])
    return Promise.resolve(null);
  const countWithWobj = feed.feed[userName].list.length;

  return dispatch({
    type: GET_MORE_USER_FEED_CONTENT.ACTION,
    payload: ApiClient.getMoreUserFeedContent({
      userName,
      limit,
      skip: countWithWobj,
      user_languages,
    }),
    meta: { sortBy: 'feed', category: userName, limit },
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

export const getObjectPosts = ({ username, object, limit = 10 }) => (dispatch, getState) => {
  const readLanguages = getUserLocalesArray(getState);
  dispatch({
    type: GET_OBJECT_POSTS.ACTION,
    payload: ApiClient.getFeedContentByObject(object, limit, readLanguages),
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
  const user_languages = getUserLocalesArray(getState);

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
      user_languages,
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
 * @returns Promise - bookmarksData
 */
async function getBookmarksData(bookmarks) {
  const bookmarksData = [];
  for (let idx = 0; idx < bookmarks.length; idx += 1) {
    const [author, permlink] = bookmarks[idx].split('/');
    const postData = ApiClient.getContent(author, permlink);
    bookmarksData.push(postData);
  }
  return Promise.all(bookmarksData.sort((a, b) => a.timestamp - b.timestamp).reverse());
}

export const getBookmarks = () => (dispatch, getState) => {
  const state = getState();
  const loaded = get(getFeed(state), ['bookmarks', 'all', 'list'], []);
  const bookmarks = getBookmarksSelector(state);
  if (loaded.length && loaded.length === bookmarks.length) {
    return;
  }
  dispatch({
    type: GET_BOOKMARKS.ACTION,
    payload: getBookmarksData(bookmarks).then(posts => posts.filter(post => post.id !== 0)),
    meta: {
      sortBy: 'bookmarks',
      category: 'all',
      once: true,
    },
  });
};

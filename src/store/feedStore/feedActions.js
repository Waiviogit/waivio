/* eslint-disable camelcase */
import { get, isEmpty } from 'lodash';
import { preparationPreview } from '../../client/social-gifts/FeedMasonry/helpers';
import {
  createAsyncActionType,
  getFeedFromState,
  getFeedLoadingFromState,
} from '../../common/helpers/stateHelpers';

import * as ApiClient from '../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../authStore/authSelectors';
import { getLastPostId, getPosts } from '../postsStore/postsSelectors';
import { getBlogFilters, getFeed } from './feedSelectors';
import { getBookmarks as getBookmarksSelector } from '../bookmarksStore/bookmarksSelectors';
import { getLocale, getReadLanguages } from '../settingsStore/settingsSelectors';

export const GET_FEED_CONTENT = createAsyncActionType('@feed/GET_FEED_CONTENT');
export const GET_THREADS_CONTENT = createAsyncActionType('@feed/GET_THREADS_CONTENT');
export const GET_MORE_THREADS_CONTENT = createAsyncActionType('@feed/GET_MORE_THREADS_CONTENT');
export const GET_MORE_FEED_CONTENT = createAsyncActionType('@feed/GET_MORE_FEED_CONTENT');

export const GET_FEED_CONTENT_BY_BLOG = createAsyncActionType('@feed/GET_FEED_CONTENT_BY_BLOG');
export const GET_MORE_FEED_CONTENT_BY_BLOG = createAsyncActionType(
  '@feed/GET_MORE_FEED_CONTENT_BY_BLOG',
);

export const GET_USER_FEED_CONTENT = createAsyncActionType('@feed/GET_USER_FEED_CONTENT');
export const GET_MORE_USER_FEED_CONTENT = createAsyncActionType('@feed/GET_MORE_USER_FEED_CONTENT');

export const GET_USER_COMMENTS = createAsyncActionType('@feed/GET_USER_COMMENTS');
export const GET_MORE_USER_COMMENTS = createAsyncActionType('@feed/GET_MORE_USER_COMMENTS');

export const GET_REPLIES = createAsyncActionType('@user/GET_REPLIES');
export const GET_MORE_REPLIES = createAsyncActionType('@user/GET_MORE_REPLIES');

export const GET_BOOKMARKS = createAsyncActionType('@bookmarks/GET_BOOKMARKS');

export const SET_PINNED_POSTS = '@object/SET_PINNED_POSTS';
export const GET_OBJECT_POSTS = createAsyncActionType('@object/GET_OBJECT_POSTS');
export const GET_MORE_OBJECT_POSTS = createAsyncActionType('@object/GET_MORE_OBJECT_POSTS');

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

export const getFeedContent = ({ sortBy, category, limit = 20 }) => (dispatch, getState) => {
  const state = getState();
  const user_languages = getUserLocalesArray(getState);
  const locale = getLocale(state);
  const follower = getAuthenticatedUserName(state);

  dispatch({
    type: GET_FEED_CONTENT.ACTION,
    payload: ApiClient.getFeedContent(sortBy, locale, follower, {
      category: sortBy,
      tag: category,
      skip: 0,
      limit,
      user_languages,
    }),
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
  const locale = getLocale(state);
  const lastId = getLastPostId(state);
  const follower = getAuthenticatedUserName(state);

  if (!feedContent.length) return Promise.resolve(null);

  return dispatch({
    type: GET_MORE_FEED_CONTENT.ACTION,
    payload: ApiClient.getFeedContent(sortBy, locale, follower, {
      category: sortBy,
      tag: category,
      skip: feedContent.length,
      limit,
      user_languages,
      lastId,
    }),
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
  let userBlogPosts = [];
  const state = getState();
  const locale = getLocale(state);
  const follower = getAuthenticatedUserName(state);
  const tagsCondition = getBlogFilters(state);

  if (!initialLoad) {
    const feed = getFeed(state);

    userBlogPosts = getFeedFromState('blog', userName, feed);

    if (!userBlogPosts.length) return Promise.resolve(null);
  }

  return dispatch({
    type: initialLoad ? GET_FEED_CONTENT_BY_BLOG.ACTION : GET_MORE_FEED_CONTENT_BY_BLOG.ACTION,
    payload: ApiClient.getUserProfileBlog(
      userName,
      follower,
      {
        limit,
        skip: userBlogPosts.length,
      },
      locale,
      tagsCondition,
    ),
    meta: {
      sortBy: 'blog',
      category: userName,
      limit,
    },
  });
};

export const getUserFeedContent = ({ userName, limit = 20 }) => (dispatch, getState) => {
  const state = getState();
  const user_languages = getUserLocalesArray(getState);
  const locale = getLocale(state);

  return dispatch({
    type: GET_USER_FEED_CONTENT.ACTION,
    payload: ApiClient.getUserFeedContent(userName, limit, user_languages, locale),
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
  const locale = getLocale(state);
  const lastId = getLastPostId(state);

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
      lastId,
      locale,
    }),
    meta: { sortBy: 'feed', category: userName, limit },
  });
};

export const getUserComments = ({ username, limit = 10, skip = 0, start_permlink }) => (
  dispatch,
  getState,
) => {
  const state = getState();
  const follower = getAuthenticatedUserName(state);

  dispatch({
    type: GET_USER_COMMENTS.ACTION,
    payload: ApiClient.getUserCommentsFromApi(username, skip, limit, start_permlink, follower),
    meta: { sortBy: 'comments', category: username, limit },
  });
};

export const getThreadsContent = (hashtag, skip, limit, isUser) => (dispatch, getState) => {
  const state = getState();
  const userName = getAuthenticatedUserName(state);

  const getThreadsMethod = () =>
    isUser
      ? ApiClient.getThreadsByUser(userName, hashtag, skip, limit).then(res => res.result)
      : ApiClient.getThreadsByHashtag(userName, hashtag, skip, limit).then(res => res.result);

  return dispatch({
    type: GET_THREADS_CONTENT.ACTION,
    payload: {
      promise: getThreadsMethod(),
    },
    meta: { sortBy: 'threads', category: hashtag, limit },
  });
};

export const getMoreThreadsContent = (hashtag, limit, isUser) => (dispatch, getState) => {
  const state = getState();
  const feed = getFeed(state);
  const userName = getAuthenticatedUserName(state);

  const getThreadsMethod = () =>
    isUser
      ? ApiClient.getThreadsByUser(userName, hashtag, skip, limit).then(res => res.result)
      : ApiClient.getThreadsByHashtag(userName, hashtag, skip, limit).then(res => res.result);

  const feedContent = getFeedFromState('threads', hashtag, feed);

  if (!feedContent.length || !feed || !feed.threads || !feed.threads[hashtag])
    return Promise.resolve(null);

  const skip = feed.threads[hashtag].list.length;

  return dispatch({
    type: GET_MORE_THREADS_CONTENT.ACTION,
    payload: {
      promise: getThreadsMethod(),
    },
    meta: { sortBy: 'threads', category: hashtag, limit },
  });
};
export const setPinnedPostsUrls = posts => dispatch => {
  dispatch({
    type: SET_PINNED_POSTS,
    payload: posts,
  });
};

export const getObjectPosts = ({ username, object, limit = 10, newsPermlink }) => (
  dispatch,
  getState,
) => {
  const state = getState();
  const readLanguages = getUserLocalesArray(getState);
  const locale = getLocale(state);
  const follower = getAuthenticatedUserName(state);

  const apiCall1 = ApiClient.getPinnedPostsByObject(object, locale, follower);
  const apiCall2 = ApiClient.getFeedContentByObject(
    object,
    limit,
    readLanguages,
    locale,
    follower,
    newsPermlink,
  );

  return Promise.all([apiCall1, apiCall2])
    .then(([pinnedPosts, feedContent]) => {
      const allPosts = [...pinnedPosts, ...feedContent];

      dispatch({
        type: SET_PINNED_POSTS,
        payload: pinnedPosts.reduce((acc, post) => {
          if (post.currentUserPin) {
            acc.push(post.url);
          }

          return acc;
        }, []),
      });

      return dispatch({
        type: GET_OBJECT_POSTS.SUCCESS,
        payload: allPosts,
        meta: {
          sortBy: 'objectPosts',
          category: username,
          limit,
          limitToCompare: feedContent.length,
        },
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
};

export const getMoreObjectPosts = ({
  username,
  authorPermlink,
  limit = 10,
  skip,
  newsPermlink,
}) => (dispatch, getState) => {
  const state = getState();
  const feed = getFeed(state);
  const user_languages = getUserLocalesArray(getState);
  const locale = getLocale(state);
  const lastId = getLastPostId(state);
  const feedContent = getFeedFromState('objectPosts', username, feed);
  const isLoading = getFeedLoadingFromState('objectPosts', username, feed);

  if (!feedContent.length || isLoading) {
    return dispatch({
      type: GET_MORE_OBJECT_POSTS.SUCCESS,
      payload: [],
      meta: { sortBy: 'objectPosts', category: username, limit },
    });
  }

  return dispatch({
    type: GET_MORE_OBJECT_POSTS.ACTION,
    payload: ApiClient.getMoreFeedContentByObject({
      authorPermlink,
      skip,
      limit,
      user_languages,
      lastId,
      locale,
      newsPermlink,
    }),
    meta: { sortBy: 'objectPosts', category: username, limit },
  });
};

export const getMoreUserComments = ({ username, skip = 20, limit = 20 }) => (
  dispatch,
  getState,
) => {
  const state = getState();
  const feed = getFeed(state);
  const posts = getPosts(state);
  const follower = getAuthenticatedUserName(state);

  const feedContent = getFeedFromState('comments', username, feed);
  const isLoading = getFeedLoadingFromState('comments', username, feed);

  if (!feedContent.length || isLoading) {
    return null;
  }

  const lastPost = posts[feedContent[feedContent.length - 1]];

  const startPermlink = lastPost.permlink;

  return dispatch({
    type: GET_MORE_USER_COMMENTS.ACTION,
    payload: ApiClient.getUserCommentsFromApi(username, skip, limit, startPermlink, follower),
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
async function getBookmarksData(bookmarks, locale, follower) {
  const bookmarksData = [];

  for (let idx = 0; idx < bookmarks.length; idx += 1) {
    const [author, permlink] = bookmarks[idx].split('/');

    if (author !== 'undefined' && permlink !== 'undefined') {
      const postData = ApiClient.getContent(author, permlink, locale, follower);

      bookmarksData.push(postData);
    }
  }

  return Promise.all(bookmarksData.sort((a, b) => a.timestamp - b.timestamp).reverse());
}

export const getBookmarks = () => (dispatch, getState) => {
  const state = getState();
  const loaded = get(getFeed(state), ['bookmarks', 'all', 'list'], []);
  const bookmarks = getBookmarksSelector(state);
  const locale = getLocale(state);
  const follower = getAuthenticatedUserName(state);

  if (loaded.length && loaded.length === bookmarks.length) return;

  dispatch({
    type: GET_BOOKMARKS.ACTION,
    payload: getBookmarksData(bookmarks, locale, follower).then(posts =>
      posts.filter(post => post.id !== 0),
    ),
    meta: {
      sortBy: 'bookmarks',
      category: 'all',
    },
  });
};

export const SET_PROFILE_FILTERS = '@feed/SET_PROFILE_FILTERS';

export const setProfileFilters = payload => ({
  type: SET_PROFILE_FILTERS,
  payload,
});
export const SET_PROFILE_TAGS = '@feed/SET_PROFILE_TAGS';

export const setProfileTags = payload => ({
  type: SET_PROFILE_TAGS,
  payload,
});

export const RESET_PROFILE_FILTERS = '@feed/RESET_PROFILE_FILTERS';

export const resetProfileFilters = () => ({
  type: RESET_PROFILE_FILTERS,
});

export const GET_TIKTOK_PRIVIEW = createAsyncActionType('@feed/GET_TIKTOK_PRIVIEW');

export const getTiktokPreviewAction = post => dispatch =>
  dispatch({
    type: GET_TIKTOK_PRIVIEW.ACTION,
    payload: preparationPreview(post),
  });

export const SET_FIRST_LOADING = '@feed/SET_FIRST_LOADING';

export const setFirstLoading = payload => ({
  type: SET_FIRST_LOADING,
  payload,
});

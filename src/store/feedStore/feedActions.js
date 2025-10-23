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
import { getAppHost } from '../appStore/appSelectors';
import { getMetadata } from '../../common/helpers/postingMetadata';
import { getUser } from '../usersStore/usersSelectors';

export const GET_FEED_CONTENT = createAsyncActionType('@feed/GET_FEED_CONTENT');
export const GET_THREADS_CONTENT = createAsyncActionType('@feed/GET_THREADS_CONTENT');
export const GET_MENTIONS_CONTENT = createAsyncActionType('@feed/GET_MENTIONS_CONTENT');
export const RESET_THREADS = '@feed/RESET_THREADS';
export const RESET_MENTIONS = '@feed/RESET_MENTIONS';
export const EDIT_THREAD = '@feed/EDIT_THREAD';
export const GET_MORE_THREADS_CONTENT = createAsyncActionType('@feed/GET_MORE_THREADS_CONTENT');
export const GET_MORE_MENTIONS_CONTENT = createAsyncActionType('@feed/GET_MORE_MENTIONS_CONTENT');
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

export const getFeedContent = ({
  sortBy,
  category,
  limit = 20,
  isJudges = false,
  authorPermlink,
  activationPermlink,
}) => (dispatch, getState) => {
  const state = getState();

  if (isJudges) {
    const follower = getAuthenticatedUserName(state);

    return dispatch({
      type: GET_JUDGES_POSTS.ACTION,
      payload: ApiClient.getJudgesPosts(
        follower,
        authorPermlink || '',
        activationPermlink || '',
        0,
        limit,
      ).then(r => r.posts),
      meta: {
        sortBy: 'judgesPosts',
        category: follower,
        limit,
      },
    });
  }

  const user_languages = getUserLocalesArray(getState);
  const locale = getLocale(state);
  const follower = getAuthenticatedUserName(state);

  return dispatch({
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

export const getMoreFeedContent = ({
  sortBy,
  category,
  limit = 20,
  isJudges = false,
  authorPermlink,
  activationPermlink,
}) => (dispatch, getState) => {
  const state = getState();

  if (isJudges) {
    const feed = getFeed(state);
    const feedContent = getFeedFromState('judgesPosts', getAuthenticatedUserName(state), feed);
    const follower = getAuthenticatedUserName(state);

    if (!feedContent.length) return Promise.resolve(null);

    return dispatch({
      type: GET_MORE_JUDGES_POSTS.ACTION,
      payload: ApiClient.getJudgesPosts(
        follower,
        authorPermlink || '',
        activationPermlink || '',
        feedContent.length,
        limit,
      ).then(r => r.posts),
      meta: {
        sortBy: 'judgesPosts',
        category: follower,
        limit,
      },
    });
  }

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

export const getUserProfileBlogPosts = (
  userName,
  { limit = 10, initialLoad = true },
  queryTags,
) => (dispatch, getState) => {
  let userBlogPosts = [];
  const state = getState();
  const locale = getLocale(state);
  const user = getUser(state, userName);
  const follower = getAuthenticatedUserName(state);

  const tagsCondition = queryTags || getBlogFilters(state);

  if (!initialLoad) {
    const feed = getFeed(state);

    userBlogPosts = getFeedFromState('blog', userName, feed);

    if (!userBlogPosts.length) return Promise.resolve(null);
  }
  const pinnedPermlink =
    user && user.posting_json_metadata && user.posting_json_metadata !== ''
      ? getMetadata(user)?.profile?.pinned
      : '';

  const postRequest = pinnedPermlink
    ? fetch('https://api.hive.blog/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 7,
          jsonrpc: '2.0',
          method: 'bridge.get_post',
          params: {
            author: userName,
            permlink: pinnedPermlink,
            observer: userName,
          },
        }),
      })
        .then(res => res.json())
        .then(res => res?.result)
        .catch(error => {
          console.error('Error in feed action:', error);

          return null;
        })
    : Promise.resolve(null);

  const feedRequest = ApiClient.getUserProfileBlog(
    userName,
    follower,
    {
      limit,
      skip: userBlogPosts.length,
    },
    locale,
    tagsCondition,
  );

  return dispatch({
    type: initialLoad ? GET_FEED_CONTENT_BY_BLOG.ACTION : GET_MORE_FEED_CONTENT_BY_BLOG.ACTION,
    payload: Promise.all([postRequest, feedRequest]).then(([featuredPost, blogFeed]) => {
      if (featuredPost && Array.isArray(blogFeed?.posts)) {
        const filteredPosts = blogFeed.posts.filter(
          post => !(post.author === featuredPost.author && post.permlink === featuredPost.permlink),
        );

        const posts = [{ ...featuredPost }, ...filteredPosts];

        return {
          hasMore: blogFeed?.hasMore,
          posts,
        };
      }

      return blogFeed;
    }),
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
  const appHost = getAppHost(state);

  return dispatch({
    type: GET_USER_FEED_CONTENT.ACTION,
    payload: ApiClient.getUserFeedContent(userName, limit, user_languages, locale, appHost),
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
export const resetThreads = () => dispatch => dispatch({ type: RESET_THREADS });
export const resetMentions = () => dispatch => dispatch({ type: RESET_MENTIONS });
export const editThreadState = (body, id) => dispatch =>
  dispatch({ type: EDIT_THREAD, payload: { id, body } });
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
export const getMentionsContent = (account, skip, limit) => (dispatch, getState) => {
  const state = getState();
  const userName = getAuthenticatedUserName(state);

  return dispatch({
    type: GET_MENTIONS_CONTENT.ACTION,
    payload: {
      promise: ApiClient.getMentionsPosts(userName, account, skip, limit).then(r => r.posts),
    },
    meta: { sortBy: 'mentions', category: account, limit },
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
export const getMoreMentionsContent = (account, limit) => (dispatch, getState) => {
  const state = getState();
  const feed = getFeed(state);
  const userName = getAuthenticatedUserName(state);
  const feedContent = getFeedFromState('mentions', account, feed);

  if (!feedContent.length || !feed || !feed.mentions || !feed.mentions[account])
    return Promise.resolve(null);

  const skip = feed.mentions[account].list.length;

  return dispatch({
    type: GET_MORE_MENTIONS_CONTENT.ACTION,
    payload: {
      promise: ApiClient.getMentionsPosts(userName, account, skip, limit).then(r => r.posts),
    },
    meta: { sortBy: 'mentions', category: account, limit },
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
  const appHost = getAppHost(state);

  const apiCall1 = ApiClient.getPinnedPostsByObject(object, locale, follower, appHost);
  const apiCall2 = ApiClient.getFeedContentByObject(
    object,
    limit,
    readLanguages,
    locale,
    follower,
    newsPermlink,
    appHost,
  );

  dispatch({
    type: GET_OBJECT_POSTS.START,
    meta: {
      sortBy: 'objectPosts',
      category: username,
      limit,
    },
  });

  return Promise.all([apiCall1, apiCall2])
    .then(([pinnedPosts, feedContent]) => {
      let allPosts = [];

      if (!pinnedPosts.message) {
        allPosts = [...pinnedPosts];
        dispatch({
          type: SET_PINNED_POSTS,
          payload: pinnedPosts.reduce((acc, post) => {
            if (post.currentUserPin) {
              acc.push(post.url);
            }

            return acc;
          }, []),
        });
      }

      if (!feedContent.message) {
        allPosts = [...allPosts, ...feedContent];
      }

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

export const GET_JUDGES_POSTS = createAsyncActionType('@feed/GET_JUDGES_POSTS');
export const GET_MORE_JUDGES_POSTS = createAsyncActionType('@feed/GET_MORE_JUDGES_POSTS');

export const getJudgesPosts = (judgeName, authorPermlink, { limit = 10, initialLoad = true }) => (
  dispatch,
  getState,
) => {
  let judgesPosts = [];
  const state = getState();

  if (!initialLoad) {
    const feed = getFeed(state);

    judgesPosts = getFeedFromState('judgesPosts', judgeName, feed);

    if (!judgesPosts.length) return Promise.resolve(null);
  }

  return dispatch({
    type: initialLoad ? GET_JUDGES_POSTS.ACTION : GET_MORE_JUDGES_POSTS.ACTION,
    payload: ApiClient.getJudgesPosts(judgeName, authorPermlink, judgesPosts.length, limit),
    meta: {
      sortBy: 'judgesPosts',
      category: judgeName,
      limit,
    },
  });
};

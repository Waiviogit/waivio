import { createAsyncActionType } from '../helpers/stateHelpers';
import * as ApiClient from '../../waivioApi/ApiClient';
import { getLocale } from '../reducers';

export const GET_CONTENT = createAsyncActionType('@post/GET_CONTENT');

export const LIKE_POST = '@post/LIKE_POST';
export const LIKE_POST_START = '@post/LIKE_POST_START';
export const LIKE_POST_SUCCESS = '@post/LIKE_POST_SUCCESS';
export const LIKE_POST_ERROR = '@post/LIKE_POST_ERROR';
export const FAKE_LIKE_POST = '@post/FAKE_LIKE_POST';
export const FAKE_LIKE_POST_START = '@post/FAKE_LIKE_POST_START';
export const FAKE_LIKE_POST_SUCCESS = '@post/FAKE_LIKE_POST_SUCCESS';
export const FAKE_LIKE_POST_ERROR = '@post/FAKE_LIKE_POST_ERROR';
export const FAKE_REBLOG_POST = '@post/FAKE_REBLOG_POST';
export const LIKE_POST_HISTORY = '@post/LIKE_POST_HISTORY';

export const getContent = (author, permlink, afterLike) => (dispatch, getState) => {
  if (!author || !permlink) {
    return null;
  }
  const state = getState();
  const locale = getLocale(state);

  // eslint-disable-next-line consistent-return
  const doApiRequest = () => ApiClient.getContent(author, permlink, locale);

  return dispatch({
    type: GET_CONTENT.ACTION,
    payload: {
      promise: doApiRequest().then(res => {
        if (res.id === 0) throw new Error('There is no such post');
        if (res.message) throw new Error(res.message);
        return res;
      }),
    },
    meta: {
      author,
      permlink,
      afterLike,
    },
  }).catch(() => {});
};

export const votePost = (postId, author, permlink, weight = 10000) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const { auth, posts } = getState();
  const isGuest = auth.isGuestUser;
  const post = posts.list[postId];
  const voter = auth.user.name;
  const TYPE = isGuest ? FAKE_LIKE_POST : LIKE_POST;
  const votedPostAuthor = post.guestInfo ? post.author : author;

  if (!auth.isAuthenticated) {
    return null;
  }

  return dispatch({
    type: TYPE,
    payload: {
      promise: steemConnectAPI
        .vote(voter, post.author_original || author, post.permlink, weight)
        .then(res => {
          if (res.status === 200 && isGuest) {
            return { isFakeLikeOk: true };
          }
          if (window.analytics) {
            window.analytics.track('Vote', {
              category: 'vote',
              label: 'submit',
              value: 1,
            });
          }

          if (!isGuest) {
            setTimeout(
              () =>
                dispatch(getContent(post.author_original || votedPostAuthor, post.permlink, true)),
              2000,
            );
          }
          return res;
        }),
    },
    meta: isGuest
      ? {
          postId,
          voter,
          weight,
          postPermlink: postId,
          rshares: 1,
          percent: weight,
        }
      : { postId, voter, weight },
  });
};

export const voteHistoryPost = (currentPost, author, permlink, weight) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const { auth } = getState();
  const post = currentPost;
  const voter = auth.user.name;
  const TYPE = LIKE_POST_HISTORY;

  if (!auth.isAuthenticated) {
    return null;
  }

  return dispatch({
    type: TYPE,
    payload: {
      promise: steemConnectAPI
        .vote(voter, post.author || author, post.permlink, weight)
        .then(res => res),
    },
  });
};

export const reblogPost = (postId, userName) => dispatch =>
  dispatch({
    type: FAKE_REBLOG_POST,
    payload: { postId, userName },
  });

export const voteCommentFromRewards = (postId, author, permlink, weight = 10000) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const { auth } = getState();
  const voter = auth.user.name;

  return steemConnectAPI.vote(voter, author, permlink, weight).then(res => {
    if (window.analytics) {
      window.analytics.track('Vote', {
        category: 'vote',
        label: 'submit',
        value: 1,
      });
    }

    // Delay to make sure you get the latest data (unknown issue with API)
    setTimeout(() => dispatch(getContent(author, permlink, true)), 1000);
    return res;
  });
};

export const FOLLOWING_POST_AUTHOR = createAsyncActionType('FOLLOWING_POST_AUTHOR');

export const followingPostAuthor = postId => dispatch =>
  dispatch({
    type: FOLLOWING_POST_AUTHOR.SUCCESS,
    payload: postId,
  });

export const pendingFollowingPostAuthor = postId => dispatch =>
  dispatch({
    type: FOLLOWING_POST_AUTHOR.START,
    payload: postId,
  });

export const errorFollowingPostAuthor = postId => dispatch =>
  dispatch({
    type: FOLLOWING_POST_AUTHOR.ERROR,
    payload: postId,
  });

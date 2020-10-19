import { message } from 'antd';
import { createAsyncActionType } from '../helpers/stateHelpers';
import * as ApiClient from '../../waivioApi/ApiClient';
import { getAuthenticatedUserName, getLocale } from '../reducers';
import { subscribeMethod, subscribeTypes } from '../../common/constants/blockTypes';

export const GET_CONTENT = createAsyncActionType('@post/GET_CONTENT');

export const LIKE_POST = createAsyncActionType('@post/LIKE_POST');
export const FAKE_REBLOG_POST = '@post/FAKE_REBLOG_POST';
export const LIKE_POST_HISTORY = '@post/LIKE_POST_HISTORY';

export const getContent = (author, permlink, afterLike) => (dispatch, getState) => {
  if (!author || !permlink) {
    return null;
  }
  const state = getState();
  const locale = getLocale(state);
  const follower = getAuthenticatedUserName(state);

  return dispatch({
    type: GET_CONTENT.ACTION,
    payload: {
      promise: ApiClient.getContent(author, permlink, locale, follower).then(res => {
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
  { steemConnectAPI, busyAPI },
) => {
  const { auth, posts } = getState();
  const isGuest = auth.isGuestUser;
  const post = posts.list[postId];
  const voter = auth.user.name;

  if (!auth.isAuthenticated) return null;

  return dispatch({
    type: LIKE_POST.ACTION,
    payload: {
      promise: steemConnectAPI
        .vote(voter, author, post.permlink, weight)
        .then(async data => {
          const res = isGuest ? await data.json() : data.result;

          if (data.status !== 200 && isGuest) throw new Error(data.message);
          if (window.analytics)
            window.analytics.track('Vote', { category: 'vote', label: 'submit', value: 1 });

          busyAPI.sendAsync(subscribeMethod, [voter, res.block_num, subscribeTypes.votes]);
          busyAPI.subscribe((response, mess) => {
            if (
              subscribeTypes.votes === mess.type &&
              mess.notification.blockParsed === res.block_num
            ) {
              dispatch(getContent(author, post.permlink, true));
            }
          });

          return res;
        })
        .catch(e => message.error(e)),
    },
    meta: { postId, voter, weight },
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

  if (!auth.isAuthenticated) {
    return null;
  }

  return dispatch({
    type: LIKE_POST_HISTORY,
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

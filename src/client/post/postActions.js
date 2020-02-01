import {createAsyncActionType} from '../helpers/stateHelpers';
import * as ApiClient from '../../waivioApi/ApiClient';

export const GET_CONTENT = createAsyncActionType('@post/GET_CONTENT');

export const LIKE_POST = '@post/LIKE_POST';
export const LIKE_POST_START = '@post/LIKE_POST_START';
export const LIKE_POST_SUCCESS = '@post/LIKE_POST_SUCCESS';
export const LIKE_POST_ERROR = '@post/LIKE_POST_ERROR';
export const FAKE_LIKE_POST = '@post/FAKE_LIKE_POST';
export const FAKE_LIKE_POST_START = '@post/FAKE_LIKE_POST_START';
export const FAKE_LIKE_POST_SUCCESS = '@post/FAKE_LIKE_POST_SUCCESS';
export const FAKE_LIKE_POST_ERROR = '@post/FAKE_LIKE_POST_ERROR';

export const getContent = (author, permlink, afterLike) => dispatch => {
  if (!author || !permlink) {
    return null;
  }

  return dispatch({
    type: GET_CONTENT.ACTION,
    payload: {
      promise: ApiClient.getContent(author, permlink).then(res => {
        if (res.id === 0) throw new Error('There is no such post');
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
  const {auth, posts} = getState();
  if (!auth.isAuthenticated) {
    return null;
  }
  const isGuest = auth.isGuestUser;
  const post = posts.list[postId];
  const voter = auth.user.name;
  const TYPE = isGuest ? FAKE_LIKE_POST : LIKE_POST;
  const votedPostAuthor = post.guestInfo ? post.author : author;
  return dispatch({
    type: TYPE,
    payload: {
      promise: steemConnectAPI.vote(voter, author, post.permlink, weight).then(res => {
        if (res.status === 200 && isGuest) {
          return {isFakeLikeOk: true};
        }
        if (window.analytics) {
          window.analytics.track('Vote', {
            category: 'vote',
            label: 'submit',
            value: 1,
          });
        }

        // // Delay to make sure you get the latest data (unknown issue with API)
        if (!isGuest) {
          setTimeout(
            () =>
              dispatch(getContent(post.author_original || votedPostAuthor, post.permlink, true)),
            1000,
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
      : {postId, voter, weight},
  });
};

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

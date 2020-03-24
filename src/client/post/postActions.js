import { message } from 'antd';

import { createAsyncActionType } from '../helpers/stateHelpers';
import * as ApiClient from '../../waivioApi/ApiClient';
import { voteAppends } from '../object/wobjActions';

export const GET_CONTENT = createAsyncActionType('@post/GET_CONTENT');
export const ADD_NEW_FIELD = '@wobj/ADD_NEW_FIELD';

export const LIKE_POST = '@post/LIKE_POST';
export const LIKE_POST_START = '@post/LIKE_POST_START';
export const LIKE_POST_SUCCESS = '@post/LIKE_POST_SUCCESS';
export const LIKE_POST_ERROR = '@post/LIKE_POST_ERROR';
export const FAKE_LIKE_POST = '@post/FAKE_LIKE_POST';
export const FAKE_LIKE_POST_START = '@post/FAKE_LIKE_POST_START';
export const FAKE_LIKE_POST_SUCCESS = '@post/FAKE_LIKE_POST_SUCCESS';
export const FAKE_LIKE_POST_ERROR = '@post/FAKE_LIKE_POST_ERROR';

export const VOTE_UPDATE_START = '@post/VOTE_UPDATE_START';
export const VOTE_UPDATE_SUCCESS = '@post/VOTE_UPDATE_SUCCESS';
export const VOTE_UPDATE_REJECT = '@post/VOTE_UPDATE_REJECT';

export const getContent = (author, permlink, afterLike) => dispatch => {
  if (!author || !permlink) {
    return null;
  }

  // eslint-disable-next-line consistent-return
  const doApiRequest = () => ApiClient.getContent(author, permlink);

  return dispatch({
    type: GET_CONTENT.ACTION,
    payload: {
      promise: doApiRequest().then(res => {
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
      : { postId, voter, weight },
  });
};

export const votePostUpdate = (postId, author, permlink, weight = 10000, type) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const { auth, posts } = getState();
  const post = posts.list[postId];
  const voter = auth.user.name;
  const voteData = {
    postId,
    voter,
    weight,
    postPermlink: postId,
    percent: weight,
    type,
  };

  if (!auth.isAuthenticated) {
    return null;
  }

  dispatch({
    type: VOTE_UPDATE_START,
    payload: {
      postId,
    },
  });

  return steemConnectAPI
    .vote(voter, post.author_original || author, post.permlink, weight)
    .then(() => {
      setTimeout(
        () =>
          dispatch({
            type: VOTE_UPDATE_SUCCESS,
            payload: {
              ...voteData,
            },
          }),
        2000,
      );

      dispatch(voteAppends(permlink, { ...voteData }));
    })
    .catch(e => {
      message.error(e.error_description);
      dispatch({
        type: VOTE_UPDATE_REJECT,
        payload: {
          postId,
        },
      });
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

export const addNewFields = postData => dispatch => {
  dispatch({
    type: ADD_NEW_FIELD,
    payload: { ...postData },
  });
};

export const addPost = () => 8;

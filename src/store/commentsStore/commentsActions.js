import { get } from 'lodash';
import { createCommentPermlink, getLastBlockNum } from '../../client/vendor/steemitHelpers';
import { notify } from '../../client/app/Notification/notificationActions';
import { jsonParse } from '../../common/helpers/formatter';
import { createPostMetadata } from '../../common/helpers/postHelpers';
import { createAsyncActionType, getPostKey } from '../../common/helpers/stateHelpers';
import { findRoot } from '../../common/helpers/commentHelpers';
import * as ApiClient from '../../waivioApi/ApiClient';
import { subscribeMethod, subscribeTypes } from '../../common/constants/blockTypes';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
  isGuestUser,
} from '../authStore/authSelectors';
import { getCommentsList } from './commentsSelectors';
import { getLocale } from '../settingsStore/settingsSelectors';
import { getAppendList } from '../appendStore/appendSelectors';
import { updateCounter } from '../appendStore/appendActions';
import { getCurrentShownPost } from '../appStore/appSelectors';
import { editThreadState } from '../feedStore/feedActions';
import { getContent } from '../postsStore/postActions';

export const GET_SINGLE_COMMENT = createAsyncActionType('@comments/GET_SINGLE_COMMENT');

export const GET_COMMENTS = createAsyncActionType('@comments/GET_COMMENTS');

export const SEND_COMMENT = '@comments/SEND_COMMENT';
export const SEND_COMMENT_START = '@comments/SEND_COMMENT_START';
export const SEND_COMMENT_SUCCESS = '@comments/SEND_COMMENT_SUCCESS';
export const SEND_COMMENT_ERROR = '@comments/SEND_COMMENT_ERROR';

export const LIKE_COMMENT = createAsyncActionType('@comments/LIKE_COMMENT');
export const FAKE_COMMENT_SUCCESS = '@comments/FAKE_COMMENT_SUCCESS';

export const FAKE_LIKE_COMMENT = createAsyncActionType('@comments/FAKE_LIKE_COMMENT');

export const GET_RESERVED_COMMENTS = '@comments/GET_RESERVED_COMMENTS';
export const GET_RESERVED_COMMENTS_SUCCESS = '@comments/GET_RESERVED_COMMENTS_SUCCESS';

export const getSingleComment = (author, permlink, focus = false) => (dispatch, getState) => {
  const state = getState();
  const locale = getLocale(state);
  const follower = getAuthenticatedUserName(state);

  return dispatch({
    type: GET_SINGLE_COMMENT.ACTION,
    payload: ApiClient.getContent(author, permlink, locale, follower).then(res => res),
    meta: { focus },
  });
};

export const getFakeSingleComment = (
  parentAuthor,
  parentPermlink,
  author,
  permlink,
  body,
  jsonMetadata,
  focus = false,
) => (dispatch, getState) => {
  const state = getState();
  const date = new Date().toISOString().split('.')[0];
  const id = `${parentAuthor}/${parentPermlink}`;
  const depth = state.comments.comments[id] ? state.comments.comments[id].depth + 1 : 0;
  const authorGuest = state.auth.isGuestUser ? state.auth.user.name : author;
  const payload = new Promise(resolve => {
    resolve({
      category: 'waivio',
      author,
      authorGuest,
      permlink,
      parent_author: parentAuthor,
      parent_permlink: parentPermlink,
      isFakeComment: true,
      focus,
      json_metadata: JSON.stringify(jsonMetadata),
      author_reputation: 0,
      cashout_time: date,
      active_votes: [],
      body,
      depth,
      author_wobjects_weight: 0,
      created: date,
      id,
      url: `/@${author}`,
      guestInfo: {
        userId: parentAuthor,
      },
    });
  });

  dispatch({
    type: GET_SINGLE_COMMENT.ACTION,
    payload: {
      promise: payload,
    },
    meta: { focus },
  });
};

const getRootCommentsList = apiRes => {
  if (!apiRes) return [];

  return Object.keys(apiRes.content)
    .filter(commentKey => apiRes.content[commentKey].depth === 1)
    ?.map(commentKey => getPostKey(apiRes.content[commentKey]));
};

const getCommentsChildrenLists = apiRes => {
  const listsById = {};

  Object.keys(apiRes.content).forEach(commentKey => {
    listsById[getPostKey(apiRes.content[commentKey])] = apiRes.content[commentKey].replies.map(
      childKey => apiRes.content[childKey] && getPostKey(apiRes.content[childKey]),
    );
  });

  return listsById;
};

/**
 * Fetches comments from blockchain.
 * @param {number} postId Id of post to fetch comments from
 * @param originalAuthor is bot name of append object comment
 * preventing loading icon to be dispalyed
 */
export const getComments = postId => (dispatch, getState) => {
  const state = getState();
  const { posts, comments } = state;
  const userName = getAuthenticatedUserName(state);
  const listFields = getAppendList(state);
  const matchPost = listFields && listFields.find(field => field.permlink === postId);
  const currentShownPost = getCurrentShownPost(state);
  const content = posts.list[postId] || comments.comments[postId] || matchPost || currentShownPost;
  const locale = getLocale(state);

  if (content) {
    const { category, permlink } = content;
    const author =
      get(content, 'guestInfo.userId') === content.author ? content.root_author : content.author;

    dispatch({
      type: GET_COMMENTS.ACTION,
      payload: {
        promise: ApiClient.getPostCommentsFromApi({
          category,
          author,
          permlink,
          locale,
          userName,
        })
          .then(apiRes => ({
            rootCommentsList: getRootCommentsList(apiRes),
            commentsChildrenList: getCommentsChildrenLists(apiRes),
            content: apiRes.content,
          }))
          .catch(e => console.error(e)),
      },
      meta: {
        id: postId,
      },
    });
  }
};

export const editThread = (threadData, callback) => (
  dispatch,
  getState,
  { steemConnectAPI, busyAPI },
) => {
  const { permlink, parentPermlink, author, body, jsonMetadata } = threadData;
  const { auth } = getState();
  const id = `${author}/${permlink}`;

  dispatch(editThreadState(threadData.body, id));

  return steemConnectAPI
    .comment('leothreads', parentPermlink, author, permlink, '', body, jsonMetadata, author)
    .then(res => {
      if (res.error) throw new Error();
      if (res.ok || res.result) {
        busyAPI.instance.sendAsync(subscribeTypes.subscribeTransactionId, [
          auth.user.name,
          res.result.id,
        ]);
        busyAPI.instance.subscribe((response, mess) => {
          if (mess?.success && mess?.permlink === res.result.id) {
            if (callback) callback();
          }
        });

        if (typeof window !== 'undefined' && window.gtag)
          window.gtag('event', 'publish_comment', { debug_mode: false });
      }

      return res;
    })
    .catch(err => {
      if (err) dispatch(notify(err.error.message || err.error_description, 'error'));
      dispatch(SEND_COMMENT_ERROR);
    });
};
export const sendComment = (
  parentPost,
  newBody,
  isUpdating = false,
  originalComment,
  isThread = false,
  callback,
) => (dispatch, getState, { steemConnectAPI, busyAPI }) => {
  const { category, permlink: parentPermlink } = parentPost;
  let parentAuthor = parentPost.author;

  if (
    !isUpdating &&
    parentPost.guestInfo &&
    get(parentPost, 'guestInfo.userId', '') === parentPost.author
  ) {
    parentAuthor = parentPost.root_author;
  }

  const guestParentAuthor = get(parentPost, ['guestInfo', 'userId']);
  const { auth, comments } = getState();

  if (!auth.isAuthenticated) {
    return dispatch(notify('You have to be logged in to comment', 'error'));
  }

  if (!newBody || !newBody.length) {
    return dispatch(notify("Message can't be empty", 'error'));
  }

  const author = isUpdating ? originalComment.author : auth.user.name;
  const permlink = isUpdating
    ? originalComment.permlink
    : createCommentPermlink(parentAuthor, parentPermlink);
  const currCategory = category ? [category] : [];
  const jsonMetadata = createPostMetadata(
    newBody,
    currCategory,
    isUpdating ? jsonParse(originalComment.json_metadata) : { host: location?.hostname },
  );

  if (parentPost.parent_author) {
    const { comments: commentsState } = comments;
    const commentsWithBotAuthor = {};

    Object.values(commentsState).forEach(val => {
      commentsWithBotAuthor[`${val.author}/${val.permlink}`] = val;
    });
  }

  return steemConnectAPI
    .comment(
      parentAuthor,
      parentPermlink,
      author,
      permlink,
      '',
      newBody,
      jsonMetadata,
      parentPost.root_author,
    )
    .then(res => {
      if (res.error) throw new Error();
      if (res.ok || res.result) {
        if (isThread) {
          busyAPI.instance.sendAsync(subscribeTypes.subscribeTransactionId, [
            auth.user.name,
            res.result.id,
          ]);
          busyAPI.instance.subscribe((response, mess) => {
            if (mess?.success && mess?.permlink === res.result.id) {
              callback();
            }
          });
        }
        dispatch(
          getFakeSingleComment(
            guestParentAuthor || parentAuthor,
            parentPermlink,
            author,
            permlink,
            newBody,
            jsonMetadata,
            !isUpdating,
          ),
        );

        if (parentPost.name) {
          dispatch(updateCounter(parentPost));
        } else {
          setTimeout(
            () => dispatch(getSingleComment(parentPost.author, parentPost.permlink, !isUpdating)),
            auth.isGuestUser ? 6000 : 2000,
          );
        }

        if (typeof window !== 'undefined' && window.gtag)
          window.gtag('event', 'publish_comment', { debug_mode: false });
      }

      return res;
    })
    .catch(err => {
      if (err) dispatch(notify(err.error.message || err.error_description, 'error'));
      dispatch(SEND_COMMENT_ERROR);
    });
};

export const sendCommentMessages = (
  parentPost,
  body,
  isUpdating = false,
  originalComment,
  parentAuthorIfGuest,
  parentPermlinkIfGuest,
) => (dispatch, getState, { steemConnectAPI }) => {
  const { category, id, permlink: parentPermlink } = parentPost;
  let parentAuthor;

  if (isUpdating) {
    parentAuthor = originalComment.parent_author;
  } else if (parentPost.guestInfo) {
    parentAuthor = parentAuthorIfGuest;
  } else {
    parentAuthor = parentPost.author;
  }
  const { auth, comments } = getState();

  if (!auth.isAuthenticated) {
    return dispatch(notify('You have to be logged in to comment', 'error'));
  }

  if (!body || !body.length) {
    return dispatch(notify("Message can't be empty", 'error'));
  }

  const parentPermlinkToSend = parentPermlinkIfGuest || parentPermlink;

  const author = isUpdating ? originalComment.author : auth.user.name;
  const permlink = isUpdating
    ? originalComment.permlink
    : createCommentPermlink(parentAuthor, parentPermlinkToSend);
  const currCategory = category ? [category] : [];

  const jsonMetadata = createPostMetadata(
    body,
    currCategory,
    isUpdating && jsonParse(originalComment.json_metadata),
  );

  const newBody = body;

  let rootPostId = null;

  if (parentPost.parent_author) {
    const { comments: commentsState } = comments;
    const commentsWithBotAuthor = {};

    Object.values(commentsState).forEach(val => {
      commentsWithBotAuthor[`${val.author}/${val.permlink}`] = val;
    });
    rootPostId = getPostKey(findRoot(commentsWithBotAuthor, parentPost));
  }

  const rootAuthor = parentPost.guestInfo ? get(parentPost, ['author']) : parentPost.root_author;

  return dispatch({
    type: SEND_COMMENT,
    payload: {
      promise: steemConnectAPI
        .comment(
          parentAuthor,
          parentPermlinkToSend,
          author,
          permlink,
          '',
          newBody,
          jsonMetadata,
          rootAuthor,
        )
        .catch(err => {
          dispatch(notify(err.error.message || err.error_description, 'error'));
          dispatch(SEND_COMMENT_ERROR);
        }),
    },
    meta: {
      parentId: parentPost.id,
      rootPostId,
      isEditing: isUpdating,
      isReplyToComment: parentPost.id !== id,
    },
  });
};

export const likeComment = (commentId, weight = 10000, vote = 'like', retryCount = 0, isPost) => (
  dispatch,
  getState,
  { steemConnectAPI, busyAPI },
) => {
  const state = getState();
  const comments = getCommentsList(state);
  const isAuthenticated = getIsAuthenticated(state);

  if (!isAuthenticated) return;

  const voter = getAuthenticatedUserName(state);
  const isGuest = isGuestUser(state);
  const { author, permlink } = comments[commentId];

  dispatch({
    type: LIKE_COMMENT.ACTION,
    payload: {
      promise: steemConnectAPI.vote(voter, author, permlink, weight).then(async data => {
        const res = isGuest ? await data.json() : data.result;
        const blockNumber = await getLastBlockNum();
        const postCallback = () => {
          dispatch(getContent(author, permlink, false, true));
        };
        const subscribeCallback = () =>
          isPost ? postCallback() : dispatch(getSingleComment(author, permlink));

        if (data.status !== 200 && isGuest) throw new Error(data.message);
        busyAPI.instance.sendAsync(subscribeMethod, [voter, blockNumber, subscribeTypes.votes]);
        busyAPI.instance.subscribeBlock(subscribeTypes.votes, blockNumber, subscribeCallback);

        return res;
      }),
    },
    meta: { commentId, voter, weight, vote, isRetry: retryCount > 0, percent: weight },
  }).catch(err => {
    if (err.res && err.res.status === 500 && retryCount <= 5) {
      dispatch(likeComment(commentId, weight, vote, retryCount + 1));
    }
  });
};

export const getReservedComments = ({ category, author, permlink }) => (dispatch, getState) => {
  const state = getState();
  const locale = getLocale(state);
  const userName = getAuthenticatedUserName(getState());

  return dispatch({
    type: GET_RESERVED_COMMENTS,
    payload: {
      promise: ApiClient.getPostCommentsFromApi({
        category,
        author,
        permlink,
        locale,
        userName,
      }).then(apiRes => ({
        rootCommentsList: getRootCommentsList(apiRes),
        commentsChildrenList: getCommentsChildrenLists(apiRes),
        content: apiRes.content,
      })),
    },
  });
};

export const HIDE_COMMENT = createAsyncActionType('@comments/HIDE_COMMENT');

export const handleHideComment = comment => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();
  const userName = getAuthenticatedUserName(state);
  const action = comment.isHide ? 'unhide' : 'hide';

  return dispatch({
    type: HIDE_COMMENT.ACTION,
    payload: {
      promise: steemConnectAPI.hideComment(userName, comment.author, comment.permlink, action),
    },
    meta: {
      comment,
    },
  });
};

export const MUTE_AUTHOR_COMMENT = createAsyncActionType('@comments/MUTE_AUTHOR_COMMENT');

export const muteAuthorComment = comment => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();
  const userName = getAuthenticatedUserName(state);
  const action = comment.muted ? [] : ['ignore'];

  return dispatch({
    type: MUTE_AUTHOR_COMMENT.ACTION,
    payload: {
      promise: steemConnectAPI.muteUser(userName, comment.author, action),
    },
    meta: {
      comment,
    },
  });
};

import { createCommentPermlink, getBodyPatchIfSmaller } from '../vendor/steemitHelpers';
import { notify } from '../app/Notification/notificationActions';
import { jsonParse } from '../helpers/formatter';
import { createPostMetadata } from '../helpers/postHelpers';
import { createAsyncActionType, getPostKey } from '../helpers/stateHelpers';
import { findRoot } from '../helpers/commentHelpers';
import * as ApiClient from '../../waivioApi/ApiClient';

export const GET_SINGLE_COMMENT = createAsyncActionType('@comments/GET_SINGLE_COMMENT');

export const GET_COMMENTS = '@comments/GET_COMMENTS';
export const GET_COMMENTS_START = '@comments/GET_COMMENTS_START';
export const GET_COMMENTS_SUCCESS = '@comments/GET_COMMENTS_SUCCESS';
export const GET_COMMENTS_ERROR = '@comments/GET_COMMENTS_ERROR';

export const SEND_COMMENT = '@comments/SEND_COMMENT';
export const SEND_COMMENT_START = '@comments/SEND_COMMENT_START';
export const SEND_COMMENT_SUCCESS = '@comments/SEND_COMMENT_SUCCESS';
export const SEND_COMMENT_ERROR = '@comments/SEND_COMMENT_ERROR';

export const LIKE_COMMENT = createAsyncActionType('@comments/LIKE_COMMENT');

export const FAKE_LIKE_COMMENT = createAsyncActionType('@comments/FAKE_LIKE_COMMENT');

export const getSingleComment = (author, permlink, focus = false) => dispatch =>
  dispatch({
    type: GET_SINGLE_COMMENT.ACTION,
    payload: ApiClient.getContent(author, permlink).then(res => res),
    meta: { focus },
  });

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

const getRootCommentsList = apiRes =>
  Object.keys(apiRes.content)
    .filter(commentKey => apiRes.content[commentKey].depth === 1)
    .map(commentKey => getPostKey(apiRes.content[commentKey]));

const getCommentsChildrenLists = apiRes => {
  const listsById = {};
  Object.keys(apiRes.content).forEach(commentKey => {
    listsById[getPostKey(apiRes.content[commentKey])] = apiRes.content[
      commentKey
    ].replies.map(childKey => getPostKey(apiRes.content[childKey]));
  });
  return listsById;
};

/**
 * Fetches comments from blockchain.
 * @param {number} postId Id of post to fetch comments from
 * @param originalAuthor is bot name of append object comment
 * preventing loading icon to be dispalyed
 */
export const getComments = (postId, author) => (dispatch, getState) => {
  const { posts, comments } = getState();

  const content = posts.list[postId] || comments.comments[postId];

  // eslint-disable-next-line camelcase
  const { category, permlink } = content;

  if (!author) {
    // eslint-disable-next-line no-param-reassign
    author = content.guestInfo ? content.root_author : content.author;
  }

  dispatch({
    type: GET_COMMENTS,
    payload: {
      promise: ApiClient.getPostCommentsFromApi({ category, author, permlink }).then(apiRes => ({
        rootCommentsList: getRootCommentsList(apiRes),
        commentsChildrenList: getCommentsChildrenLists(apiRes),
        content: apiRes.content,
      })),
    },
    meta: {
      id: postId,
    },
  });
};

export const sendComment = (parentPost, body, isUpdating = false, originalComment) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const { category, id, permlink: parentPermlink } = parentPost;

  let parentAuthor;

  if (isUpdating) {
    parentAuthor = originalComment.parent_author;
  } else if (parentPost.root_author && parentPost.guestInfo) {
    parentAuthor = parentPost.root_author;
  } else {
    parentAuthor = parentPost.author;
  }

  const guestParentAuthor = parentPost.guestInfo && parentPost.guestInfo.userId;
  const { auth, comments } = getState();

  if (!auth.isAuthenticated) {
    return dispatch(notify('You have to be logged in to comment', 'error'));
  }

  if (!body || !body.length) {
    return dispatch(notify("Message can't be empty", 'error'));
  }

  const author = isUpdating ? originalComment.author : auth.user.name;
  const permlink = isUpdating
    ? originalComment.permlink
    : createCommentPermlink(parentAuthor, parentPermlink);

  const jsonMetadata = createPostMetadata(
    body,
    [category],
    isUpdating && jsonParse(originalComment.json_metadata),
  );

  const newBody =
    isUpdating && !auth.isGuestUser ? getBodyPatchIfSmaller(originalComment.body, body) : body;

  let rootPostId = null;
  if (parentPost.parent_author) {
    const { comments: commentsState } = comments;
    const commentsWithBotAuthor = {};
    Object.values(commentsState).forEach(val => {
      commentsWithBotAuthor[`${val.author}/${val.permlink}`] = val;
    });
    rootPostId = getPostKey(findRoot(commentsWithBotAuthor, parentPost));
  }

  return dispatch({
    type: SEND_COMMENT,
    payload: {
      promise: steemConnectAPI
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
        .then(() => {
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
          // eslint-disable-next-line no-unused-expressions
          setTimeout(
            () => dispatch(getSingleComment(author, permlink, !isUpdating)),
            auth.isGuestUser ? 6000 : 2000,
          );

          if (window.analytics) {
            window.analytics.track('Comment', {
              category: 'comment',
              label: 'submit',
              value: 3,
            });
          }
        })
        .catch(err => {
          dispatch(notify(err.error.message || err.error_description, 'error'));
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

export const likeComment = (commentId, weight = 10000, vote = 'like', retryCount = 0) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const { auth, comments } = getState();

  if (!auth.isAuthenticated) {
    return;
  }

  const voter = auth.user.name;
  const { author, permlink } = comments.comments[commentId];
  const TYPE = auth.isGuestUser ? FAKE_LIKE_COMMENT.ACTION : LIKE_COMMENT.ACTION;

  dispatch({
    type: TYPE,
    payload: {
      promise: steemConnectAPI.vote(voter, author, permlink, weight).then(data => {
        if (data.status === 200) {
          return { voter, rshares: '0', percent: weight, reputation: 0 };
        }
        dispatch(getSingleComment(author, permlink));
        return data;
      }),
    },
    meta: { commentId, voter, weight, vote, isRetry: retryCount > 0, percent: weight },
  }).catch(err => {
    if (err.res && err.res.status === 500 && retryCount <= 5) {
      dispatch(likeComment(commentId, weight, vote, retryCount + 1));
    }
  });
};

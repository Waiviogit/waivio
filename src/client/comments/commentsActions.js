import { createCommentPermlink, getBodyPatchIfSmaller } from '../vendor/steemitHelpers';
import { notify } from '../app/Notification/notificationActions';
import { jsonParse } from '../helpers/formatter';
import { createPostMetadata } from '../helpers/postHelpers';
import { createAsyncActionType, getPostKey } from '../helpers/stateHelpers';
import { findRoot } from '../helpers/commentHelpers';

export const GET_SINGLE_COMMENT = createAsyncActionType('@comments/GET_SINGLE_COMMENT');

export const GET_COMMENTS = 'GET_COMMENTS';
export const GET_COMMENTS_START = 'GET_COMMENTS_START';
export const GET_COMMENTS_SUCCESS = 'GET_COMMENTS_SUCCESS';
export const GET_COMMENTS_ERROR = 'GET_COMMENTS_ERROR';

export const SEND_COMMENT = 'SEND_COMMENT';
export const SEND_COMMENT_START = 'SEND_COMMENT_START';
export const SEND_COMMENT_SUCCESS = 'SEND_COMMENT_SUCCESS';
export const SEND_COMMENT_ERROR = 'SEND_COMMENT_ERROR';

export const LIKE_COMMENT = '@comments/LIKE_COMMENT';
export const LIKE_COMMENT_START = '@comments/LIKE_COMMENT_START';
export const LIKE_COMMENT_SUCCESS = '@comments/LIKE_COMMENT_SUCCESS';
export const LIKE_COMMENT_ERROR = '@comments/LIKE_COMMENT_ERROR';

export const getSingleComment = (author, permlink, focus = false) => (
  dispatch,
  getState,
  { steemAPI },
) =>
  dispatch({
    type: GET_SINGLE_COMMENT.ACTION,
    payload: steemAPI.sendAsync('get_content', [author, permlink]),
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
  const payload = new Promise(resolve => {
    resolve({
      author,
      permlink,
      parent_author: parentAuthor,
      parent_permlink: parentPermlink,
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
export const getComments = (postId, originalAuthor) => (dispatch, getState, { steemAPI }) => {
  const { posts, comments } = getState();

  const content = posts.list[postId] || comments.comments[postId];

  // eslint-disable-next-line camelcase
  const { category, root_author, permlink } = content;

  dispatch({
    type: GET_COMMENTS,
    payload: {
      promise: steemAPI
        // eslint-disable-next-line camelcase
        .sendAsync('get_state', [`/${category}/@${originalAuthor || root_author}/${permlink}`])
        .then(apiRes => ({
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
  const { category, id, permlink: parentPermlink, author: parentAuthor } = parentPost;
  const { auth, comments } = getState();

  if (!auth.isAuthenticated) {
    return dispatch(notify('You have to be logged in to comment', 'error'));
  }

  if (!body || !body.length) {
    return dispatch(notify("Message can't be empty", 'error'));
  }

  const author = auth.isGuestUser && isUpdating ? originalComment.author : auth.user.name;
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
    rootPostId = getPostKey(findRoot(commentsState, parentPost));
  }

  return dispatch({
    type: SEND_COMMENT,
    payload: {
      promise: steemConnectAPI
        .comment(parentAuthor, parentPermlink, author, permlink, '', newBody, jsonMetadata)
        .then(() => {
          if (auth.isGuestUser) {
            dispatch(
              getFakeSingleComment(
                parentAuthor,
                parentPermlink,
                author,
                permlink,
                newBody,
                jsonMetadata,
                !isUpdating,
              ),
            );
          } else {
            dispatch(getSingleComment(author, permlink, !isUpdating));
          }

          if (window.analytics) {
            window.analytics.track('Comment', {
              category: 'comment',
              label: 'submit',
              value: 3,
            });
          }
        }),
    },
    meta: {
      parentId: parentPost.id,
      rootPostId,
      isEditing: false,
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

  dispatch({
    type: LIKE_COMMENT,
    payload: {
      promise: steemConnectAPI.vote(voter, author, permlink, weight).then(res => {
        dispatch(getSingleComment(author, permlink));
        return res;
      }),
    },
    meta: { commentId, voter, weight, vote, isRetry: retryCount > 0 },
  }).catch(err => {
    if (err.res && err.res.status === 500 && retryCount <= 5) {
      dispatch(likeComment(commentId, weight, vote, retryCount + 1));
    }
  });
};

import { createAction } from 'redux-actions';
import { createCommentPermlink, getBodyPatchIfSmaller } from '../vendor/steemitHelpers';
import { notify } from '../app/Notification/notificationActions';
import { jsonParse } from '../helpers/formatter';
import { createPostMetadata } from '../helpers/postHelpers';
import { getPostKey } from '../helpers/stateHelpers';
import { findRoot } from '../helpers/commentHelpers';

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

export const RELOAD_EXISTING_COMMENT = '@comments/RELOAD_EXISTING_COMMENT';
export const reloadExistingComment = createAction(RELOAD_EXISTING_COMMENT, undefined, data => ({
  commentId: getPostKey(data),
}));

const getRootCommentsList = content =>
  Object.keys(content)
    .filter(commentKey => content[commentKey].depth === 1)
    .map(commentKey => getPostKey(content[commentKey]));

const getCommentsChildrenLists = content => {
  const listsById = {};
  Object.keys(content).forEach(commentKey => {
    listsById[getPostKey(content[commentKey])] = content[commentKey].replies.map(childKey =>
      getPostKey(content[childKey]),
    );
  });

  return listsById;
};

const getDummyComment = (child, parent) => {
  const date = new Date(Date.now() - 2000);
  return {
    ...child,
    post_id: Date.now().toFixed(),
    category: parent.category,
    created: date.toISOString().slice(0, 22),
    last_update: date.toISOString().slice(0, 22),
    depth: parent.depth + 1,
    children: 0,
    net_rshares: 0,
    last_payout: '1969-12-31T23:59:59',
    cashout_time: new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 22),
    total_payout_value: '0.000 SBD',
    curator_payout_value: '0.000 SBD',
    pending_payout_value: '0.000 SBD',
    promoted: '0.000 SBD',
    replies: [],
    body_length: child.body.length,
    active_votes: [],
    author_reputation: 1,
    url: `/${parent.category}/@${parent.author}/${parent.permlink}#@${child.author}/${
      child.permlink
    }`,
    root_title: parent.title,
    beneficiaries: [],
    max_accepted_payout: '1000000.000 SBD',
    percent_steem_dollars: 10000,
  };
};

/**
 * Fetches comments from blockchain.
 * @param {number} postId Id of post to fetch comments from
 * @param {boolean} reload If set to true isFetching won't be set to true
 * preventing loading icon to be dispalyed
 * @param {object} focusedComment Object with author and permlink to which focus after loading
 */
export const getComments = (postId, reload = false, focusedComment = undefined) => (
  dispatch,
  getState,
  { steemAPI },
) => {
  const { posts, comments } = getState();

  const content = posts.list[postId] || comments.comments[postId];

  const { category, author, permlink } = content;

  dispatch({
    type: GET_COMMENTS,
    payload: {
      promise: steemAPI
        .sendAsync('get_state', [`/${category}/@${author}/${permlink}`])
        .then(apiRes => {
          let resContent = apiRes.content;
          if (focusedComment) {
            const parentKey = `${focusedComment.parent_author}/${focusedComment.parent_permlink}`;
            const focusedCommentKey = getPostKey(focusedComment);
            resContent = {
              ...resContent,
              [parentKey]: {
                ...resContent[parentKey],
                replies: [...resContent[parentKey].replies, focusedCommentKey],
              },
              [focusedCommentKey]: {
                ...focusedComment,
                ...resContent[focusedCommentKey],
              },
            };
          }

          return {
            rootCommentsList: getRootCommentsList(resContent),
            commentsChildrenList: getCommentsChildrenLists(resContent),
            content: resContent,
          };
        }),
    },
    meta: {
      id: postId,
      reload,
      focusedComment,
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

  const author = auth.user.name;
  const permlink = isUpdating
    ? originalComment.permlink
    : createCommentPermlink(parentAuthor, parentPermlink);

  const jsonMetadata = createPostMetadata(
    body,
    [category],
    isUpdating && jsonParse(originalComment.json_metadata),
  );

  const newBody = isUpdating ? getBodyPatchIfSmaller(originalComment.body, body) : body;

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
        // .comment('', '', author, '', '', newBody, jsonMetadata)
        .then(resp => {
          const focusedComment = getDummyComment(resp.result.operations[0][1], parentPost);
          dispatch(getComments(id, true, focusedComment));

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
  { steemAPI, steemConnectAPI },
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
        // reload comment data to fetch payout after vote
        steemAPI.sendAsync('get_content', [author, permlink]).then(data => {
          dispatch(reloadExistingComment(data));
          return data;
        });
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

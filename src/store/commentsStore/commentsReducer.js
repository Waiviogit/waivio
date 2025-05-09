import { mapValues, omit, uniq } from 'lodash';
import * as commentsTypes from './commentsActions';
import { getPostKey, getParentKey } from '../../common/helpers/stateHelpers';

const initialState = {
  childrenById: {},
  comments: {},
  pendingVotes: [],
  fetchingPostId: '',
  isFetching: false,
  isLoaded: false,
};

const childrenById = (state = initialState.childrenById, action) => {
  switch (action.type) {
    case commentsTypes.GET_SINGLE_COMMENT.SUCCESS:
    case commentsTypes.FAKE_LIKE_COMMENT.SUCCESS: {
      const commentKey = getPostKey(action.payload);
      const parentKey = getParentKey(action.payload);
      const oldComments = state[commentKey] || [];

      return {
        ...state,
        [parentKey]: state[parentKey] ? uniq([...state[parentKey], commentKey]) : [commentKey],
        [commentKey]: oldComments,
      };
    }
    case commentsTypes.GET_COMMENTS.SUCCESS:
      return {
        ...state,
        ...action.payload.commentsChildrenList,
      };
    default:
      return state;
  }
};

const mapCommentsBasedOnId = data => {
  const commentsList = {};

  Object.keys(data).forEach(key => {
    const comment = data[key];
    const newKey = getPostKey(data[key]);

    commentsList[newKey] = { ...comment, id: newKey };
  });

  return commentsList;
};

const comments = (state = {}, action) => {
  switch (action.type) {
    case commentsTypes.GET_SINGLE_COMMENT.SUCCESS:
    case commentsTypes.FAKE_LIKE_COMMENT.SUCCESS: {
      const commentKey = getPostKey(action.payload);

      const comment = {
        ...action.payload,
        id: commentKey,
      };

      if (action.meta.focus) comment.focus = true;

      return {
        ...mapValues(state, c => omit(c, 'focus')),
        [commentKey]: comment,
      };
    }
    case commentsTypes.GET_COMMENTS.SUCCESS:
      return {
        ...state,
        ...mapCommentsBasedOnId(action.payload.content, action),
      };
    default:
      return state;
  }
};

const isFetching = (state = initialState.isFetching, action) => {
  switch (action.type) {
    case commentsTypes.GET_COMMENTS.START:
      return true;
    case commentsTypes.GET_COMMENTS.SUCCESS:
    case commentsTypes.GET_COMMENTS.ERROR:
      return false;
    default:
      return state;
  }
};

const fetchingPostId = (state = initialState.fetchingPostId, action) => {
  switch (action.type) {
    case commentsTypes.GET_COMMENTS.START:
      return action.meta.id;
    case commentsTypes.GET_COMMENTS.SUCCESS:
    case commentsTypes.GET_COMMENTS.ERROR:
      return '';
    default:
      return state;
  }
};

const isLoaded = (state = initialState.isLoaded, action) => {
  switch (action.type) {
    case commentsTypes.GET_COMMENTS.START:
      return false;
    case commentsTypes.GET_COMMENTS.SUCCESS:
    case commentsTypes.GET_COMMENTS.ERROR:
      return true;
    default:
      return state;
  }
};

const pendingVotes = (state = initialState.pendingVotes, action) => {
  switch (action.type) {
    case commentsTypes.LIKE_COMMENT.START:
    case commentsTypes.FAKE_LIKE_COMMENT.START:
      return [
        ...state,
        {
          id: action.meta.commentId,
          percent: action.meta.weight,
          vote: action.meta.vote,
        },
      ];
    case commentsTypes.LIKE_COMMENT.ERROR:
    case commentsTypes.FAKE_LIKE_COMMENT.ERROR:
      return state.filter(like => like.id !== action.meta.commentId);
    case commentsTypes.GET_SINGLE_COMMENT.SUCCESS:
    case commentsTypes.FAKE_LIKE_COMMENT.SUCCESS: {
      const commentKey = getPostKey(action.payload);

      return state.filter(({ id }) => id !== commentKey);
    }
    default:
      return state;
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case commentsTypes.FAKE_COMMENT_SUCCESS: {
      return {
        ...state,
        pendingVotes: state.pendingVotes?.filter(item => item.id !== action.meta.commentId),
      };
    }
    case commentsTypes.GET_SINGLE_COMMENT.SUCCESS:
      return {
        ...state,
        childrenById: childrenById(state.childrenById, action),
        comments: comments(state.comments, action),
        pendingVotes: pendingVotes(state.pendingVotes, action),
      };
    case commentsTypes.FAKE_LIKE_COMMENT.SUCCESS: {
      const comment = state.comments[action.meta.commentId];

      comment.active_votes = comment.active_votes.filter(vote => vote.voter !== action.meta.voter);
      comment.active_votes.push(action.payload);
      // eslint-disable-next-line no-param-reassign
      action.payload = comment;

      return {
        ...state,
        childrenById: childrenById(state.childrenById, action),
        comments: comments(state.comments, action),
        pendingVotes: pendingVotes(state.pendingVotes, action),
      };
    }
    case commentsTypes.GET_COMMENTS.START:
    case commentsTypes.GET_COMMENTS.SUCCESS:
    case commentsTypes.GET_COMMENTS.ERROR:
      return {
        ...state,
        comments: comments(state.comments, action),
        childrenById: childrenById(state.childrenById, action),
        fetchingPostId: fetchingPostId(state.fetchingPostId, action),
        isFetching: isFetching(state.isFetching, action),
        isLoaded: isLoaded(state.isLoaded, action),
      };
    case commentsTypes.HIDE_COMMENT.START: {
      const key = getPostKey(action.meta.comment);

      return {
        ...state,
        comments: {
          ...state.comments,
          [key]: {
            ...action.meta.comment,
            loadingHide: true,
          },
        },
      };
    }

    case commentsTypes.HIDE_COMMENT.SUCCESS: {
      const key = getPostKey(action.meta.comment);

      return {
        ...state,
        comments: {
          ...state.comments,
          [key]: {
            ...state.comments[key],
            isHide: !action.meta.comment.isHide,
            loadingHide: false,
          },
        },
      };
    }

    case commentsTypes.MUTE_AUTHOR_COMMENT.START: {
      const key = getPostKey(action.meta.comment);

      return {
        ...state,
        comments: {
          ...state.comments,
          [key]: {
            ...action.meta.comment,
            loadingMute: true,
          },
        },
      };
    }

    case commentsTypes.MUTE_AUTHOR_COMMENT.SUCCESS: {
      const key = getPostKey(action.meta.comment);

      return {
        ...state,
        comments: {
          ...state.comments,
          [key]: {
            ...state.comments[key],
            muted: !action.meta.comment.muted,
            loadingMute: false,
          },
        },
      };
    }

    case commentsTypes.LIKE_COMMENT.START:
    case commentsTypes.LIKE_COMMENT.ERROR:
    case commentsTypes.FAKE_LIKE_COMMENT.START:
    case commentsTypes.FAKE_LIKE_COMMENT.ERROR:
      return {
        ...state,
        pendingVotes: pendingVotes(state.pendingVotes, action),
      };
    default:
      return state;
  }
};

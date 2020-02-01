import {each, find, omit} from 'lodash';
import * as feedTypes from '../feed/feedActions';
import * as postsActions from './postActions';
import * as commentsActions from '../comments/commentsActions';
import {getPostKey} from '../helpers/stateHelpers';

const postItem = (state = {}, action) => {
  switch (action.type) {
    case commentsActions.SEND_COMMENT_SUCCESS:
      return {
        ...state,
        children: parseInt(state.children, 10) + 1,
      };
    default:
      return state;
  }
};

const getPostsList = (list, action) => {
  const resultList = { ...list };

  const rootPost = list[action.meta.rootPostId];
  if (rootPost) {
    resultList[action.meta.rootPostId] = postItem(rootPost, action);
  }
  const parentPost = list[action.meta.parentId];
  if (parentPost) {
    resultList[action.meta.parentId] = postItem(parentPost, action);
  }

  return resultList;
};

const initialState = {
  pendingLikes: {},
  list: {},
  postsStates: {},
};

const posts = (state = initialState, action) => {
  switch (action.type) {
    case feedTypes.GET_USER_COMMENTS.SUCCESS:
    case feedTypes.GET_MORE_USER_COMMENTS.SUCCESS: {
      const commentsMoreList = {};
      action.payload.forEach(comment => {
        const key = getPostKey(comment);
        commentsMoreList[key] = {...comment, id: key};
      });
      return {
        ...state,
        list: {
          ...state.list,
          ...commentsMoreList,
        },
      };
    }
    case feedTypes.GET_USER_COMMENTS.ERROR:
    case feedTypes.GET_MORE_USER_COMMENTS.ERROR:
      return state;
    case feedTypes.GET_MORE_USER_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_USER_FEED_CONTENT.SUCCESS: {
      const list = {
        ...state.list,
      };
      const postsStates = {
        ...state.postsStates,
      };

      each(action.payload, post => {
        const key = getPostKey(post);
        list[key] = {...post, id: key};
        postsStates[key] = {
          fetching: false,
          loaded: true,
          failed: false,
        };
      });

      return {
        ...state,
        list,
        postsStates,
      };
    }

    case feedTypes.GET_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_OBJECT_POSTS.SUCCESS:
    case feedTypes.GET_MORE_OBJECT_POSTS.SUCCESS:
    case feedTypes.GET_MORE_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_REPLIES.SUCCESS:
    case feedTypes.GET_MORE_REPLIES.SUCCESS:
    case feedTypes.GET_BOOKMARKS.SUCCESS: {
      const list = {
        ...state.list,
      };
      const postsStates = {
        ...state.postsStates,
      };

      each(action.payload, post => {
        const key = getPostKey(post);
        list[key] = {...post, id: key};
        postsStates[key] = {
          fetching: false,
          loaded: true,
          failed: false,
        };
      });

      return {
        ...state,
        list,
        postsStates,
      };
    }
    case postsActions.GET_CONTENT.START:
      if (action.meta.afterLike) return state;
      return {
        ...state,
        postsStates: {
          ...state.postsStates,
          [getPostKey(action.meta)]: {
            fetching: true,
            loaded: false,
            failed: false,
          },
        },
      };
    case postsActions.GET_CONTENT.SUCCESS: {
      let key = getPostKey(action.payload);
      let author = action.payload.author;
      let pendingLikes = state.pendingLikes;
      if (action.meta.afterLike) {
        const matchPost = find(
          state.list,
          post => `${post.author_original}/${post.permlink}` === key,
        );
        if (matchPost) {
          key = getPostKey(matchPost);
          author = matchPost.author;
        }
        pendingLikes = omit(state.pendingLikes, key);
      }

      return {
        ...state,
        list: {
          ...state.list,
          [key]: {
            ...state.list[key],
            ...action.payload,
            author,
            id: key,
          },
        },
        postsStates: {
          ...state.postsStates,
          [key]: {
            fetching: false,
            loaded: true,
            failed: false,
          },
        },
        pendingLikes,
      };
    }
    case postsActions.GET_CONTENT.ERROR:
      return {
        ...state,
        postsStates: {
          ...state.postsStates,
          [getPostKey(action.meta)]: {
            fetching: false,
            loaded: false,
            failed: true,
          },
        },
      };
    case postsActions.LIKE_POST_START:
      return {
        ...state,
        pendingLikes: { ...state.pendingLikes, [action.meta.postId]: action.meta },
      };
    case postsActions.LIKE_POST_ERROR:
      return {
        ...state,
        pendingLikes: omit(state.pendingLikes, action.meta.postId),
      };
    case commentsActions.SEND_COMMENT_SUCCESS:
      return {
        ...state,
        list: getPostsList(state.list, action),
      };
    case postsActions.FAKE_LIKE_POST_START:
      return {
        ...state,
        pendingLikes: {...state.pendingLikes, [action.meta.postId]: action.meta},
      };
    case postsActions.FAKE_LIKE_POST_SUCCESS: {
      if (action.payload.isFakeLikeOk) {
        const updatedPost = {...state.list[action.meta.postPermlink]};

        updatedPost.active_votes = updatedPost.active_votes.filter(
          vote => vote.voter !== action.meta.voter,
        );
        updatedPost.active_votes.push(action.meta);
        return {
          ...state,
          list: {...state.list, [action.meta.postPermlink]: updatedPost},
          pendingLikes: {},
        };
      }
      return state;
    }
    case postsActions.FAKE_LIKE_POST_ERROR:
      return {
        ...state,
        pendingLikes: omit(state.pendingLikes, action.meta.postId),
      };
    default:
      return state;
  }
};

export default posts;

export const getPosts = state => state.list;
export const getPostContent = (state, author, permlink) =>
  Object.values(state.list).find(post => post.author === author && post.permlink === permlink);
export const getPendingLikes = state => state.pendingLikes;
export const getIsPostFetching = (state, author, permlink) =>
  state.postsStates[`${author}/${permlink}}`] &&
  state.postsStates[`${author}/${permlink}}`].fetching;
export const getIsPostLoaded = (state, author, permlink) =>
  state.postsStates[`${author}/${permlink}}`] && state.postsStates[`${author}/${permlink}}`].loaded;
export const getIsPostFailed = (state, author, permlink) =>
  state.postsStates[`${author}/${permlink}}`] && state.postsStates[`${author}/${permlink}}`].failed;

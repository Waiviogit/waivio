import { each, find, omit, get } from 'lodash';
import * as feedTypes from '../feedStore/feedActions';
import * as postsActions from './postActions';
import * as commentsActions from '../commentsStore/commentsActions';
import { getPostKey } from '../../common/helpers/stateHelpers';

const postItem = (state = {}, action) => {
  switch (action.type) {
    case commentsActions.SEND_COMMENT_SUCCESS:
      return {
        ...state,
        children: action.meta.isEditing
          ? parseInt(state.children, 10)
          : parseInt(state.children, 10) + 1,
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
  lastId: null,
};

const posts = (state = initialState, action) => {
  switch (action.type) {
    case feedTypes.GET_USER_COMMENTS.SUCCESS:
    case feedTypes.GET_MORE_USER_COMMENTS.SUCCESS: {
      const commentsMoreList = {};

      action.payload.forEach(comment => {
        const key = getPostKey(comment);

        commentsMoreList[key] = { ...comment, id: key };
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
      const lastId =
        // eslint-disable-next-line no-underscore-dangle
        action.payload[action.payload.length - 1] && action.payload[action.payload.length - 1]._id;
      const postsStates = {
        ...state.postsStates,
      };

      each(action.payload, post => {
        const key = getPostKey(post);

        list[key] = { ...post, id: key };
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
        lastId,
      };
    }
    case feedTypes.GET_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_OBJECT_POSTS.SUCCESS:
    case feedTypes.GET_THREADS_CONTENT.SUCCESS:
    case feedTypes.GET_MORE_OBJECT_POSTS.SUCCESS:
    case feedTypes.GET_MORE_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_MORE_THREADS_CONTENT.SUCCESS:
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

        list[key] = { ...post, id: key };
        postsStates[key] = {
          fetching: false,
          loaded: true,
          failed: false,
        };
      });
      const lastId =
        // eslint-disable-next-line no-underscore-dangle
        action.payload[action.payload.length - 1] && action.payload[action.payload.length - 1]._id;

      return {
        ...state,
        list,
        postsStates,
        lastId,
      };
    }
    case feedTypes.GET_MORE_FEED_CONTENT_BY_BLOG.SUCCESS: {
      const list = {
        ...state.list,
      };
      const postsStates = {
        ...state.postsStates,
      };

      each(action.payload.posts, post => {
        const key = getPostKey(post);

        list[key] = { ...post, id: key };
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
    case feedTypes.GET_FEED_CONTENT_BY_BLOG.SUCCESS: {
      const list = {
        ...state.list,
      };
      const postsStates = {
        ...state.postsStates,
      };

      each(action.payload.posts, post => {
        const key = getPostKey(post);

        list[key] = { ...post, id: key };
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
      let rebloggedBy = '';

      if (state.list[key] && state.list[key].reblogged_by) {
        rebloggedBy = state.list[key].reblogged_by.length
          ? state.list[key].reblogged_by
          : action.payload.reblogged_by;
      }
      const lastId = get(action.payload, [action.payload.length - 1, '_id']);

      return {
        ...state,
        list: {
          ...state.list,
          [key]: {
            ...state.list[key],
            ...action.payload,
            reblogged_by: rebloggedBy,
            author,
            id: key,
          },
        },
        lastId,
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

    case postsActions.LIKE_POST.SUCCESS: {
      const key = getPostKey(action.payload);
      const author = action.payload.author;
      const pendingLikes = omit(state.pendingLikes, key);
      let reblogged_by = '';

      if (state.list[key].reblogged_by) {
        reblogged_by = state.list[key].reblogged_by.length
          ? state.list[key].reblogged_by
          : action.payload.reblogged_by;
      }
      const lastId = get(action.payload, [action.payload.length - 1, '_id']);

      return {
        ...state,
        list: {
          ...state.list,
          [key]: {
            ...state.list[key],
            ...action.payload,
            reblogged_by,
            author,
            id: key,
          },
        },
        lastId,
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
    case postsActions.LIKE_POST.START:
      return {
        ...state,
        pendingLikes: { ...state.pendingLikes, [action.meta.postId]: action.meta },
      };

    case postsActions.LIKE_POST.ERROR:
      return {
        ...state,
        pendingLikes: omit(state.pendingLikes, action.meta),
      };
    case commentsActions.SEND_COMMENT_SUCCESS:
      return {
        ...state,
        list: getPostsList(state.list, action),
      };

    case postsActions.FAKE_REBLOG_POST: {
      const rebloggedPost = state.list[action.payload.postId];

      return {
        ...state,
        list: {
          ...state.list,
          [action.payload.postId]: {
            ...rebloggedPost,
            reblogged_users: [...rebloggedPost.reblogged_users, action.payload.userName],
          },
        },
      };
    }

    case postsActions.FOLLOWING_POST_AUTHOR.START: {
      const post = state.list[action.payload];

      return {
        ...state,
        list: {
          ...state.list,
          [action.payload]: {
            ...post,
            loading: true,
          },
        },
      };
    }

    case postsActions.FOLLOWING_POST_AUTHOR.SUCCESS: {
      const post = state.list[action.payload];

      return {
        ...state,
        list: {
          ...state.list,
          [action.payload]: {
            ...post,
            youFollows: !post.youFollows,
            loading: false,
          },
        },
      };
    }

    case postsActions.FOLLOWING_POST_AUTHOR.ERROR: {
      const post = state.list[action.payload];

      return {
        ...state,
        list: {
          ...state.list,
          [action.payload]: {
            ...post,
            loading: false,
          },
        },
      };
    }

    case postsActions.GET_SOCIAL_INFO_POST.SUCCESS: {
      return {
        ...state,
        list: {
          ...state.list,
          [getPostKey(action.meta)]: {
            ...state.list[getPostKey(action.meta)],
            tags: action.payload.tags,
            cities: action.payload.cities,
            wobjectsTwitter: action.payload.wobjectsTwitter,
            wobjectsFacebook: action.payload.wobjectsFacebook,
            userFacebook: action.payload.userFacebook,
            userTwitter: action.payload.userTwitter,
          },
        },
      };
    }

    case postsActions.HIDE_POST.START: {
      const key = getPostKey(action.meta.post);

      return {
        ...state,
        list: {
          ...state.list,
          [key]: {
            ...action.meta.post,
            loadingHide: true,
          },
        },
      };
    }

    case postsActions.HIDE_POST.SUCCESS: {
      const key = getPostKey(action.meta.post);

      return {
        ...state,
        list: {
          ...state.list,
          [key]: {
            ...state.list[key],
            isHide: !action.meta.post.isHide,
            loadingHide: false,
          },
        },
      };
    }
    case postsActions.REMOVE_POST: {
      const key = getPostKey(action.meta.post);

      return {
        ...state,
        list: {
          ...state.list,
          [key]: {
            ...state.list[key],
            isRemove: true,
          },
        },
      };
    }

    case postsActions.MUTE_POSTS_AUTHOR.START: {
      const key = getPostKey(action.meta.post);

      return {
        ...state,
        list: {
          ...state.list,
          [key]: {
            ...action.meta.post,
            loadingMute: true,
          },
        },
      };
    }

    case postsActions.MUTE_POSTS_AUTHOR.SUCCESS: {
      const key = getPostKey(action.meta.post);

      return {
        ...state,
        list: {
          ...state.list,
          [key]: {
            ...state.list[key],
            muted: !action.meta.post.muted,
            loadingMute: false,
          },
        },
      };
    }

    default:
      return state;
  }
};

export default posts;

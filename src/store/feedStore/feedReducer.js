import { uniq, get } from 'lodash';
import * as feedTypes from './feedActions';
import { TOGGLE_BOOKMARK } from '../bookmarksStore/bookmarksActions';
import { getPostKey, setFilterTagsForUsersProfile } from '../../client/helpers/stateHelpers';

const initialState = {
  feed: {},
  hot: {},
  cashout: {},
  created: {},
  active: {},
  trending: {},
  comments: {},
  objectPosts: {},
  blog: {},
  bookmarks: {},
  replies: {},
  promoted: {},
};

const feedIdsList = (state = [], action) => {
  const mapPostsKeys = posts => {
    if (posts && Array.isArray(posts)) {
      return posts.map(getPostKey);
    }

    return [];
  };

  switch (action.type) {
    case feedTypes.GET_FEED_CONTENT.START:
    case feedTypes.GET_USER_FEED_CONTENT.START:
    case feedTypes.GET_FEED_CONTENT_BY_BLOG.START:
    case feedTypes.GET_USER_COMMENTS.START:
    case feedTypes.GET_REPLIES.START:
    case feedTypes.GET_BOOKMARKS.START:
    case feedTypes.GET_OBJECT_POSTS.START:
      return [];
    case feedTypes.GET_USER_FEED_CONTENT.SUCCESS:
      if (action && action.payload) {
        return mapPostsKeys(action.payload);
      }

      return [];
    case feedTypes.GET_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_USER_COMMENTS.SUCCESS:
    case feedTypes.GET_REPLIES.SUCCESS:
    case feedTypes.GET_BOOKMARKS.SUCCESS:
    case feedTypes.GET_OBJECT_POSTS.SUCCESS:
      if (action && action.payload) {
        return mapPostsKeys(action.payload);
      }

      return [];
    case feedTypes.GET_FEED_CONTENT_BY_BLOG.SUCCESS:
      if (action && action.payload.posts) {
        return mapPostsKeys(action.payload.posts);
      }

      return [];
    case feedTypes.GET_MORE_USER_FEED_CONTENT.SUCCESS:
      return [...state, ...mapPostsKeys(action.payload)];
    case feedTypes.GET_MORE_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_MORE_USER_COMMENTS.SUCCESS:
    case feedTypes.GET_MORE_REPLIES.SUCCESS:
    case feedTypes.GET_MORE_OBJECT_POSTS.SUCCESS:
      return uniq([...state, ...mapPostsKeys(action.payload)]);
    case feedTypes.GET_MORE_FEED_CONTENT_BY_BLOG.SUCCESS:
      return uniq([...state, ...mapPostsKeys(action.payload.posts)]);
    default:
      return state;
  }
};

const feedCategory = (state = {}, action) => {
  switch (action.type) {
    case feedTypes.GET_FEED_CONTENT.START:
    case feedTypes.GET_USER_FEED_CONTENT.START:
    case feedTypes.GET_MORE_FEED_CONTENT.START:
    case feedTypes.GET_MORE_USER_FEED_CONTENT.START:
    case feedTypes.GET_USER_COMMENTS.START:
    case feedTypes.GET_MORE_USER_COMMENTS.START:
    case feedTypes.GET_MORE_OBJECT_POSTS.START:
    case feedTypes.GET_REPLIES.START:
    case feedTypes.GET_MORE_REPLIES.START:
    case feedTypes.GET_BOOKMARKS.START:
    case feedTypes.GET_OBJECT_POSTS.START:
    case feedTypes.GET_FEED_CONTENT_BY_BLOG.START:
    case feedTypes.GET_MORE_FEED_CONTENT_BY_BLOG.START:
      return {
        ...state,
        isFetching: true,
        isLoaded: false,
        failed: false,
        list: feedIdsList(state.list, action),
      };
    case feedTypes.GET_USER_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_MORE_USER_FEED_CONTENT.SUCCESS:
      return {
        ...state,
        isFetching: false,
        isLoaded: true,
        failed: false,
        hasMore: Boolean(action.payload.length === action.meta.limit),
        list: feedIdsList(state.list, action),
      };
    case feedTypes.GET_FEED_CONTENT_BY_BLOG.SUCCESS:
      return {
        ...state,
        isFetching: false,
        isLoaded: true,
        failed: false,
        hasMore: action.payload.hasMore,
        tags: action.payload.tags,
        list: feedIdsList(state.list, action),
      };
    case feedTypes.GET_MORE_FEED_CONTENT_BY_BLOG.SUCCESS:
      return {
        ...state,
        isFetching: false,
        isLoaded: true,
        failed: false,
        hasMore: action.payload.hasMore,
        tags: setFilterTagsForUsersProfile(get(state, 'tags'), action.payload.tags),
        list: feedIdsList(state.list, action),
      };
    case feedTypes.GET_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_MORE_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_USER_COMMENTS.SUCCESS:
    case feedTypes.GET_MORE_USER_COMMENTS.SUCCESS:
    case feedTypes.GET_MORE_OBJECT_POSTS.SUCCESS:
    case feedTypes.GET_REPLIES.SUCCESS:
    case feedTypes.GET_MORE_REPLIES.SUCCESS:
    case feedTypes.GET_BOOKMARKS.SUCCESS:
    case feedTypes.GET_OBJECT_POSTS.SUCCESS:
      return {
        ...state,
        isFetching: false,
        isLoaded: true,
        failed: false,
        hasMore: Boolean(action.payload.length === action.meta.limit),
        list: feedIdsList(state.list, action),
      };
    case feedTypes.GET_FEED_CONTENT.ERROR:
    case feedTypes.GET_USER_FEED_CONTENT.ERROR:
    case feedTypes.GET_MORE_FEED_CONTENT.ERROR:
    case feedTypes.GET_MORE_USER_FEED_CONTENT.ERROR:
    case feedTypes.GET_USER_COMMENTS.ERROR:
    case feedTypes.GET_MORE_USER_COMMENTS.ERROR:
    case feedTypes.GET_MORE_OBJECT_POSTS.ERROR:
    case feedTypes.GET_REPLIES.ERROR:
    case feedTypes.GET_MORE_REPLIES.ERROR:
    case feedTypes.GET_BOOKMARKS.ERROR:
    case feedTypes.GET_OBJECT_POSTS.ERROR:
    case feedTypes.GET_FEED_CONTENT_BY_BLOG.ERROR:
    case feedTypes.GET_MORE_FEED_CONTENT_BY_BLOG.ERROR:
      return {
        ...state,
        isFetching: false,
        isLoaded: true,
        failed: true,
        hasMore: false,
      };
    default:
      return state;
  }
};

const feedSortBy = (state = {}, action) => {
  switch (action.type) {
    case feedTypes.GET_USER_FEED_CONTENT.START:
    case feedTypes.GET_USER_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_USER_FEED_CONTENT.ERROR:
    case feedTypes.GET_FEED_CONTENT_BY_BLOG.START:
    case feedTypes.GET_FEED_CONTENT_BY_BLOG.SUCCESS:
    case feedTypes.GET_FEED_CONTENT_BY_BLOG.ERROR:
    case feedTypes.GET_MORE_FEED_CONTENT_BY_BLOG.START:
    case feedTypes.GET_MORE_FEED_CONTENT_BY_BLOG.SUCCESS:
    case feedTypes.GET_MORE_FEED_CONTENT_BY_BLOG.ERROR:
    case feedTypes.GET_MORE_USER_FEED_CONTENT.START:
    case feedTypes.GET_MORE_USER_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_MORE_USER_FEED_CONTENT.ERROR:
    case feedTypes.GET_FEED_CONTENT.START:
    case feedTypes.GET_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_FEED_CONTENT.ERROR:
    case feedTypes.GET_MORE_FEED_CONTENT.START:
    case feedTypes.GET_MORE_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_MORE_FEED_CONTENT.ERROR:
    case feedTypes.GET_USER_COMMENTS.START:
    case feedTypes.GET_USER_COMMENTS.SUCCESS:
    case feedTypes.GET_USER_COMMENTS.ERROR:
    case feedTypes.GET_MORE_USER_COMMENTS.START:
    case feedTypes.GET_MORE_USER_COMMENTS.SUCCESS:
    case feedTypes.GET_MORE_USER_COMMENTS.ERROR:
    case feedTypes.GET_MORE_OBJECT_POSTS.START:
    case feedTypes.GET_MORE_OBJECT_POSTS.SUCCESS:
    case feedTypes.GET_MORE_OBJECT_POSTS.ERROR:
    case feedTypes.GET_REPLIES.START:
    case feedTypes.GET_REPLIES.SUCCESS:
    case feedTypes.GET_REPLIES.ERROR:
    case feedTypes.GET_MORE_REPLIES.START:
    case feedTypes.GET_MORE_REPLIES.SUCCESS:
    case feedTypes.GET_MORE_REPLIES.ERROR:
    case feedTypes.GET_BOOKMARKS.START:
    case feedTypes.GET_BOOKMARKS.SUCCESS:
    case feedTypes.GET_BOOKMARKS.ERROR:
    case feedTypes.GET_OBJECT_POSTS.START:
    case feedTypes.GET_OBJECT_POSTS.SUCCESS:
    case feedTypes.GET_OBJECT_POSTS.ERROR: {
      return {
        ...state,
        [action.meta.category]: feedCategory(state[action.meta.category], action),
      };
    }
    default:
      return state;
  }
};

const feed = (state = initialState, action) => {
  switch (action.type) {
    case feedTypes.GET_USER_FEED_CONTENT.START:
    case feedTypes.GET_USER_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_USER_FEED_CONTENT.ERROR:
    case feedTypes.GET_MORE_USER_FEED_CONTENT.START:
    case feedTypes.GET_MORE_USER_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_MORE_USER_FEED_CONTENT.ERROR:
      return {
        ...state,
        [action.meta.sortBy]: feedSortBy(state[action.meta.sortBy], action),
      };
    case feedTypes.GET_FEED_CONTENT.START:
    case feedTypes.GET_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_FEED_CONTENT.ERROR:
    case feedTypes.GET_FEED_CONTENT_BY_BLOG.START:
    case feedTypes.GET_FEED_CONTENT_BY_BLOG.SUCCESS:
    case feedTypes.GET_FEED_CONTENT_BY_BLOG.ERROR:
    case feedTypes.GET_MORE_FEED_CONTENT.START:
    case feedTypes.GET_MORE_FEED_CONTENT.SUCCESS:
    case feedTypes.GET_MORE_FEED_CONTENT.ERROR:
    case feedTypes.GET_MORE_FEED_CONTENT_BY_BLOG.START:
    case feedTypes.GET_MORE_FEED_CONTENT_BY_BLOG.SUCCESS:
    case feedTypes.GET_MORE_FEED_CONTENT_BY_BLOG.ERROR:
    case feedTypes.GET_USER_COMMENTS.START:
    case feedTypes.GET_USER_COMMENTS.SUCCESS:
    case feedTypes.GET_USER_COMMENTS.ERROR:
    case feedTypes.GET_MORE_USER_COMMENTS.START:
    case feedTypes.GET_MORE_USER_COMMENTS.SUCCESS:
    case feedTypes.GET_MORE_USER_COMMENTS.ERROR:
    case feedTypes.GET_MORE_OBJECT_POSTS.START:
    case feedTypes.GET_MORE_OBJECT_POSTS.SUCCESS:
    case feedTypes.GET_MORE_OBJECT_POSTS.ERROR:
    case feedTypes.GET_REPLIES.START:
    case feedTypes.GET_REPLIES.SUCCESS:
    case feedTypes.GET_REPLIES.ERROR:
    case feedTypes.GET_MORE_REPLIES.START:
    case feedTypes.GET_MORE_REPLIES.SUCCESS:
    case feedTypes.GET_MORE_REPLIES.ERROR:
    case feedTypes.GET_BOOKMARKS.START:
    case feedTypes.GET_BOOKMARKS.SUCCESS:
    case feedTypes.GET_BOOKMARKS.ERROR:
    case feedTypes.GET_OBJECT_POSTS.START:
    case feedTypes.GET_OBJECT_POSTS.SUCCESS:
    case feedTypes.GET_OBJECT_POSTS.ERROR:
      return {
        ...state,
        [action.meta.sortBy]: feedSortBy(state[action.meta.sortBy], action),
      };
    case TOGGLE_BOOKMARK:
      return {
        ...state,
        bookmarks: {
          ...state.bookmarks,
          all: {
            ...state.bookmarks.all,
            list: state.bookmarks.all.list.filter(item => item !== action.meta.id),
          },
        },
      };
    case feedTypes.SET_PROFILE_FILTERS: {
      const tagConditions = get(state, 'blog.tagConditions', []);
      const isHas = tagConditions.includes(action.payload);

      return {
        ...state,
        blog: {
          ...state.blog,
          tagConditions: isHas
            ? tagConditions.filter(tag => tag !== action.payload)
            : [...tagConditions, action.payload],
        },
      };
    }
    case feedTypes.RESET_PROFILE_FILTERS:
      return {
        ...state,
        blog: {
          ...state.blog,
          tagConditions: [],
        },
      };
    default:
      return state;
  }
};

export default feed;

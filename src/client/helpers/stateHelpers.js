import { hasActionType, hasField } from '../object/wObjectHelper';

export const getFeedFromState = (sortBy, category = 'all', state) => {
  switch (sortBy) {
    case 'feed':
    case 'hot':
    case 'created':
    case 'trending':
    case 'comments':
    case 'blog':
    case 'bookmarks':
    case 'replies':
    case 'promoted':
    case 'objectPosts':
      return state[sortBy][category] ? state[sortBy][category].list : [];
    default:
      return [];
  }
};

export const getFeedLoadingFromState = (sortBy, category = 'all', feedState) => {
  switch (sortBy) {
    case 'feed':
    case 'hot':
    case 'created':
    case 'trending':
    case 'comments':
    case 'blog':
    case 'bookmarks':
    case 'replies':
    case 'promoted':
    case 'objectPosts':
      return (feedState[sortBy][category] && feedState[sortBy][category].isFetching) || false;
    default:
      return false;
  }
};

export const getFeedFetchedFromState = (sortBy, category = 'all', feedState) => {
  switch (sortBy) {
    case 'feed':
    case 'hot':
    case 'created':
    case 'trending':
    case 'comments':
    case 'blog':
    case 'bookmarks':
    case 'replies':
    case 'promoted':
    case 'objectPosts':
      return (feedState[sortBy][category] && feedState[sortBy][category].isLoaded) || false;
    default:
      return false;
  }
};

export const getFeedHasMoreFromState = (sortBy, listName = 'all', feedState) => {
  switch (sortBy) {
    case 'feed':
    case 'hot':
    case 'cashout':
    case 'created':
    case 'trending':
    case 'comments':
    case 'blog':
    case 'bookmarks':
    case 'replies':
    case 'promoted':
    case 'objectPosts':
      return (feedState[sortBy][listName] && feedState[sortBy][listName].hasMore) || false;
    default:
      return false;
  }
};

export const getFeedFailedFromState = (sortBy, listName = 'all', feedState) => {
  switch (sortBy) {
    case 'feed':
    case 'hot':
    case 'cashout':
    case 'created':
    case 'trending':
    case 'comments':
    case 'blog':
    case 'bookmarks':
    case 'replies':
    case 'promoted':
    case 'objectPosts':
      return (feedState[sortBy][listName] && feedState[sortBy][listName].failed) || false;
    default:
      return false;
  }
};

export const getFilteredContent = (
  content,
  actionTypes = ['createObject', 'appendObject'],
  fieldName = null,
  locale = null,
  sortBy = 'recency',
) => {
  let comparator;
  let filteredContent = content.filter(post => hasActionType(post, actionTypes));
  if (fieldName || locale) {
    filteredContent = filteredContent.filter(post => hasField(post, fieldName, locale));
  }
  switch (sortBy) {
    case 'rank':
      comparator = (a, b) => {
        const diff = b.append_field_weight - a.append_field_weight;
        return diff === 0 ? new Date(b.created) - new Date(a.created) : diff;
      };
      break;
    case 'recency':
    default:
      comparator = (a, b) => new Date(b.created) - new Date(a.created);
      break;
  }
  return filteredContent.sort(comparator).map(item => item.id);
};

// returning the same function but different naming helps to understand the code's flow better
// and defines a pattern to scale this feature with reselect
export const getUserFeedFromState = (username, feed) => getFeedFromState('feed', username, feed);

export const getUserFeedLoadingFromState = (username, feedState) =>
  getFeedLoadingFromState('feed', username, feedState);

export const getUserFeedFetchedFromState = (username, feedState) =>
  getFeedLoadingFromState('feed', username, feedState);

export const getUserFeedFailedFromState = (username, feedState) =>
  getFeedFailedFromState('feed', username, feedState);

/**
 * Sort comments based on payout
 * @param {Array} list - list of IDs of comments
 * @param {Object} commentsState - state.comments in busy redux setup
 * @param {String} sortBy - how comments should be sorted
 * @returns {Array} - list of sorted IDs
 */
export const sortCommentsFromSteem = (list, commentsState, sortBy = 'trending') => {
  let compareFunc;
  const newList = [...list];

  if (sortBy === 'trending') {
    compareFunc = (itemA, itemB) => {
      let compareRes = parseFloat(itemA.total_payout_value) - parseFloat(itemB.total_payout_value);
      if (compareRes === 0) {
        compareRes = itemA.net_votes - itemB.net_votes;
      }
      return compareRes;
    };
  } else if (sortBy === 'votes') {
    compareFunc = (itemA, itemB) => itemA.net_votes - itemB.net_votes;
  } else if (sortBy === 'new') {
    compareFunc = (itemA, itemB) => Date.parse(itemA.created) - Date.parse(itemB.created);
  }

  return newList
    .sort((item1, item2) =>
      compareFunc(commentsState.comments[item1], commentsState.comments[item2]),
    )
    .reverse();
};

export const createAsyncActionType = type => ({
  ACTION: type,
  START: `${type}_START`,
  SUCCESS: `${type}_SUCCESS`,
  ERROR: `${type}_ERROR`,
});

export const getUserDetailsKey = username => `user-${username}`;

export const getPostKey = post => {
  if (post.authorGuest) {
    return `${post.authorGuest}/${post.permlink}`;
  }
  if (post.guestInfo) {
    return `${post.guestInfo.userId}/${post.permlink}`;
  }
  return `${post.author}/${post.permlink}`;
};

export const getParentKey = post => `${post.parent_author}/${post.parent_permlink}`;

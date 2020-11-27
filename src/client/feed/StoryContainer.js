import { find, get } from 'lodash';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import Story from '../components/Story/Story';
import {
  getAuthenticatedUser,
  getPosts,
  getBookmarks,
  getPendingBookmarks,
  getPendingLikes,
  getRebloggedList,
  getPendingReblogs,
  getIsEditorSaving,
  getVotingPower,
  getRewardFund,
  getVotePercent,
  getShowNSFWPosts,
} from '../reducers';
import {
  errorFollowingPostAuthor,
  followingPostAuthor,
  pendingFollowingPostAuthor,
  votePost,
} from '../post/postActions';
import { toggleBookmark } from '../bookmarks/bookmarksActions';
import { editPost } from '../post/Write/editorActions';
import { reblog } from '../app/Reblog/reblogActions';
import { unfollowUser, followUser } from '../user/usersActions';

const mapStateToProps = (state, { id }) => {
  const user = getAuthenticatedUser(state);
  const post = getPosts(state)[id];

  const userVote = find(post.active_votes, { voter: user.name }) || {};
  const bookmarks = getBookmarks(state);
  const postState = {
    isReblogged: getRebloggedList(state).includes(post.id),
    isReblogging: getPendingReblogs(state).includes(post.id),
    isSaved: post.guestInfo
      ? bookmarks.includes(`${post.guestInfo.userId}/${post.root_permlink}`)
      : bookmarks.includes(post.id),
    isLiked: userVote.percent > 0 && get(userVote, '_id', false),
    isReported: userVote.percent < 0,
  };

  const pendingVote = getPendingLikes(state)[post.id];

  const pendingLike =
    pendingVote && (pendingVote.weight > 0 || (pendingVote.weight === 0 && postState.isLiked));
  const pendingFlag =
    pendingVote && (pendingVote.weight < 0 || (pendingVote.weight === 0 && postState.isReported));

  return {
    user,
    post,
    postState,
    pendingLike,
    pendingFlag,
    pendingBookmark: getPendingBookmarks(state).includes(post.id),
    saving: getIsEditorSaving(state),
    ownPost: post.guestInfo ? post.guestInfo.userId === user.name : user.name === post.author,
    sliderMode: getVotingPower(state),
    rewardFund: getRewardFund(state),
    defaultVotePercent: getVotePercent(state),
    showNSFWPosts: getShowNSFWPosts(state),
  };
};

export default connect(mapStateToProps, {
  votePost,
  toggleBookmark,
  editPost,
  reblog,
  followUser,
  unfollowUser,
  push,
  followingPostAuthor,
  pendingFollowingPostAuthor,
  errorFollowingPostAuthor,
})(Story);

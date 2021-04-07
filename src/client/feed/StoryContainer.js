import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import Story from '../components/Story/Story';
import {
  getRebloggedList,
  getPendingReblogs,
  getVotingPower,
  getVotePercent,
  getShowNSFWPosts,
} from '../store/reducers';
import {
  errorFollowingPostAuthor,
  followingPostAuthor,
  pendingFollowingPostAuthor,
  votePost,
} from '../store/postsStore/postActions';
import { toggleBookmark } from '../store/bookmarksStore/bookmarksActions';
import { editPost } from '../store/editorStore/editorActions';
import { reblog } from '../app/Reblog/reblogActions';
import { unfollowUser, followUser } from '../store/usersStore/usersActions';
import { getDownvotes, getUpvotes } from '../helpers/voteHelpers';
import { getRewardFund } from '../store/appStore/appSelectors';
import { getAuthenticatedUser } from '../store/authStore/authSelectors';
import { getIsEditorSaving } from '../store/editorStore/editorSelectors';
import { getPendingLikes, getPosts } from '../store/postsStore/postsSelectors';
import { getBookmarks, getPendingBookmarks } from '../store/bookmarksStore/bookmarksSelectors';

const mapStateToProps = (state, { id }) => {
  const user = getAuthenticatedUser(state);
  const post = getPosts(state)[id];
  const isLiked = getUpvotes(post.active_votes).some(vote => vote.voter === user.name);
  const isReported = getDownvotes(post.active_votes).some(vote => vote.voter === user.name);

  const bookmarks = getBookmarks(state);
  const postState = {
    isReblogged: getRebloggedList(state).includes(post.id),
    isReblogging: getPendingReblogs(state).includes(post.id),
    isSaved: post.guestInfo
      ? bookmarks.includes(`${post.guestInfo.userId}/${post.root_permlink}`)
      : bookmarks.includes(post.id),
    isLiked,
    isReported,
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

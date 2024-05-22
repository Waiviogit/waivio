import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import Story from '../components/Story/Story';
import {
  errorFollowingPostAuthor,
  followingPostAuthor,
  handlePinPost,
  pendingFollowingPostAuthor,
  votePost,
} from '../../store/postsStore/postActions';
import { toggleBookmark } from '../../store/bookmarksStore/bookmarksActions';
import { editPost } from '../../store/editorStore/editorActions';
import { reblog } from '../../store/reblogStore/reblogActions';
import { unfollowUser, followUser } from '../../store/usersStore/usersActions';
import { getDownvotes, getUpvotes } from '../../common/helpers/voteHelpers';
import { getRewardFund } from '../../store/appStore/appSelectors';
import { getAuthenticatedUser, getIsAuthenticated } from '../../store/authStore/authSelectors';
import { getIsEditorSaving } from '../../store/editorStore/editorSelectors';
import { getPendingLikes, getPosts } from '../../store/postsStore/postsSelectors';
import { getBookmarks, getPendingBookmarks } from '../../store/bookmarksStore/bookmarksSelectors';
import { getPendingReblogs, getRebloggedList } from '../../store/reblogStore/reblogSelectors';
import {
  getLocale,
  getShowNSFWPosts,
  getVotePercent,
  getVotingPower,
} from '../../store/settingsStore/settingsSelectors';
import { addPayoutForActiveVotes } from '../../common/helpers';
import { getTokenRatesInUSD } from '../../store/walletStore/walletSelectors';
import { getPinnedPostsUrls } from '../../store/feedStore/feedSelectors';
import { getObject } from '../../store/wObjectStore/wObjectSelectors';
import { editThread } from '../../store/commentsStore/commentsActions';
import { buildPost } from '../../store/slateEditorStore/editorActions';

const mapStateToProps = (state, { id, isThread }) => {
  const user = getAuthenticatedUser(state);
  const currPost = getPosts(state)[id];
  const waivRates = getTokenRatesInUSD(state, 'WAIV');
  const post =
    isThread && currPost.deleted
      ? {}
      : {
          ...currPost,
          active_votes: addPayoutForActiveVotes(currPost, waivRates),
        };
  const isLiked = getUpvotes(post.active_votes).some(
    vote => vote.voter === user.name && !vote.fake,
  );
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
    userVotingPower: getVotePercent(state),
    showNSFWPosts: getShowNSFWPosts(state),
    wobject: getObject(state),
    pinnedPostsUrls: getPinnedPostsUrls(state),
    locale: getLocale(state),
    isAuthUser: getIsAuthenticated(state),
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
  handlePinPost,
  editThread,
  buildPost,
})(Story);

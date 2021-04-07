import _ from 'lodash';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import { getVotingPower, getVotePercent } from '../../store/reducers';
import { likeComment } from '../../store/commentsStore/commentsActions';
import { followUser, unfollowUser } from '../../store/userStore/userActions';
import { followObject, unfollowObject } from '../../store/wObjectStore/wobjActions';
import CampaignFooter from './CampaignFooter';
import { getRewardFund } from '../../store/appStore/appSelectors';
import { getAuthenticatedUser } from '../../store/authStore/authSelectors';
import { getCommentsPendingVotes } from '../../store/commentsStore/commentsSelectors';
import { getPendingFollowingObjects, getPendingFollows } from '../../store/userStore/userSelectors';

const mapStateToProps = (
  state,
  { post, requiredObjectPermlink, proposition, userFollowing, objectFollowing },
) => {
  const user = getAuthenticatedUser(state);
  const userVote = _.find(post.active_votes, { voter: user.name }) || {};
  const postState = {
    isLiked: userVote.percent > 0,
    userFollowed: userFollowing,
    objectFollowed: objectFollowing,
  };
  const pendingVote = getCommentsPendingVotes(state).find(comment => comment.id === post.id);
  const pendingLike =
    pendingVote && (pendingVote.percent > 0 || (pendingVote.percent === 0 && postState.isLiked));
  const pendingFlag =
    pendingVote && (pendingVote.percent < 0 || (pendingVote.percent === 0 && postState.isReported));

  return {
    user,
    post,
    postState,
    pendingLike,
    pendingFlag,
    pendingFollow: getPendingFollows(state).includes(proposition.guideName),
    pendingFollowObject: getPendingFollowingObjects(state).includes(requiredObjectPermlink),
    ownPost: user.name === proposition.guideName,
    sliderMode: getVotingPower(state),
    rewardFund: getRewardFund(state),
    defaultVotePercent: getVotePercent(state),
  };
};

export default connect(mapStateToProps, dispatch =>
  bindActionCreators(
    {
      likeComment,
      followUser,
      unfollowUser,
      followObject,
      unfollowObject,
      push,
    },
    dispatch,
  ),
)(CampaignFooter);

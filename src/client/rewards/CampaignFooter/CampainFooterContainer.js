import _ from 'lodash';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import {
  getAuthenticatedUser,
  getCommentsPendingVotes,
  getFollowingList,
  getPendingFollows,
  getVotingPower,
  getRewardFund,
  getVotePercent,
  getFollowingObjectsList,
  getPendingFollowingObjects,
} from '../../reducers';
import { likeComment } from '../../comments/commentsActions';
import { followUser, unfollowUser } from '../../user/userActions';
import { followObject, unfollowObject } from '../../object/wobjActions';
import CampaignFooter from './CampaignFooter';

const mapStateToProps = (state, { post, requiredObjectPermlink }) => {
  const user = getAuthenticatedUser(state);

  const userVote = _.find(post.active_votes, { voter: user.name }) || {};
  const postState = {
    isLiked: userVote.percent > 0,
    userFollowed: getFollowingList(state).includes(post.author),
    objectFollowed: getFollowingObjectsList(state).includes(requiredObjectPermlink),
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
    pendingFollow: getPendingFollows(state).includes(post.author),
    pendingFollowObject: getPendingFollowingObjects(state).includes(requiredObjectPermlink),
    ownPost: user.name === post.author,
    sliderMode: getVotingPower(state),
    rewardFund: getRewardFund(state),
    defaultVotePercent: getVotePercent(state),
  };
};

export default connect(
  mapStateToProps,
  dispatch =>
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

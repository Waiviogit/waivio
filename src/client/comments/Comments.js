import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { find, size, isEmpty } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import CommentsList from '../components/Comments/Comments';
import * as commentsActions from '../../store/commentsStore/commentsActions';
import { notify } from '../app/Notification/notificationActions';
import { getDownvotes } from '../../common/helpers/voteHelpers';
import { getRewardFund } from '../../store/appStore/appSelectors';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getIsAuthenticated,
  isGuestUser,
} from '../../store/authStore/authSelectors';
import {
  getComments,
  getCommentsList,
  getCommentsPendingVotes,
} from '../../store/commentsStore/commentsSelectors';
import { getVotePercent, getVotingPower } from '../../store/settingsStore/settingsSelectors';
import { getUser } from '../../store/usersStore/usersSelectors';
import { setGuestMana } from '../../store/usersStore/usersActions';

const Comments = props => {
  useEffect(() => {
    if (props.show && props.post.children !== 0) {
      const postId = props.post.id || props.post.permlink;

      props.getComments(postId);
    }
  }, [props.show, props.post.permlink, props.post.id]);

  const getNestedComments = (commentsObj, commentsIdArray, nestedComments) => {
    const newNestedComments = nestedComments;

    commentsIdArray.forEach(commentId => {
      const nestedCommentArray = commentsObj.childrenById[commentId];

      if (size(nestedCommentArray)) {
        newNestedComments[commentId] = nestedCommentArray.map(id => commentsObj.comments[id]);
        getNestedComments(commentsObj, nestedCommentArray, newNestedComments);
      }
    });

    return newNestedComments;
  };

  const handleLikeClick = (id, weight) => {
    const { commentsList, user, defaultVotePercent } = props;
    const userVote = find(commentsList[id].active_votes, { voter: user.name }) || {};

    if (
      (userVote.percent && !Number(userVote.percent)) ||
      isEmpty(userVote) ||
      userVote.rshares <= 0
    ) {
      const likeWeight = weight > 0 ? weight : defaultVotePercent;

      props.voteComment(id, likeWeight, 'like');
    } else {
      props.voteComment(id, 0, 'like');
    }
  };

  const handleDislikeClick = (id, weight = 10000) => {
    const { commentsList, pendingVotes, user, sliderMode, defaultVotePercent } = props;

    if (pendingVotes[id]) return;
    const isFlagged = getDownvotes(commentsList[id].active_votes).some(
      ({ voter }) => voter === user.name,
    );

    if (sliderMode && !isFlagged) {
      props.voteComment(id, -weight, 'dislike');
    } else if (isFlagged) {
      props.voteComment(id, 0, 'dislike');
    } else {
      props.voteComment(id, -defaultVotePercent, 'dislike');
    }
  };

  const {
    user,
    post,
    comments,
    pendingVotes,
    show,
    isQuickComments,
    sliderMode,
    rewardFund,
    defaultVotePercent,
    isUpdating,
    isRecipe,
  } = props;
  const postId = isUpdating || !post.id ? `${post.author}/${post.permlink}` : post.id;
  let rootLevelComments = [];
  const parentNode = comments.childrenById[postId];

  if (parentNode instanceof Array) {
    rootLevelComments = parentNode.map(id => comments.comments[id]);
  }

  let commentsChildren = {};

  if (rootLevelComments && rootLevelComments.length) {
    commentsChildren = getNestedComments(comments, comments.childrenById[postId], {});
  }

  return (
    rootLevelComments && (
      <CommentsList
        isRecipe={isRecipe}
        user={user}
        isGuest={props.isGuest}
        setGuestMana={props.setGuestMana}
        parentPost={post}
        comments={comments.comments}
        rootLevelComments={rootLevelComments}
        commentsChildren={commentsChildren}
        authenticated={props.authenticated}
        username={props.username}
        pendingVotes={pendingVotes}
        loadingPostId={comments.fetchingPostId}
        loading={comments.isFetching}
        loaded={comments.isLoaded}
        show={show}
        isQuickComments={isQuickComments}
        notify={props.notify}
        rewardFund={rewardFund}
        sliderMode={sliderMode}
        defaultVotePercent={defaultVotePercent}
        onLikeClick={handleLikeClick}
        onDislikeClick={handleDislikeClick}
        onSendComment={props.sendComment}
        handleHideComment={props.handleHideComment}
      />
    )
  );
};

Comments.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  user: PropTypes.shape().isRequired,
  rewardFund: PropTypes.shape().isRequired,
  defaultVotePercent: PropTypes.number,
  sliderMode: PropTypes.bool,
  isRecipe: PropTypes.bool,
  username: PropTypes.string,
  post: PropTypes.shape(),
  comments: PropTypes.shape(),
  commentsList: PropTypes.shape(),
  pendingVotes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      percent: PropTypes.number,
    }),
  ),
  show: PropTypes.bool,
  isQuickComments: PropTypes.bool,
  notify: PropTypes.func,
  getComments: PropTypes.func,
  voteComment: PropTypes.func,
  sendComment: PropTypes.func,
  handleHideComment: PropTypes.func,
  isUpdating: PropTypes.bool,
  isGuest: PropTypes.bool,
  setGuestMana: PropTypes.func,
};

Comments.defaultProps = {
  username: undefined,
  sliderMode: false,
  isRecipe: false,
  post: {},
  comments: {},
  commentsList: {},
  pendingVotes: [],
  show: false,
  isQuickComments: false,
  notify: () => {},
  getComments: () => {},
  voteComment: () => {},
  sendComment: () => {},
  handleHideComment: () => {},
  isUpdating: false,
  defaultVotePercent: 100,
};

export default connect(
  state => {
    const username = getAuthenticatedUserName(state);

    return {
      user: getAuthenticatedUser(state),
      comments: getComments(state),
      commentsList: getCommentsList(state),
      pendingVotes: getCommentsPendingVotes(state),
      authenticated: getIsAuthenticated(state),
      username,
      sliderMode: getVotingPower(state),
      rewardFund: getRewardFund(state),
      defaultVotePercent: getVotePercent(state),
      isGuest: isGuestUser(state),
      userInfo: getUser(state, username),
    };
  },
  dispatch =>
    bindActionCreators(
      {
        getComments: commentsActions.getComments,
        voteComment: (id, percent, vote) => commentsActions.likeComment(id, percent, vote),
        sendComment: (parentPost, body, isUpdating, originalPost) =>
          commentsActions.sendComment(parentPost, body, isUpdating, originalPost),
        notify,
        handleHideComment: commentsActions.handleHideComment,
        setGuestMana: user => setGuestMana(user),
      },
      dispatch,
    ),
)(Comments);

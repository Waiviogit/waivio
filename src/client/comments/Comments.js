import React from 'react';
import PropTypes from 'prop-types';
import { find, size } from 'lodash';
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
} from '../../store/authStore/authSelectors';
import {
  getComments,
  getCommentsList,
  getCommentsPendingVotes,
} from '../../store/commentsStore/commentsSelectors';
import { getVotePercent, getVotingPower } from '../../store/settingsStore/settingsSelectors';

@connect(
  state => ({
    user: getAuthenticatedUser(state),
    comments: getComments(state),
    commentsList: getCommentsList(state),
    pendingVotes: getCommentsPendingVotes(state),
    authenticated: getIsAuthenticated(state),
    username: getAuthenticatedUserName(state),
    sliderMode: getVotingPower(state),
    rewardFund: getRewardFund(state),
    defaultVotePercent: getVotePercent(state),
  }),
  dispatch =>
    bindActionCreators(
      {
        getComments: commentsActions.getComments,
        voteComment: (id, percent, vote) => commentsActions.likeComment(id, percent, vote),
        sendComment: (parentPost, body, isUpdating, originalPost) =>
          commentsActions.sendComment(parentPost, body, isUpdating, originalPost),
        notify,
        handleHideComment: commentsActions.handleHideComment,
      },
      dispatch,
    ),
)
export default class Comments extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    user: PropTypes.shape().isRequired,
    rewardFund: PropTypes.shape().isRequired,
    defaultVotePercent: PropTypes.number,
    sliderMode: PropTypes.bool,
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
  };

  static defaultProps = {
    username: undefined,
    sliderMode: false,
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

  state = {
    sortOrder: 'trending',
  };

  componentDidMount() {
    if (this.props.show && this.props.post.children !== 0) {
      const postId = this.props.post.id || this.props.post.permlink;

      this.props.getComments(postId);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { post, show } = this.props;
    const postId = nextProps.post.id || nextProps.post.permlink;

    if (nextProps.show && (nextProps.post.id !== post.id || !show) && post.children !== 0) {
      this.props.getComments(postId);
    }
  }

  getNestedComments = (commentsObj, commentsIdArray, nestedComments) => {
    const newNestedComments = nestedComments;

    commentsIdArray.forEach(commentId => {
      const nestedCommentArray = commentsObj.childrenById[commentId];

      if (size(nestedCommentArray)) {
        newNestedComments[commentId] = nestedCommentArray.map(id => commentsObj.comments[id]);
        this.getNestedComments(commentsObj, nestedCommentArray, newNestedComments);
      }
    });

    return newNestedComments;
  };

  handleLikeClick = (id, weight) => {
    const { commentsList, user, defaultVotePercent } = this.props;
    const userVote = find(commentsList[id].active_votes, { voter: user.name }) || {};

    if (!Number(userVote.percent)) {
      const likeWeight = weight > 0 ? weight : defaultVotePercent;

      this.props.voteComment(id, likeWeight, 'like');
    } else {
      this.props.voteComment(id, 0, 'like');
    }
  };

  handleDislikeClick = (id, weight = 10000) => {
    const { commentsList, pendingVotes, user, sliderMode, defaultVotePercent } = this.props;

    if (pendingVotes[id]) return;
    const isFlagged = getDownvotes(commentsList[id].active_votes).some(
      ({ voter }) => voter === user.name,
    );

    if (sliderMode && !isFlagged) {
      this.props.voteComment(id, -weight, 'dislike');
    } else if (isFlagged) {
      this.props.voteComment(id, 0, 'dislike');
    } else {
      this.props.voteComment(id, -defaultVotePercent, 'dislike');
    }
  };

  render() {
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
    } = this.props;
    const postId = isUpdating ? `${post.author}/${post.permlink}` : post.id;
    let rootLevelComments = [];
    const parentNode = comments.childrenById[postId];

    if (parentNode instanceof Array) {
      rootLevelComments = parentNode.map(id => comments.comments[id]);
    }

    let commentsChildren = {};

    if (rootLevelComments && rootLevelComments.length) {
      commentsChildren = this.getNestedComments(comments, comments.childrenById[postId], {});
    }

    return (
      rootLevelComments && (
        <CommentsList
          user={user}
          parentPost={post}
          comments={comments.comments}
          rootLevelComments={rootLevelComments}
          commentsChildren={commentsChildren}
          authenticated={this.props.authenticated}
          username={this.props.username}
          pendingVotes={pendingVotes}
          loadingPostId={comments.fetchingPostId}
          loading={comments.isFetching}
          loaded={comments.isLoaded}
          show={show}
          isQuickComments={isQuickComments}
          notify={this.props.notify}
          rewardFund={rewardFund}
          sliderMode={sliderMode}
          defaultVotePercent={defaultVotePercent}
          onLikeClick={this.handleLikeClick}
          onDislikeClick={this.handleDislikeClick}
          onSendComment={this.props.sendComment}
          handleHideComment={this.props.handleHideComment}
        />
      )
    );
  }
}

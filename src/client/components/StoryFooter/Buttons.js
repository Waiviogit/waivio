import React from 'react';
import PropTypes from 'prop-types';
import { take, get, isEmpty } from 'lodash';
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Icon, Modal } from 'antd';
import classNames from 'classnames';
import withAuthActions from '../../auth/withAuthActions';
import { sortVotes } from '../../helpers/sortHelpers';
import { getDownvotes, getUpvotes } from '../../helpers/voteHelpers';
import BTooltip from '../BTooltip';
import ReactionsModal from '../Reactions/ReactionsModal';
import USDDisplay from '../Utils/USDDisplay';
import UserRebloggedModal from '../../user/UserReblogModal';
import PostPopoverMenu from '../PostPopoverMenu/PostPopoverMenu';

import './Buttons.less';

@injectIntl
@withAuthActions
export default class Buttons extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    post: PropTypes.shape().isRequired,
    postState: PropTypes.shape().isRequired,
    defaultVotePercent: PropTypes.number.isRequired,
    onActionInitiated: PropTypes.func.isRequired,
    ownPost: PropTypes.bool,
    pendingLike: PropTypes.bool,
    pendingFlag: PropTypes.bool,
    pendingFollow: PropTypes.bool,
    pendingBookmark: PropTypes.bool,
    saving: PropTypes.bool,
    onLikeClick: PropTypes.func,
    onShareClick: PropTypes.func,
    onCommentClick: PropTypes.func,
    handlePostPopoverMenuClick: PropTypes.func,
    username: PropTypes.string,
    userComments: PropTypes.bool,
  };

  static defaultProps = {
    ownPost: false,
    pendingLike: false,
    pendingFlag: false,
    pendingFollow: false,
    pendingBookmark: false,
    saving: false,
    onLikeClick: () => {},
    onShareClick: () => {},
    onCommentClick: () => {},
    handlePostPopoverMenuClick: () => {},
    username: '',
    userComments: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      shareModalVisible: false,
      shareModalLoading: false,
      sliderVisible: false,
      reactionsModalVisible: false,
      loadingEdit: false,
      upVotes: getUpvotes(this.props.post.active_votes),
      downVotes: getDownvotes(this.props.post.active_votes),
      isUsersReblogModal: false,
    };

    this.handleLikeClick = this.handleLikeClick.bind(this);
    this.shareClick = this.shareClick.bind(this);
    this.handleShareClick = this.handleShareClick.bind(this);
    this.handleShareOk = this.handleShareOk.bind(this);
    this.handleShareCancel = this.handleShareCancel.bind(this);
    this.handleShowReactions = this.handleShowReactions.bind(this);
    this.handleCloseReactions = this.handleCloseReactions.bind(this);
    this.handleCommentsClick = this.handleCommentsClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.postState.isReblogging !== this.props.postState.isReblogging) {
      this.setState({
        shareModalLoading: nextProps.postState.isReblogging,
        shareModalVisible:
          !(!nextProps.postState.isReblogging && this.props.postState.isReblogging) &&
          this.state.shareModalVisible,
      });
    }
    this.setState({
      upVotes: getUpvotes(nextProps.post.active_votes),
      downVotes: getDownvotes(nextProps.post.active_votes),
    });
  }

  handleReject = () =>
    this.props.onActionInitiated(() => this.props.handlePostPopoverMenuClick('report'));

  handleLikeClick() {
    this.props.onActionInitiated(() => this.props.onLikeClick());
  }

  handleCommentsClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onCommentClick();
  }

  shareClick() {
    if (
      this.props.post.reblogged_users &&
      this.props.post.reblogged_users.includes(this.props.username)
    ) {
      return;
    }

    this.setState({
      shareModalVisible: true,
    });
  }

  handleShareClick(e) {
    e.preventDefault();
    this.props.onActionInitiated(this.shareClick);
  }

  handleShareOk() {
    this.props.onShareClick();
  }

  handleShareCancel() {
    this.setState({
      shareModalVisible: false,
    });
  }

  handleShowReactions() {
    this.setState({
      reactionsModalVisible: true,
    });
  }

  handleCloseReactions() {
    this.setState({
      reactionsModalVisible: false,
    });
  }

  rebloggedUsersTitle = () => {
    const { reblogged_users: rebloggedUsers } = this.props.post;
    const maxUserCount = 3;

    return (
      <span>
        {rebloggedUsers.map(
          (user, index) =>
            index >= 0 &&
            index < maxUserCount && (
              <p key={user}>
                <Link to={`/@${user}`}>{user}</Link>
              </p>
            ),
        )}
        {rebloggedUsers.length > 3 && (
          <p>
            {this.props.intl.formatMessage(
              {
                id: 'and_more_reblogged',
                defaultMessage: `and {amount} more`,
              },
              {
                amount: rebloggedUsers.length - maxUserCount,
              },
            )}
          </p>
        )}
      </span>
    );
  };

  toggleModalReblog = () => {
    this.setState({ isUsersReblogModal: !this.state.isUsersReblogModal });
  };

  render() {
    const {
      intl,
      post,
      postState,
      pendingLike,
      ownPost,
      defaultVotePercent,
      username,
      pendingFlag,
      pendingFollow,
      pendingBookmark,
      saving,
      handlePostPopoverMenuClick,
      userComments,
    } = this.props;
    const upVotes = this.state.upVotes.sort(sortVotes);
    const downVotes = this.state.downVotes.sort(sortVotes).reverse();
    const hasRebloggedUsers = post.reblogged_users && !!post.reblogged_users.length;

    const totalPayout =
      parseFloat(post.pending_payout_value) +
      parseFloat(post.total_payout_value) +
      parseFloat(post.curator_payout_value);
    const voteRshares = post.active_votes.reduce(
      (a, b) => a + parseFloat(b.rshares_weight || b.rshares),
      0,
    );
    const ratio = voteRshares > 0 ? totalPayout / voteRshares : 0;

    const upVotesPreview = votes => {
      const sponsors = [];
      const currentUpvotes = [];

      take(votes, 10).map(vote => {
        if (vote.sponsor) {
          sponsors.push(
            <p>
              <Link to={`/@${vote.voter}`}>{vote.voter}&nbsp;</Link>
              <span style={{ opacity: '0.5' }}>
                {' '}
                <USDDisplay value={vote.rshares * ratio} currencyDisplay="symbols" />
              </span>
            </p>,
          );
        } else {
          currentUpvotes.push(
            <p key={vote.voter}>
              <Link to={`/@${vote.voter}`}>{vote.voter}&nbsp;</Link>
              {vote.rshares * ratio > 0.01 && (
                <span style={{ opacity: '0.5' }}>
                  <USDDisplay value={vote.rshares * ratio} currencyDisplay="symbols" />
                </span>
              )}
            </p>,
          );
        }

        return null;
      });

      return (
        <React.Fragment>
          {!isEmpty(sponsors) && (
            <React.Fragment>
              <div className="Buttons__sponsor-vote">
                <FormattedMessage id="vote_sponsor" defaultMessage="Sponsor:" />
              </div>
              {sponsors.map(sponsor => sponsor)}
            </React.Fragment>
          )}

          {!isEmpty(currentUpvotes) && (
            <React.Fragment>
              <div className="Buttons__upvotes">
                <FormattedMessage id="vote_upvotes" defaultMessage="Upvotes:" />
              </div>
              {currentUpvotes.map(upvote => upvote)}
            </React.Fragment>
          )}
        </React.Fragment>
      );
    };

    const upVotesDiff = upVotes.length - upVotesPreview(upVotes).length;
    const upVotesMore = upVotesDiff > 0 && (
      <p>
        <a role="presentation" onClick={this.handleShowReactions}>
          <FormattedMessage
            id="and_more_amount"
            defaultMessage="and {amount} more"
            values={{ amount: upVotesDiff }}
          />
        </a>
      </p>
    );

    const likeClass = classNames({ active: postState.isLiked, Buttons__link: true });
    const rebloggedClass = classNames({
      active: post.reblogged_users && post.reblogged_users.includes(username),
      Buttons__link: true,
    });

    const showReblogLink = !ownPost && post.parent_author === '';

    const messageLiked = { id: 'like', defaultMessage: 'Like' };
    const messageUnLiked = { id: 'unlike', defaultMessage: 'Unlike' };

    let likeTooltip = <span>{intl.formatMessage(messageLiked)}</span>;

    if (postState.isLiked) {
      likeTooltip = <span>{intl.formatMessage(messageUnLiked)}</span>;
    } else if (defaultVotePercent !== 10000) {
      likeTooltip = (
        <span>
          {intl.formatMessage({ id: 'like' })}{' '}
          <span style={{ opacity: 0.5 }}>
            <FormattedNumber
              style="percent" // eslint-disable-line
              value={defaultVotePercent / 10000}
            />
          </span>
        </span>
      );
    }

    return (
      <div className="Buttons">
        <React.Fragment>
          <ReactionsModal
            visible={this.state.reactionsModalVisible}
            upVotes={upVotes}
            ratio={ratio}
            downVotes={downVotes}
            onClose={this.handleCloseReactions}
            user={username}
          />
          <BTooltip title={likeTooltip}>
            <a role="presentation" className={likeClass} onClick={this.handleLikeClick}>
              {pendingLike ? (
                <Icon type="loading" />
              ) : (
                <i
                  className={`iconfont icon-${this.state.sliderVisible ? 'right' : 'praise_fill'}`}
                />
              )}
            </a>
          </BTooltip>
          {post.active_votes.length > 0 && (
            <span
              className="Buttons__number Buttons__reactions-count"
              role="presentation"
              onClick={this.handleShowReactions}
            >
              <BTooltip
                title={
                  <div>
                    {upVotes.length > 0 ? (
                      upVotesPreview(upVotes)
                    ) : (
                      <FormattedMessage id="no_likes" defaultMessage="No likes yet" />
                    )}
                    {upVotesMore}
                  </div>
                }
              >
                <FormattedNumber value={upVotes.length} />
                <span />
              </BTooltip>
            </span>
          )}
        </React.Fragment>
        <BTooltip title={intl.formatMessage({ id: 'comment', defaultMessage: 'Comment' })}>
          <a className="Buttons__link" role="presentation" onClick={this.handleCommentsClick}>
            <i className="iconfont icon-message_fill" />
          </a>
        </BTooltip>
        <span className="Buttons__number">
          {post.children > 0 && <FormattedNumber value={post.children} />}
        </span>
        <React.Fragment>
          {showReblogLink && (
            <BTooltip
              title={intl.formatMessage({
                id: postState.reblogged ? 'reblog_reblogged' : 'reblog',
                defaultMessage: postState.reblogged ? 'You already reblogged this post' : 'Reblog',
              })}
            >
              <a role="presentation" className={rebloggedClass} onClick={this.handleShareClick}>
                <i className="iconfont icon-share1 Buttons__share" />
              </a>
            </BTooltip>
          )}
          {!showReblogLink && (
            <BTooltip
              title={intl.formatMessage({
                id: postState.reblogged ? 'reblog_reblogged' : 'reblog',
                defaultMessage: postState.reblogged ? 'You already reblogged this post' : 'Reblog',
              })}
            >
              <a role="presentation" className={rebloggedClass}>
                <i className="iconfont icon-share1 Buttons__share" />
              </a>
            </BTooltip>
          )}
          {hasRebloggedUsers && (
            <BTooltip title={this.rebloggedUsersTitle()}>
              <span
                className="Buttons__number Buttons__reactions-count"
                role="presentation"
                onClick={this.toggleModalReblog}
              >
                {post.reblogged_users.length > 0 && (
                  <FormattedNumber value={post.reblogged_users.length} />
                )}
              </span>
            </BTooltip>
          )}
        </React.Fragment>
        <PostPopoverMenu
          pendingFlag={pendingFlag}
          pendingFollow={pendingFollow}
          pendingBookmark={pendingBookmark}
          saving={saving}
          postState={postState}
          intl={intl}
          post={post}
          handlePostPopoverMenuClick={handlePostPopoverMenuClick}
          ownPost={ownPost}
          userComments={userComments}
        >
          <i className="Buttons__post-menu iconfont icon-more" />
        </PostPopoverMenu>
        {!get(post, 'reblogged_users', []).includes(this.props.username) &&
          this.state.shareModalVisible && (
            <Modal
              title={intl.formatMessage({
                id: 'reblog_modal_title',
                defaultMessage: 'Reblog this post?',
              })}
              visible={this.state.shareModalVisible}
              confirmLoading={this.state.shareModalLoading}
              okText={intl.formatMessage({ id: 'reblog', defaultMessage: 'Reblog' })}
              cancelText={intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
              onOk={this.handleShareOk}
              onCancel={this.handleShareCancel}
            >
              <FormattedMessage
                id="reblog_modal_content"
                defaultMessage="This post will appear on your personal feed. This action cannot be reversed."
              />
            </Modal>
          )}
        {this.state.isUsersReblogModal && (
          <UserRebloggedModal
            userNames={post.reblogged_users}
            visible={this.state.isUsersReblogModal}
            onCancel={this.toggleModalReblog}
          />
        )}
      </div>
    );
  }
}

import React from 'react';
import PropTypes from 'prop-types';
import take from 'lodash/take';
import { FormattedMessage, FormattedNumber, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Icon, Modal } from 'antd';
import classNames from 'classnames';
import withAuthActions from '../../auth/withAuthActions';
import { sortVotes } from '../../helpers/sortHelpers';
import { getDownvotes, getUpvotes } from '../../helpers/voteHelpers';
import Popover from '../Popover';
import BTooltip from '../BTooltip';
import PopoverMenu, { PopoverMenuItem } from '../PopoverMenu/PopoverMenu';
import ReactionsModal from '../Reactions/ReactionsModal';
import USDDisplay from '../Utils/USDDisplay';
import UserRebloggedModal from '../../user/UserReblogModal';

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
    onReportClick: PropTypes.func.isRequired,
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
    onReportClick: () => {},
    handlePostPopoverMenuClick: () => {},
    username: '',
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
    this.onFlagClick = this.onFlagClick.bind(this);
    this.handleCommentsClick = this.handleCommentsClick.bind(this);
    this.renderPostPopoverMenu = this.renderPostPopoverMenu.bind(this);
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

  onFlagClick() {
    if (this.props.post.append_field_name) {
      this.props.onReportClick(this.props.post, this.props.postState, true);
    } else {
      this.props.handlePostPopoverMenuClick('report');
    }
  }

  handleReject = () => this.props.onActionInitiated(() => this.onFlagClick());

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

  renderPostPopoverMenu() {
    const {
      pendingFlag,
      pendingFollow,
      pendingBookmark,
      saving,
      postState,
      intl,
      post,
      handlePostPopoverMenuClick,
      ownPost,
    } = this.props;
    const { isReported } = postState;
    let followText = '';

    if (postState.userFollowed && !pendingFollow) {
      followText = intl.formatMessage(
        { id: 'unfollow_username', defaultMessage: 'Unfollow {username}' },
        { username: (post.guestInfo && post.guestInfo.userId) || post.author },
      );
    } else if (postState.userFollowed && pendingFollow) {
      followText = intl.formatMessage(
        { id: 'unfollow_username', defaultMessage: 'Unfollow {username}' },
        { username: (post.guestInfo && post.guestInfo.userId) || post.author },
      );
    } else if (!postState.userFollowed && !pendingFollow) {
      followText = intl.formatMessage(
        { id: 'follow_username', defaultMessage: 'Follow {username}' },
        { username: (post.guestInfo && post.guestInfo.userId) || post.author },
      );
    } else if (!postState.userFollowed && pendingFollow) {
      followText = intl.formatMessage(
        { id: 'follow_username', defaultMessage: 'Follow {username}' },
        { username: (post.guestInfo && post.guestInfo.userId) || post.author },
      );
    }

    let popoverMenu = [];

    if (ownPost && !post.author_original) {
      popoverMenu = [
        ...popoverMenu,
        <PopoverMenuItem key="edit">
          {saving ? <Icon type="loading" /> : <i className="iconfont icon-write" />}
          <FormattedMessage id="edit_post" defaultMessage="Edit post" />
        </PopoverMenuItem>,
      ];
    }

    if (!ownPost) {
      popoverMenu = [
        ...popoverMenu,
        <PopoverMenuItem key="follow" disabled={pendingFollow}>
          {pendingFollow ? <Icon type="loading" /> : <i className="iconfont icon-people" />}
          {followText}
        </PopoverMenuItem>,
      ];
    }

    popoverMenu = [
      ...popoverMenu,
      <PopoverMenuItem key="save">
        {pendingBookmark ? <Icon type="loading" /> : <i className="iconfont icon-collection" />}
        <FormattedMessage
          id={postState.isSaved ? 'unsave_post' : 'save_post'}
          defaultMessage={postState.isSaved ? 'Unsave post' : 'Save post'}
        />
      </PopoverMenuItem>,
      <PopoverMenuItem key="report">
        {pendingFlag ? (
          <Icon type="loading" />
        ) : (
          <i
            className={classNames('iconfont', {
              'icon-flag': !postState.isReported,
              'icon-flag_fill': postState.isReported,
            })}
          />
        )}
        {isReported ? (
          <FormattedMessage id="unflag_post" defaultMessage="Unflag post" />
        ) : (
          <FormattedMessage id="flag_post" defaultMessage="Flag post" />
        )}
      </PopoverMenuItem>,
    ];

    return (
      <Popover
        placement="bottomRight"
        trigger="click"
        content={
          <PopoverMenu onSelect={handlePostPopoverMenuClick} bold={false}>
            {popoverMenu}
          </PopoverMenu>
        }
      >
        <i className="Buttons__post-menu iconfont icon-more" />
      </Popover>
    );
  }

  rebloggedUsersTitle = () => {
    // eslint-disable-next-line camelcase
    const { reblogged_users } = this.props.post;
    const maxUserCount = 3;

    return (
      <span>
        {reblogged_users.map(
          (user, index) =>
            index >= 0 &&
            index < maxUserCount && (
              <p key={user}>
                <Link to={`/@${user}`}>{user}</Link>
              </p>
            ),
        )}
        {reblogged_users.length > 3 && (
          <p>
            {this.props.intl.formatMessage(
              {
                id: 'and_more_reblogged',
                defaultMessage: `and {amount} more`,
              },
              {
                amount: reblogged_users.length - maxUserCount,
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

    const upVotesPreview = votes =>
      take(votes, 10).map(vote => (
        <p key={vote.voter}>
          <Link to={`/@${vote.voter}`}>{vote.voter}&nbsp;</Link>
          {(vote.rshares_weight || vote.rshares) * ratio > 0.01 && (
            <span style={{ opacity: '0.5' }}>
              <USDDisplay value={(vote.rshares_weight || vote.rshares) * ratio} />
            </span>
          )}
        </p>
      ));

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
        {this.renderPostPopoverMenu()}
        {!(
          this.props.post.reblogged_users &&
          this.props.post.reblogged_users.includes(this.props.username)
        ) &&
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

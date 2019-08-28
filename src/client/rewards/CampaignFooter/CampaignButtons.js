import React from 'react';
import PropTypes from 'prop-types';
import take from 'lodash/take';
import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import classNames from 'classnames';
import withAuthActions from '../../auth/withAuthActions';
import { sortVotes } from '../../helpers/sortHelpers';
import {
  getUpvotes,
  getDownvotes,
  getAppendUpvotes,
  getAppendDownvotes,
} from '../../helpers/voteHelpers';
import PopoverMenu, { PopoverMenuItem } from '../../components/PopoverMenu/PopoverMenu';
import ReactionsModal from '../../components/Reactions/ReactionsModal';
import USDDisplay from '../../components/Utils/USDDisplay';
import '../../components/StoryFooter/Buttons.less';
import BTooltip from '../../components/BTooltip';
import Popover from '../../components/Popover';

@injectIntl
@withAuthActions
export default class CampaignButtons extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    post: PropTypes.shape().isRequired,
    postState: PropTypes.shape().isRequired,
    buttonsLayout: PropTypes.shape().isRequired,
    defaultVotePercent: PropTypes.number.isRequired,
    requiredObjectPermlink: PropTypes.string.isRequired,
    onActionInitiated: PropTypes.func.isRequired,
    pendingLike: PropTypes.bool,
    pendingFollow: PropTypes.bool,
    pendingFollowObject: PropTypes.bool,
    onLikeClick: PropTypes.func,
    onCommentClick: PropTypes.func,
    handlePostPopoverMenuClick: PropTypes.func,
  };

  static defaultProps = {
    ownPost: false,
    pendingLike: false,
    pendingFlag: false,
    pendingFollow: false,
    pendingFollowObject: false,
    pendingBookmark: false,
    saving: false,
    onLikeClick: () => {},
    onCommentClick: () => {},
    handlePostPopoverMenuClick: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      shareModalVisible: false,
      shareModalLoading: false,
      reactionsModalVisible: false,
      loadingEdit: false,
    };

    this.handleLikeClick = this.handleLikeClick.bind(this);
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
  }
  getFollowText(isFollowed, permlink) {
    if (isFollowed) {
      return this.props.intl.formatMessage(
        { id: 'unfollow_username', defaultMessage: 'Unfollow {username}' },
        { username: permlink },
      );
    }
    return this.props.intl.formatMessage(
      { id: 'follow_username', defaultMessage: 'Follow {username}' },
      { username: permlink },
    );
  }

  handleLikeClick() {
    this.props.onActionInitiated(this.props.onLikeClick);
  }

  handleCommentsClick(e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onCommentClick();
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
      pendingFollow,
      pendingFollowObject,
      postState,
      post,
      handlePostPopoverMenuClick,
      requiredObjectPermlink,
    } = this.props;
    const followText = this.getFollowText(postState.userFollowed, post.author);
    const followObjText = this.getFollowText(postState.objectFollowed, requiredObjectPermlink);

    let popoverMenu = [];

    popoverMenu = [
      ...popoverMenu,
      <PopoverMenuItem key="follow" disabled={pendingFollow}>
        {pendingFollow ? <Icon type="loading" /> : <i className="iconfont icon-people" />}
        {followText}
      </PopoverMenuItem>,
    ];
    popoverMenu = [
      ...popoverMenu,
      <PopoverMenuItem key="followObject" disabled={pendingFollowObject}>
        {pendingFollowObject ? (
          <Icon type="loading" />
        ) : (
          <Icon type="codepen" className="CampaignFooter__button-icon" />
        )}
        {followObjText}
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

  render() {
    const { intl, post, postState, pendingLike, defaultVotePercent, buttonsLayout } = this.props;

    const isAppend = !!this.props.post.append_field_name;

    const upVotes = isAppend
      ? getAppendUpvotes(post.active_votes).sort(sortVotes)
      : getUpvotes(post.active_votes).sort(sortVotes);
    const downVotes = isAppend
      ? getAppendDownvotes(post.active_votes)
          .sort(sortVotes)
          .reverse()
      : getDownvotes(post.active_votes)
          .sort(sortVotes)
          .reverse();

    const totalPayout =
      parseFloat(post.pending_payout_value) +
      parseFloat(post.total_payout_value) +
      parseFloat(post.curator_payout_value);
    const voteRshares = post.active_votes.reduce((a, b) => a + parseFloat(b.rshares), 0);
    const ratio = voteRshares > 0 ? totalPayout / voteRshares : 0;

    const upVotesPreview = take(upVotes, 10).map(vote => (
      <p key={vote.voter}>
        <Link to={`/@${vote.voter}`}>{vote.voter}</Link>

        {vote.rshares * ratio > 0.01 && (
          <span style={{ opacity: '0.5' }}>
            {' '}
            <USDDisplay value={vote.rshares * ratio} />
          </span>
        )}
      </p>
    ));

    const upVotesDiff = upVotes.length - upVotesPreview.length;
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
          {buttonsLayout}
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
                      upVotesPreview
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
        {this.renderPostPopoverMenu()}
        <ReactionsModal
          visible={this.state.reactionsModalVisible}
          upVotes={upVotes}
          ratio={ratio}
          downVotes={downVotes}
          onClose={this.handleCloseReactions}
        />
      </div>
    );
  }
}

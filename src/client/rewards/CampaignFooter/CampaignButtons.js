import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedNumber } from 'react-intl';
import { Icon } from 'antd';
import classNames from 'classnames';
import LinkButton from '../../components/LinkButton/LinkButton';
import withAuthActions from '../../auth/withAuthActions';
import PopoverMenu, { PopoverMenuItem } from '../../components/PopoverMenu/PopoverMenu';
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
    propositionId: PropTypes.string.isRequired,
    requiredObjectPermlink: PropTypes.string.isRequired,
    requiredObjectName: PropTypes.string.isRequired,
    proposedObjectPermlink: PropTypes.string.isRequired,
    proposedObjectName: PropTypes.string.isRequired,
    onActionInitiated: PropTypes.func.isRequired,
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

  // Not used at that moment
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
    const followText = this.getFollowText(postState.userFollowed, post.parent_author);
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

    popoverMenu = [
      ...popoverMenu,
      <PopoverMenuItem key="release" disabled={pendingFollow}>
        <i
          className={classNames('iconfont', {
            'icon-flag': !postState.isReported,
            'icon-flag_fill': postState.isReported,
          })}
        />
        {this.props.intl.formatMessage({ id: 'unfollow_username', defaultMessage: 'Release' })}
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
    const {
      intl,
      post,
      requiredObjectPermlink,
      requiredObjectName,
      proposedObjectPermlink,
      proposedObjectName,
      propositionId,
    } = this.props;

    return (
      <div className="Buttons">
        <div>
          <BTooltip title={intl.formatMessage({ id: 'comment', defaultMessage: 'Comment' })}>
            <a className="Buttons__link" role="presentation" onClick={this.handleCommentsClick}>
              <i className="iconfont icon-message_fill" />
            </a>
          </BTooltip>
          <span className="Buttons__number">
            {post.children > 0 && <FormattedNumber value={post.children} />}
          </span>
          {this.renderPostPopoverMenu()}
        </div>
        <React.Fragment>
          <LinkButton
            block={false}
            className="WriteReview-button"
            to={`/editor?object=[${requiredObjectName}](${requiredObjectPermlink})&object=[${proposedObjectName}](${proposedObjectPermlink})&campaign=${propositionId}`}
            type="primary"
          >
            {intl.formatMessage({
              id: 'write_review',
              defaultMessage: `Write review`,
            })}
          </LinkButton>
        </React.Fragment>
      </div>
    );
  }
}

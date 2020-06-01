import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedNumber } from 'react-intl';
import { Icon, Button } from 'antd';
import classNames from 'classnames';
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
    daysLeft: PropTypes.number.isRequired,
    post: PropTypes.shape().isRequired,
    postState: PropTypes.shape().isRequired,
    onActionInitiated: PropTypes.func.isRequired,
    pendingFollow: PropTypes.bool,
    pendingFollowObject: PropTypes.bool,
    onLikeClick: PropTypes.func,
    onCommentClick: PropTypes.func,
    handlePostPopoverMenuClick: PropTypes.func,
    toggleModalDetails: PropTypes.func,
    requiredObjectName: PropTypes.bool.isRequired,
    propositionGuideName: PropTypes.string.isRequired,
    propositionStatus: PropTypes.string.isRequired,
    match: PropTypes.shape().isRequired,
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
    toggleModalDetails: () => {},
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
        { id: 'campaign_buttons_unfollow_username', defaultMessage: 'Unfollow {username}' },
        { username: permlink },
      );
    }
    return this.props.intl.formatMessage(
      { id: 'campaign_buttons_follow_username', defaultMessage: 'Follow {username}' },
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

  openModalDetails = () => {
    this.props.toggleModalDetails({ value: true });
  };

  getPopoverMenuHistory = () => {
    const { propositionStatus, intl } = this.props;

    switch (propositionStatus) {
      case 'reserved':
        return [
          <PopoverMenuItem key="reserved">
            {intl.formatMessage({
              id: 'view_reservation',
              defaultMessage: 'View reservation',
            })}
          </PopoverMenuItem>,
          <PopoverMenuItem key="release">
            {intl.formatMessage({
              id: 'campaign_buttons_release',
              defaultMessage: 'Release reservation',
            })}
          </PopoverMenuItem>,
        ];
      case 'completed':
        return [
          <PopoverMenuItem key="completed">
            {intl.formatMessage({
              id: 'view_reservation',
              defaultMessage: 'View reservation',
            })}
          </PopoverMenuItem>,
          <PopoverMenuItem key="completed">
            {intl.formatMessage({
              id: 'open_review',
              defaultMessage: 'Open review',
            })}
          </PopoverMenuItem>,
          <PopoverMenuItem key="completed">
            {intl.formatMessage({
              id: 'show_report',
              defaultMessage: 'Show report',
            })}
          </PopoverMenuItem>,
        ];
      case 'rejected':
        return [
          <PopoverMenuItem key="rejected">
            {intl.formatMessage({
              id: 'view_reservation',
              defaultMessage: 'View reservation',
            })}
          </PopoverMenuItem>,
          <PopoverMenuItem key="rejected">
            {intl.formatMessage({
              id: 'open_review',
              defaultMessage: 'Open review',
            })}
          </PopoverMenuItem>,
          <PopoverMenuItem key="rejected">
            {intl.formatMessage({
              id: 'rejection_note',
              defaultMessage: 'Rejection note',
            })}
          </PopoverMenuItem>,
        ];
      default:
        return [
          <PopoverMenuItem key="reserved">
            {intl.formatMessage({
              id: 'view_reservation',
              defaultMessage: 'View reservation',
            })}
          </PopoverMenuItem>,
        ];
    }
  };

  getPopoverMenuMessages = () => {
    const { propositionStatus, intl } = this.props;
    switch (propositionStatus) {
      case 'reserved':
        return [
          <PopoverMenuItem key="reserved">
            {intl.formatMessage({
              id: 'view_reservation',
              defaultMessage: 'View reservation',
            })}
          </PopoverMenuItem>,
          <PopoverMenuItem key="release">
            {intl.formatMessage({
              id: 'campaign_buttons_release',
              defaultMessage: 'Release reservation',
            })}
          </PopoverMenuItem>,
          <PopoverMenuItem key="add">
            {intl.formatMessage({
              id: 'add_to_blacklist',
              defaultMessage: 'Add to blacklist',
            })}
          </PopoverMenuItem>,
        ];
      case 'completed':
        return [
          <PopoverMenuItem key="completed">
            {intl.formatMessage({
              id: 'view_reservation',
              defaultMessage: 'View reservation',
            })}
          </PopoverMenuItem>,
          <PopoverMenuItem key="completed">
            {intl.formatMessage({
              id: 'open_review',
              defaultMessage: 'Open review',
            })}
          </PopoverMenuItem>,
          <PopoverMenuItem key="completed">
            {intl.formatMessage({
              id: 'show_report',
              defaultMessage: 'Show report',
            })}
          </PopoverMenuItem>,
          <PopoverMenuItem key="reject">
            {intl.formatMessage({
              id: 'reject_review',
              defaultMessage: 'Reject review',
            })}
          </PopoverMenuItem>,
          <PopoverMenuItem key="add">
            {intl.formatMessage({
              id: 'add_to_blacklist',
              defaultMessage: 'Add to blacklist',
            })}
          </PopoverMenuItem>,
        ];
      case 'rejected':
        return [
          <PopoverMenuItem key="rejected">
            {intl.formatMessage({
              id: 'view_reservation',
              defaultMessage: 'View reservation',
            })}
          </PopoverMenuItem>,
          <PopoverMenuItem key="rejected">
            {intl.formatMessage({
              id: 'open_review',
              defaultMessage: 'Open review',
            })}
          </PopoverMenuItem>,
          <PopoverMenuItem key="rejected">
            {intl.formatMessage({
              id: 'rejection_note',
              defaultMessage: 'Rejection note',
            })}
          </PopoverMenuItem>,
          <PopoverMenuItem key="reinstate">
            {intl.formatMessage({
              id: 'reinstate_reward',
              defaultMessage: 'Reinstate reward',
            })}
          </PopoverMenuItem>,
          <PopoverMenuItem key="add">
            {intl.formatMessage({
              id: 'add_to_blacklist',
              defaultMessage: 'Add to blacklist',
            })}
          </PopoverMenuItem>,
        ];
      default:
        return [
          <PopoverMenuItem key="reserved">
            {intl.formatMessage({
              id: 'view_reservation',
              defaultMessage: 'View reservation',
            })}
          </PopoverMenuItem>,
          <PopoverMenuItem key="add">
            {intl.formatMessage({
              id: 'add_to_blacklist',
              defaultMessage: 'Add to blacklist',
            })}
          </PopoverMenuItem>,
        ];
    }
  };

  getButtonsTitle = () => {
    const { propositionStatus, intl } = this.props;
    switch (propositionStatus) {
      case 'expired':
        return intl.formatMessage({
          id: 'expired',
          defaultMessage: 'Expired',
        });
      case 'released':
        return intl.formatMessage({
          id: 'released',
          defaultMessage: 'Released',
        });
      case 'completed':
        return intl.formatMessage({
          id: 'completed',
          defaultMessage: 'Completed',
        });
      case 'rejected':
        return intl.formatMessage({
          id: 'rejected',
          defaultMessage: 'Rejected',
        });
      default:
        return intl.formatMessage({
          id: 'campaign_buttons_reserved',
          defaultMessage: 'Reserved',
        });
    }
  };

  renderPostPopoverMenu() {
    const {
      pendingFollow,
      pendingFollowObject,
      postState,
      handlePostPopoverMenuClick,
      requiredObjectName,
      propositionGuideName,
      match,
    } = this.props;

    const followText = this.getFollowText(postState.userFollowed, `@${propositionGuideName}`);

    const followObjText = this.getFollowText(postState.objectFollowed, requiredObjectName);

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
        {this.props.intl.formatMessage({
          id: 'campaign_buttons_release',
          defaultMessage: 'Release reservation',
        })}
      </PopoverMenuItem>,
    ];

    const popoverMenuHistory = this.getPopoverMenuHistory();
    const popoverMenuMessages = this.getPopoverMenuMessages();
    const getPopoverMenu = () => {
      if (match.params.filterKey === 'messages') {
        return popoverMenuMessages;
      }
      if (match.params.filterKey === 'reserved') {
        return popoverMenu;
      }
      return popoverMenuHistory;
    };

    return (
      <Popover
        placement="bottomRight"
        trigger="click"
        content={
          <PopoverMenu onSelect={handlePostPopoverMenuClick} bold={false}>
            {getPopoverMenu()}
          </PopoverMenu>
        }
      >
        <i className="Buttons__post-menu iconfont icon-more" />
      </Popover>
    );
  }

  render() {
    const { intl, post, daysLeft, match } = this.props;
    const buttonsTitle = this.getButtonsTitle();

    return (
      <div className="Buttons">
        <div className="Buttons__wrap">
          <div>
            {buttonsTitle}
            {match.params.filterKey === 'reserved'
              ? `- ${daysLeft} ${intl.formatMessage({
                  id: 'campaign_buttons_days_left',
                  defaultMessage: 'days left',
                })} `
              : ''}
          </div>
          <BTooltip
            title={intl.formatMessage({
              id: 'campaign_buttons_comment',
              defaultMessage: 'Comment',
            })}
          >
            <a className="Buttons__link" role="presentation" onClick={this.handleCommentsClick}>
              <i className="iconfont icon-message_fill" />
            </a>
          </BTooltip>
          <div className="Buttons__number">
            {post.children > 0 && <FormattedNumber value={post.children} />}
          </div>
          {this.renderPostPopoverMenu()}
        </div>
        <React.Fragment>
          <Button type="primary" onClick={this.openModalDetails}>
            {intl.formatMessage({
              id: 'campaign_buttons_write_review',
              defaultMessage: `Write review`,
            })}
          </Button>
        </React.Fragment>
      </div>
    );
  }
}

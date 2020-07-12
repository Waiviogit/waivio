import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedNumber } from 'react-intl';
import { Icon, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { map, get } from 'lodash';
import withAuthActions from '../../auth/withAuthActions';
import PopoverMenu, { PopoverMenuItem } from '../../components/PopoverMenu/PopoverMenu';
import BTooltip from '../../components/BTooltip';
import Popover from '../../components/Popover';
import { popoverDataHistory, popoverDataMessages, buttonsTitle } from '../rewardsHelper';
import Avatar from '../../components/Avatar';
import WeightTag from '../../components/WeightTag';
import { rejectReview } from '../../user/userActions';
import * as apiConfig from '../../../waivioApi/config.json';
import { changeBlackAndWhiteLists } from '../rewardsActions';
import '../../components/StoryFooter/Buttons.less';

@injectIntl
@withAuthActions
@connect(null, { rejectReview, changeBlackAndWhiteLists })
export default class CampaignButtons extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    daysLeft: PropTypes.number.isRequired,
    postState: PropTypes.shape().isRequired,
    onActionInitiated: PropTypes.func.isRequired,
    pendingFollow: PropTypes.bool,
    pendingFollowObject: PropTypes.bool,
    onLikeClick: PropTypes.func,
    onCommentClick: PropTypes.func,
    handlePostPopoverMenuClick: PropTypes.func,
    toggleModalDetails: PropTypes.func,
    requiredObjectName: PropTypes.string.isRequired,
    propositionGuideName: PropTypes.string.isRequired,
    propositionStatus: PropTypes.string.isRequired,
    match: PropTypes.shape().isRequired,
    proposition: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    toggleModal: PropTypes.func,
    rejectReview: PropTypes.func.isRequired,
    changeBlackAndWhiteLists: PropTypes.func.isRequired,
    numberOfComments: PropTypes.number,
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
    toggleModal: () => {},
    numberOfComments: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      shareModalVisible: false,
      shareModalLoading: false,
      reactionsModalVisible: false,
      loadingEdit: false,
      visible: false,
    };

    this.handleLikeClick = this.handleLikeClick.bind(this);
    this.handleShowReactions = this.handleShowReactions.bind(this);
    this.handleCloseReactions = this.handleCloseReactions.bind(this);
    this.handleCommentsClick = this.handleCommentsClick.bind(this);

    this.buttonsTitle = buttonsTitle[this.props.propositionStatus] || buttonsTitle.default;
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

  handleRejectClick = () => {
    const { proposition } = this.props;
    const appName = apiConfig[process.env.NODE_ENV].appName || 'waivio';
    const companyAuthor = get(proposition, ['guide', 'name']);
    const companyPermlink = get(proposition, 'activation_permlink');
    const reservationPermlink = get(proposition, ['users', '0', 'permlink']);
    const objPermlink = get(proposition, ['users', '0', 'object_permlink']);
    const userName = get(proposition, ['users', '0', 'name']);
    return this.props
      .rejectReview({
        companyAuthor,
        companyPermlink,
        username: userName,
        reservationPermlink,
        objPermlink,
        appName,
      })
      .then(() => {
        message.success(
          this.props.intl.formatMessage({
            id: 'review_rejected',
            defaultMessage: 'Review rejected',
          }),
        );
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleAddToBlacklistClick = () => {
    const { proposition } = this.props;
    const id = 'addUsersToBlackList';
    const idsUsers = [];
    idsUsers.push(get(proposition, ['users', '0', 'name']));
    return this.props
      .changeBlackAndWhiteLists(id, idsUsers)
      .then(() => {
        message.success(
          this.props.intl.formatMessage({
            id: 'user_was_added_to_blacklist',
            defaultMessage: 'Users were added to blacklist',
          }),
        );
      })
      .catch(error => {
        console.log(error);
      });
  };

  openModalDetails = () => {
    this.props.toggleModalDetails({ value: true });
  };

  getPopoverMenu = () => {
    const { propositionStatus, match } = this.props;
    if (match.params.filterKey === 'messages') {
      return popoverDataMessages[propositionStatus] || [];
    }
    return popoverDataHistory[propositionStatus] || [];
  };

  hide = () => {
    this.setState({
      visible: false,
    });
  };

  handleVisibleChange = visible => {
    this.setState({ visible });
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
      intl,
      proposition,
      user,
      toggleModal,
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

    const reservationPermlink = get(proposition, ['users', '0', 'permlink']);
    const propositionUserName = get(proposition, ['users', '0', 'name']);
    const reviewPermlink = get(proposition, ['users', '0', 'review_permlink']);

    return (
      <Popover
        placement="bottomRight"
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
        content={
          <PopoverMenu hide={this.hide} onSelect={handlePostPopoverMenuClick} bold={false}>
            {match.params.filterKey === 'reserved' || match.params.filterKey === 'all'
              ? popoverMenu
              : map(this.getPopoverMenu(), item => {
                  switch (item.id) {
                    case 'view_reservation':
                      return (
                        <PopoverMenuItem key={item.key}>
                          <Link to={`/@${propositionUserName}/${reservationPermlink}`}>
                            {intl.formatMessage({
                              id: item.id,
                              defaultMessage: item.defaultMessage,
                            })}
                          </Link>
                        </PopoverMenuItem>
                      );
                    case 'campaign_buttons_release':
                      return (
                        <PopoverMenuItem key={item.key}>
                          <div role="presentation" onClick={toggleModal}>
                            {intl.formatMessage({
                              id: item.id,
                              defaultMessage: item.defaultMessage,
                            })}
                          </div>
                        </PopoverMenuItem>
                      );
                    case 'show_report':
                      return (
                        <PopoverMenuItem key={item.key}>
                          <Link to={`/rewards/receivables/@${user.name}`}>
                            {intl.formatMessage({
                              id: item.id,
                              defaultMessage: item.defaultMessage,
                            })}
                          </Link>
                        </PopoverMenuItem>
                      );
                    case 'reject_review':
                      return (
                        <PopoverMenuItem key={item.key}>
                          <div role="presentation" onClick={this.handleRejectClick}>
                            {intl.formatMessage({
                              id: item.id,
                              defaultMessage: item.defaultMessage,
                            })}
                          </div>
                        </PopoverMenuItem>
                      );
                    case 'add_to_blacklist':
                      return (
                        <PopoverMenuItem key={item.key}>
                          <div role="presentation" onClick={this.handleAddToBlacklistClick}>
                            {intl.formatMessage({
                              id: item.id,
                              defaultMessage: item.defaultMessage,
                            })}
                          </div>
                        </PopoverMenuItem>
                      );
                    case 'open_review':
                      return (
                        <PopoverMenuItem key={item.key}>
                          <Link to={`/@${user.name}/${reviewPermlink}`}>
                            {intl.formatMessage({
                              id: item.id,
                              defaultMessage: item.defaultMessage,
                            })}
                          </Link>
                        </PopoverMenuItem>
                      );
                    default:
                      return (
                        <PopoverMenuItem key={item.key}>
                          {intl.formatMessage({
                            id: item.id,
                            defaultMessage: item.defaultMessage,
                          })}
                        </PopoverMenuItem>
                      );
                  }
                })}
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
      numberOfComments,
      daysLeft,
      propositionStatus,
      match,
      user,
      proposition,
    } = this.props;
    const isAssigned = get(proposition, ['objects', '0', 'assigned']);
    const propositionUserName = get(proposition, ['users', '0', 'name']);
    const reviewPermlink = get(proposition, ['users', '0', 'review_permlink']);
    const propositionUserWeight = get(proposition, ['users', '0', 'wobjects_weight']);
    return (
      <div className="Buttons">
        <div className="Buttons__wrap">
          <div>
            {intl.formatMessage({
              id: this.buttonsTitle.id,
              defaultMessage: this.buttonsTitle.defaultMessage,
            })}
            {this.buttonsTitle.defaultMessage === 'Reserved'
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
            {numberOfComments > 0 && <FormattedNumber value={numberOfComments} />}
          </div>
          {this.renderPostPopoverMenu()}
        </div>
        {isAssigned && (
          <React.Fragment>
            <Button type="primary" onClick={this.openModalDetails}>
              {intl.formatMessage({
                id: 'campaign_buttons_write_review',
                defaultMessage: `Write review`,
              })}
            </Button>
          </React.Fragment>
        )}
        {match.params.filterKey === 'messages' && (
          <div className="Buttons__avatar">
            <Avatar username={propositionUserName} size={30} />{' '}
            <div role="presentation" className="userName">
              {propositionUserName}
            </div>
            <WeightTag weight={propositionUserWeight} />
          </div>
        )}
        {propositionStatus === 'completed' && match.params.filterKey === 'history' && (
          <Link to={`/@${user.name}/${reviewPermlink}`}>
            {intl.formatMessage({
              id: 'review',
              defaultMessage: `Review`,
            })}{' '}
            {'>'}
          </Link>
        )}
      </div>
    );
  }
}

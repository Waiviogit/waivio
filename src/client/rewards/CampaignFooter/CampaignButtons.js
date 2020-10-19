import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedNumber } from 'react-intl';
import { Icon, Button, message, Modal, InputNumber } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { map, get, includes, isEmpty, some, every } from 'lodash';
import withAuthActions from '../../auth/withAuthActions';
import PopoverMenu, { PopoverMenuItem } from '../../components/PopoverMenu/PopoverMenu';
import BTooltip from '../../components/BTooltip';
import Popover from '../../components/Popover';
import { popoverDataHistory, buttonsTitle, getPopoverDataMessages } from '../rewardsHelper';
import {
  GUIDE_HISTORY,
  MESSAGES,
  ASSIGNED,
  HISTORY,
  IS_RESERVED,
  IS_ALL,
  FRAUD_DETECTION,
} from '../../../common/constants/rewards';
import Avatar from '../../components/Avatar';
import WeightTag from '../../components/WeightTag';
import { rejectReview, changeReward, reinstateReward } from '../../user/userActions';
import * as apiConfig from '../../../waivioApi/config.json';
import {
  changeBlackAndWhiteLists,
  setDataForSingleReport,
  getBlacklist,
  getFraudSuspicion,
} from '../rewardsActions';
import { getReport } from '../../../waivioApi/ApiClient';
import Report from '../Report/Report';
import '../../components/StoryFooter/Buttons.less';

@injectIntl
@withAuthActions
@connect(null, {
  rejectReview,
  changeBlackAndWhiteLists,
  setDataForSingleReport,
  getBlacklist,
  changeReward,
  reinstateReward,
  getFraudSuspicion,
})
export default class CampaignButtons extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    daysLeft: PropTypes.number.isRequired,
    postState: PropTypes.shape().isRequired,
    onActionInitiated: PropTypes.func,
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
    changeReward: PropTypes.func.isRequired,
    reinstateReward: PropTypes.func.isRequired,
    changeBlackAndWhiteLists: PropTypes.func.isRequired,
    numberOfComments: PropTypes.number,
    getMessageHistory: PropTypes.func,
    setDataForSingleReport: PropTypes.func.isRequired,
    getBlacklist: PropTypes.func.isRequired,
    blacklistUsers: PropTypes.arrayOf(PropTypes.string),
    sortFraudDetection: PropTypes.string,
    getFraudSuspicion: PropTypes.func,
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
    getMessageHistory: () => {},
    onActionInitiated: () => {},
    getFraudSuspicion: () => {},
    blacklistUsers: [],
    sortFraudDetection: 'reservation',
  };

  constructor(props) {
    super(props);

    this.state = {
      shareModalVisible: false,
      shareModalLoading: false,
      reactionsModalVisible: false,
      loadingEdit: false,
      visible: false,
      isModalReportOpen: false,
      isOpenModalEnterAmount: false,
      value: '',
      isUserInBlacklist: false,
      isLoading: false,
    };

    this.handleLikeClick = this.handleLikeClick.bind(this);
    this.handleShowReactions = this.handleShowReactions.bind(this);
    this.handleCloseReactions = this.handleCloseReactions.bind(this);
    this.handleCommentsClick = this.handleCommentsClick.bind(this);

    this.matchParams = !isEmpty(this.props.match) ? this.props.match.params[0] : '';
  }

  componentDidMount() {
    const { blacklistUsers } = this.props;
    this.getIsUserInBlackList(blacklistUsers);
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

  updatePage = () => {
    const { user, sortFraudDetection } = this.props;

    if (this.matchParams === FRAUD_DETECTION) {
      const requestData = {
        guideName: user.name,
        fraudSuspicion: true,
        sort: sortFraudDetection,
      };

      return this.props.getFraudSuspicion(requestData);
    }

    return this.props.getMessageHistory();
  };

  handleRejectClick = () => {
    const { proposition } = this.props;
    const appName = apiConfig[process.env.NODE_ENV].appName || 'waivio';
    const companyAuthor = get(proposition, ['guide', 'name']);
    const companyPermlink = get(proposition, 'activation_permlink');
    const reservationPermlink = get(proposition, ['users', '0', 'permlink']);
    const objPermlink = get(proposition, ['users', '0', 'object_permlink']);
    const userName = get(proposition, ['users', '0', 'rootName']);
    const guideName = get(proposition, ['guideName']);
    return this.props
      .rejectReview({
        companyAuthor,
        companyPermlink,
        username: userName,
        guideName,
        reservationPermlink,
        objPermlink,
        appName,
      })
      .then(() => {
        setTimeout(() => {
          this.updatePage();
          message.success(
            this.props.intl.formatMessage({
              id: 'review_rejected',
              defaultMessage: 'Review rejected',
            }),
          );
        }, 8000);
      })
      .catch(e => message.error(e.message));
  };

  handleReinstateReward = () => {
    const { proposition } = this.props;
    const appName = apiConfig[process.env.NODE_ENV].appName || 'waivio';
    const companyAuthor = get(proposition, ['guide', 'name']);
    const reservationPermlink = get(proposition, ['users', '0', 'permlink']);
    const username = get(proposition, ['users', '0', 'rootName']);
    return this.props
      .reinstateReward({
        companyAuthor,
        username,
        reservationPermlink,
        appName,
      })
      .then(() => {
        setTimeout(() => {
          this.props.getMessageHistory().then(() => {
            message.success(
              this.props.intl.formatMessage({
                id: 'review_reinstated',
                defaultMessage: 'Review reinstated',
              }),
            );
          });
        }, 8000);
      })
      .catch(e => message.error(e.message));
  };

  getIsUserInBlackList = blacklistUsers => {
    const { proposition } = this.props;
    const isUserInBlacklist = includes(blacklistUsers, get(proposition, ['users', '0', 'name']));
    return this.setState({ isUserInBlacklist });
  };

  openModalEnterAmount = () => this.setState({ isOpenModalEnterAmount: true });

  handleChangeValue = value => {
    this.setState({ value });
  };

  handleOkClick = () => {
    const { value } = this.state;
    if (value > 0) {
      this.setState({ isLoading: true });
      this.handleChangeReward().then(() =>
        this.setState({ isLoading: false, value: '', isOpenModalEnterAmount: false }),
      );
    }
  };

  handleCancel = () => this.setState({ isOpenModalEnterAmount: false, value: '' });

  handleChangeReward = async () => {
    try {
      const { proposition, match } = this.props;
      const appName = apiConfig[process.env.NODE_ENV].appName || 'waivio';
      const companyAuthor = get(proposition, ['guide', 'name']);
      const companyPermlink = get(proposition, 'activation_permlink');
      const reservationPermlink = get(proposition, ['users', '0', 'permlink']);
      const userName = get(proposition, ['users', '0', 'name']);
      const amount = this.state.value;
      await this.props.changeReward({
        companyAuthor,
        companyPermlink,
        username: userName,
        reservationPermlink,
        appName,
        amount,
      });
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          this.props
            .getMessageHistory()
            .then(() => resolve())
            .catch(error => reject(error));
        }, 10000);
      });
      if (match.params[0] === HISTORY) {
        message.success(
          this.props.intl.formatMessage({
            id: 'reward_has_been_decreased',
            defaultMessage: 'Reward has been decreased',
          }),
        );
      } else {
        message.success(
          this.props.intl.formatMessage({
            id: 'reward_has_been_increased',
            defaultMessage: 'Reward has been increased',
          }),
        );
      }
    } catch (e) {
      message.error(e.message);
    }
  };

  handleChangeBlacklistClick = () => {
    const { proposition } = this.props;
    const { isUserInBlacklist } = this.state;
    const id = isUserInBlacklist ? 'removeUsersFromBlackList' : 'addUsersToBlackList';
    const idsUsers = [];
    idsUsers.push(get(proposition, ['users', '0', 'name']));
    return this.props
      .changeBlackAndWhiteLists(id, idsUsers)
      .then(() => {
        setTimeout(() => {
          this.props.getBlacklist(proposition.guideName).then(data => {
            const blacklist = get(data, ['value', 'blackList', 'blackList']);
            const blacklistNames = map(blacklist, user => user.name);
            this.getIsUserInBlackList(blacklistNames);
          });
        }, 7000);
      })
      .then(() => {
        this.setState({ isUserInBlacklist: id === 'addUsersToBlackList' });
        message.success(
          this.props.intl.formatMessage(
            isUserInBlacklist
              ? {
                  id: 'user_was_deleted_from_blacklist',
                  defaultMessage: 'User was deleted from the blacklist',
                }
              : {
                  id: 'user_was_added_to_blacklist',
                  defaultMessage: 'Users were added to blacklist',
                },
          ),
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
    const { propositionStatus } = this.props;
    const { isUserInBlacklist } = this.state;
    const matchParams = [MESSAGES, GUIDE_HISTORY, FRAUD_DETECTION];
    if (includes(matchParams, this.matchParams)) {
      return getPopoverDataMessages({ propositionStatus, isUserInBlacklist }) || [];
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
    const { isUserInBlacklist } = this.state;

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
    const matchParams = [MESSAGES, GUIDE_HISTORY, FRAUD_DETECTION];
    const userName = includes(matchParams, this.matchParams) ? propositionUserName : user.name;
    const toggleModalReport = e => {
      e.preventDefault();
      e.stopPropagation();
      const requestParams = {
        guideName: proposition.guideName,
        userName,
        reservationPermlink,
      };
      getReport(requestParams)
        .then(data => {
          this.props.setDataForSingleReport(data);
        })
        .then(() => this.setState({ isModalReportOpen: !this.state.isModalReportOpen }))
        .catch(() => console.log(e));
    };

    const closeModalReport = () => this.setState({ isModalReportOpen: false });
    const history = ['history', 'guideHistory', 'messages'];
    const isHistory = some(history, item => includes(match.path, item));

    return (
      <Popover
        placement="bottomRight"
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
        content={
          <PopoverMenu hide={this.hide} onSelect={handlePostPopoverMenuClick} bold={false}>
            {!isHistory
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
                          <div
                            className="PaymentTable__report"
                            onClick={toggleModalReport}
                            role="presentation"
                          >
                            <span>
                              {intl.formatMessage({
                                id: item.id,
                                defaultMessage: item.defaultMessage,
                              })}
                            </span>
                          </div>
                          <Report
                            isModalReportOpen={this.state.isModalReportOpen}
                            toggleModal={closeModalReport}
                          />
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
                    case 'reinstate_reward':
                      return (
                        <PopoverMenuItem key={item.key}>
                          <div role="presentation" onClick={this.handleReinstateReward}>
                            {intl.formatMessage({
                              id: item.id,
                              defaultMessage: item.defaultMessage,
                            })}
                          </div>
                        </PopoverMenuItem>
                      );
                    case 'increase_reward':
                      return (
                        <PopoverMenuItem key={item.key}>
                          <div role="presentation" onClick={this.openModalEnterAmount}>
                            {intl.formatMessage({
                              id: item.id,
                              defaultMessage: item.defaultMessage,
                            })}
                          </div>
                        </PopoverMenuItem>
                      );
                    case 'decrease_reward':
                      return (
                        <PopoverMenuItem key={item.key}>
                          <div role="presentation" onClick={this.openModalEnterAmount}>
                            {intl.formatMessage({
                              id: item.id,
                              defaultMessage: item.defaultMessage,
                            })}
                          </div>
                        </PopoverMenuItem>
                      );
                    case 'add_to_blacklist':
                      return (
                        <PopoverMenuItem key={item.key} disabled={isUserInBlacklist}>
                          <div role="presentation" onClick={this.handleChangeBlacklistClick}>
                            {intl.formatMessage({
                              id: item.id,
                              defaultMessage: item.defaultMessage,
                            })}
                          </div>
                        </PopoverMenuItem>
                      );
                    case 'delete_from_blacklist':
                      return (
                        <PopoverMenuItem key={item.key} disabled={!isUserInBlacklist}>
                          <div role="presentation" onClick={this.handleChangeBlacklistClick}>
                            {intl.formatMessage({
                              id: item.id,
                              defaultMessage: item.defaultMessage,
                            })}
                          </div>
                        </PopoverMenuItem>
                      );
                    case 'open_review':
                      return (
                        <PopoverMenuItem key={item.key} disabled={!reviewPermlink}>
                          {reviewPermlink ? (
                            <Link to={`/@${userName}/${reviewPermlink}`}>
                              {intl.formatMessage({
                                id: item.id,
                                defaultMessage: item.defaultMessage,
                              })}
                            </Link>
                          ) : (
                            <span>
                              {intl.formatMessage({
                                id: item.id,
                                defaultMessage: item.defaultMessage,
                              })}
                            </span>
                          )}
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

  getPropositionStatus = proposition => {
    const { match } = this.props;
    const isReserved = !isEmpty(match)
      ? match.params.filterKey === IS_RESERVED ||
        match.params.filterKey === IS_ALL ||
        includes(match.path, 'object')
      : '';
    if (isReserved) return ASSIGNED;
    return get(proposition, ['users', '0', 'status'], '');
  };

  render() {
    const { intl, numberOfComments, daysLeft, propositionStatus, user, proposition } = this.props;
    const { value, isOpenModalEnterAmount, isLoading } = this.state;
    const isAssigned = get(proposition, ['objects', '0', ASSIGNED]);
    const propositionUserName = get(proposition, ['users', '0', 'name']);
    const reviewPermlink = get(proposition, ['users', '0', 'review_permlink']);
    const propositionUserWeight = get(proposition, ['users', '0', 'wobjects_weight']);
    const status = this.getPropositionStatus(proposition);
    const buttonsTitleForRender = buttonsTitle[status] || buttonsTitle.default;
    const matchParams = [GUIDE_HISTORY, MESSAGES, FRAUD_DETECTION];

    return (
      <div className="Buttons">
        <div className="Buttons__wrap">
          <div className="Buttons__wrap-text">
            {intl.formatMessage({
              id: buttonsTitleForRender.id,
              defaultMessage: buttonsTitleForRender.defaultMessage,
            })}
            {buttonsTitleForRender.defaultMessage === 'Reserved' &&
              ` - ${daysLeft} ${intl.formatMessage({
                id: 'campaign_buttons_days_left',
                defaultMessage: 'days left',
              })} `}
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
        {(isAssigned || status === ASSIGNED) &&
          every(matchParams, item => item !== this.matchParams) && (
            <React.Fragment>
              <Button type="primary" onClick={this.openModalDetails}>
                {intl.formatMessage({
                  id: 'campaign_buttons_write_review',
                  defaultMessage: `Write review`,
                })}
              </Button>
            </React.Fragment>
          )}
        {some(matchParams, item => item === this.matchParams) && (
          <div className="Buttons__avatar">
            <Avatar username={propositionUserName} size={30} />{' '}
            <div role="presentation" className="userName">
              <Link to={`/@${propositionUserName}`}>{propositionUserName}</Link>
            </div>
            <WeightTag weight={propositionUserWeight} />
          </div>
        )}
        {propositionStatus === 'completed' && this.matchParams === HISTORY && (
          <Link to={`/@${user.name}/${reviewPermlink}`}>
            {intl.formatMessage({
              id: 'review',
              defaultMessage: `Review`,
            })}{' '}
            {'>'}
          </Link>
        )}
        <Modal
          visible={isOpenModalEnterAmount}
          onOk={this.handleOkClick}
          onCancel={this.handleCancel}
          style={{ width: '100px' }}
          width={250}
          okButtonProps={{ loading: isLoading }}
        >
          <InputNumber
            placeholder={intl.formatMessage({
              id: 'enter_amount_in_hive',
              defaultMessage: `Enter amount in HIVE`,
            })}
            onChange={this.handleChangeValue}
            value={value}
            min={0}
            step={0.01}
            autoFocus
            onPressEnter={this.handleOkClick}
          />
        </Modal>
      </div>
    );
  }
}

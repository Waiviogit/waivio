import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { slice, get, isEmpty, isEqual, size, map } from 'lodash';
import * as notificationConstants from '../../../../common/constants/notifications';
import { saveNotificationsLastTimestamp } from '../../../../common/helpers/metadata';
import NotificationFollowing from './NotificationFollowing';
import NotificationReply from './NotificationReply';
import NotificationMention from './NotificationMention';
import NotificationReblog from './NotificationReblog';
import NotificationTransfer from './NotificationTransfer';
import NotificationVoteWitness from './NotificationVoteWitness';
import NotificationChangeStatus from './NotificationChangeStatus';
import NotificationPowerDown from './NotificationPowerDown';
import NotificationFillOrder from './NotificationFillOrder';
import Loading from '../../Icon/Loading';
import NotificationRejectUpdate from './NotificationRejectUpdate';
import NotificationActicationCampaign from './NotificationActivationCampaign';
import NotificationSuspandedStatus from './NotificationSuspandedStatus';
import NotificationWithdrawRoute from './NotificationWithdrawRoute';
import NotificationChangePassword from './NotificationChangePassword';
import NotificationTransferFrom from './NotificationTransferFrom';
import NotificationTransferVesting from './NotificationTransferVesting';
import NotificationChangeRecoveryAccount from './NotificationChangeRecoveryAccount';
import NotificationTransferFromSavings from './NotificationTransferFromSavings';
import NotificationClaimReward from './NotificationClaimReward';
import NotificationPostBell from './NotificationPostBell';
import NotificationReblogBell from './NotificationReblogBell';
import NotificationFollowBell from './NotificationFollowBell';
import NotificationCampaignMessage from './NotificationCampaignMessage';
import NotificationLikes from './NotificationLikes';
import NotificationMyLike from './NotificationMyLike';
import NotificationMyComment from './NotificationMyComment';
import NotificationMyPost from './NotificationMyPost';
import NotificationCampaignReservation from './NotificationCampaignReservation';
import NotificationWobjectRewardsBell from './NotificationWobjectRewardsBell';
import NotificationWobjectPostBell from './NotificationWobjectPostBell';
import NotificationWebsiteBalance from './NotificationWebsiteBalance';
import NotificationDeacticationCampaign from '../../../components/Navigation/Notifications/NotificationDeactivationCampaign';
import NotificationDelegateFrom from './NotificationDelegateFrom';
import NotificationDelegateTo from './NotificationDelegateTo';
import NotificationUndelegateFrom from './NotificationUndelegateFrom';
import NotificationUndelegateTo from './NotificationUndelegateTo';
import NotificationDelegateVestingSharesFrom from './NotificationDelegateVestingSharesFrom';
import NotificationDelegateVestingSharesTo from './NotificationDelegateVestingSharesTo';
import NotificationCancelUnstake from './NotificationCancelUnstake';

import './Notification.less';
import './Notifications.less';

const displayLimit = 6;

class Notifications extends React.Component {
  static propTypes = {
    notifications: PropTypes.arrayOf(PropTypes.shape()),
    loadingNotifications: PropTypes.bool,
    lastSeenTimestamp: PropTypes.number,
    currentAuthUsername: PropTypes.string,
    onNotificationClick: PropTypes.func,
    getUpdatedUserMetadata: PropTypes.func,
  };

  static defaultProps = {
    notifications: [],
    loadingNotifications: false,
    lastSeenTimestamp: 0,
    currentAuthUsername: '',
    onNotificationClick: () => {},
    getUpdatedUserMetadata: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      displayedNotifications: slice(props.notifications, 0, displayLimit),
    };

    this.notificationsContent = null;

    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleNotificationsClick = this.handleNotificationsClick.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount() {
    const { notifications, lastSeenTimestamp, currentAuthUsername } = this.props;
    const latestNotification = get(notifications, 0);
    const timestamp = get(latestNotification, 'timestamp');

    if (timestamp > lastSeenTimestamp) {
      saveNotificationsLastTimestamp(timestamp, currentAuthUsername).then(() =>
        this.props.getUpdatedUserMetadata(),
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    const differentNotifications = !isEqual(
      size(this.props.notifications),
      size(nextProps.notifications),
    );
    const emptyDisplayedNotifications = isEmpty(this.state.displayedNotifications);

    if (differentNotifications || emptyDisplayedNotifications) {
      this.setState({
        displayedNotifications: slice(nextProps.notifications, 0, displayLimit),
      });
    } else {
      const latestNotification = get(nextProps.notifications, 0);
      const timestamp = get(latestNotification, 'timestamp');

      if (timestamp > nextProps.lastSeenTimestamp) {
        saveNotificationsLastTimestamp(timestamp, this.props.currentAuthUsername).then(() =>
          this.props.getUpdatedUserMetadata(),
        );
      }
    }
  }

  onScroll() {
    const { notifications } = this.props;
    const { displayedNotifications } = this.state;
    const contentElement = this.notificationsContent;
    const topScrollPos = contentElement.scrollTop;
    const totalContainerHeight = contentElement.scrollHeight;
    const containerFixedHeight = contentElement.offsetHeight;
    const bottomScrollPos = topScrollPos + containerFixedHeight;
    const bottomPosition = totalContainerHeight - bottomScrollPos;
    const threshold = 100;
    const hasMore = displayedNotifications.length !== notifications.length;

    if (bottomPosition < threshold && hasMore) {
      this.handleLoadMore();
    }
  }

  handleLoadMore() {
    const { notifications } = this.props;
    const { displayedNotifications } = this.state;
    const moreNotificationsStartIndex = displayedNotifications.length;
    const moreNotifications = slice(
      notifications,
      moreNotificationsStartIndex,
      moreNotificationsStartIndex + displayLimit,
    );

    this.setState({
      displayedNotifications: displayedNotifications.concat(moreNotifications),
    });
  }

  handleNotificationsClick(e) {
    const openedInNewTab = get(e, 'metaKey', false) || get(e, 'ctrlKey', false);

    if (!openedInNewTab) {
      this.props.onNotificationClick();
    }
  }

  render() {
    const {
      notifications,
      currentAuthUsername,
      lastSeenTimestamp,
      onNotificationClick,
      loadingNotifications,
    } = this.props;
    const { displayedNotifications } = this.state;
    const displayEmptyNotifications = isEmpty(notifications) && !loadingNotifications;

    return (
      <div className="Notifications">
        <div
          className="Notifications__content"
          onScroll={this.onScroll}
          ref={element => {
            this.notificationsContent = element;
          }}
        >
          {loadingNotifications && <Loading style={{ padding: 20 }} />}
          {map(displayedNotifications, (notification, index) => {
            const key = `${index}${notification.timestamp}`;
            const read = lastSeenTimestamp >= notification.timestamp;

            switch (notification.type) {
              case notificationConstants.REPLY:
                return (
                  <NotificationReply
                    key={key}
                    notification={notification}
                    currentAuthUsername={currentAuthUsername}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.FOLLOW:
                return (
                  <NotificationFollowing
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.MENTION:
                return (
                  <NotificationMention
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.REBLOG:
                return (
                  <NotificationReblog
                    key={key}
                    notification={notification}
                    read={read}
                    currentAuthUsername={currentAuthUsername}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.TRANSFER:
                return (
                  <NotificationTransfer
                    key={key}
                    notification={notification}
                    currentAuthUsername={currentAuthUsername}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.WITNESS_VOTE:
                return (
                  <NotificationVoteWitness
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.STATUS_CHANGE:
                return (
                  <NotificationChangeStatus
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.POWER_DOWN:
                return (
                  <NotificationPowerDown
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                    currentAuthUsername={currentAuthUsername}
                  />
                );
              case notificationConstants.FILL_ORDER:
                return (
                  <NotificationFillOrder
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.REJECT_UPDATE:
                return (
                  <NotificationRejectUpdate
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.ACTIVATION_CAMPAIGN:
                return (
                  <NotificationActicationCampaign
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.SUSPENDED_STATUS:
                return (
                  <NotificationSuspandedStatus
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.WITHDRAW_ROUTE:
                return (
                  <NotificationWithdrawRoute
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.CHANGE_PASSWORD:
                return (
                  <NotificationChangePassword
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.TRANSFER_FROM:
                return (
                  <NotificationTransferFrom
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.TRANSFER_TO_VESTING:
                return (
                  <NotificationTransferVesting
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.CHANGE_RECOVERY_ACCOUNT:
                return (
                  <NotificationChangeRecoveryAccount
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.TRANSFER_FROM_SAVINGS:
                return (
                  <NotificationTransferFromSavings
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.CLAIM_REWARD:
                return (
                  <NotificationClaimReward
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.BELL_POST:
                return (
                  <NotificationPostBell
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.BELL_REBLOG:
                return (
                  <NotificationReblogBell
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.BELL_FOLLOW:
                return (
                  <NotificationFollowBell
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.CAMPAIGN_MESSAGE:
                return (
                  <NotificationCampaignMessage
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.LIKE:
                return (
                  <NotificationLikes
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.MY_LIKE:
                return (
                  <NotificationMyLike
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.MY_COMMENT:
                return (
                  <NotificationMyComment
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.MY_POST:
                return (
                  <NotificationMyPost
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.CAMPAIGN_RESERVATION:
                return (
                  <NotificationCampaignReservation
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.BELL_WOBJECT_REWARDS:
                return (
                  <NotificationWobjectRewardsBell
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.BELL_WOBJECT_POST:
                return (
                  <NotificationWobjectPostBell
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.WEBSITE_BALANCE:
                return (
                  <NotificationWebsiteBalance
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                    currentAuthUsername={currentAuthUsername}
                  />
                );
              case notificationConstants.DEACTIVATION_CAMPAIGN:
                return (
                  <NotificationDeacticationCampaign
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.DELEGATE:
                if (notification.to) {
                  return (
                    <NotificationDelegateFrom
                      key={key}
                      notification={notification}
                      read={read}
                      currentAuthUsername={currentAuthUsername}
                    />
                  );
                }

                return (
                  <NotificationDelegateTo
                    key={key}
                    notification={notification}
                    read={read}
                    currentAuthUsername={currentAuthUsername}
                  />
                );
              case notificationConstants.UNDELEGATE:
                if (notification.to) {
                  return (
                    <NotificationUndelegateFrom
                      key={key}
                      notification={notification}
                      read={read}
                      currentAuthUsername={currentAuthUsername}
                    />
                  );
                }

                return (
                  <NotificationUndelegateTo
                    key={key}
                    notification={notification}
                    read={read}
                    currentAuthUsername={currentAuthUsername}
                  />
                );
              case notificationConstants.DELEGATE_VESTING_SHARES:
                if (notification.to) {
                  return (
                    <NotificationDelegateVestingSharesFrom
                      key={key}
                      notification={notification}
                      read={read}
                      currentAuthUsername={currentAuthUsername}
                    />
                  );
                }

                return (
                  <NotificationDelegateVestingSharesTo
                    key={key}
                    notification={notification}
                    read={read}
                    currentAuthUsername={currentAuthUsername}
                  />
                );
              case notificationConstants.CANCEL_UNSTAKE:
                return (
                  <NotificationCancelUnstake
                    key={key}
                    notification={notification}
                    read={read}
                    currentAuthUsername={currentAuthUsername}
                  />
                );
              default:
                return null;
            }
          })}
          {displayEmptyNotifications && (
            <div className="Notification Notification__empty">
              <FormattedMessage
                id="notifications_empty_message"
                defaultMessage="You currently have no notifications."
              />
            </div>
          )}
        </div>
        <div className="Notifications__footer">
          <Link to="/notifications-list" onClick={onNotificationClick}>
            <FormattedMessage id="see_all" defaultMessage="See All" />
          </Link>
        </div>
      </div>
    );
  }
}

export default Notifications;

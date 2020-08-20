import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as notificationConstants from '../../common/constants/notifications';
import { getUserMetadata } from '../user/usersActions';
import { getNotifications } from '../user/userActions';
import {
  getAuthenticatedUserMetaData,
  getNotifications as getNotificationsState,
  getIsLoadingNotifications,
  getAuthenticatedUserName,
} from '../reducers';
import requiresLogin from '../auth/requiresLogin';
import NotificationReply from '../components/Navigation/Notifications/NotificationReply';
import NotificationMention from '../components/Navigation/Notifications/NotificationMention';
import NotificationFollowing from '../components/Navigation/Notifications/NotificationFollowing';
import NotificationVote from '../components/Navigation/Notifications/NotificationVote';
import NotificationReblog from '../components/Navigation/Notifications/NotificationReblog';
import NotificationTransfer from '../components/Navigation/Notifications/NotificationTransfer';
import NotificationVoteWitness from '../components/Navigation/Notifications/NotificationVoteWitness';
import NotificationChangeStatus from '../components/Navigation/Notifications/NotificationChangeStatus';
import NotificationPowerDown from '../components/Navigation/Notifications/NotificationPowerDown';
import NotificationFillOrder from '../components/Navigation/Notifications/NotificationFillOrder';
import Loading from '../components/Icon/Loading';
import NotificationRejectUpdate from '../components/Navigation/Notifications/NotificationRejectUpdate';
import NotificationActicationCampaign from '../components/Navigation/Notifications/NotificationActivationCampaign';
import NotificationSuspandedStatus from '../components/Navigation/Notifications/NotificationSuspandedStatus';
import NotificationWithdrawRoute from '../components/Navigation/Notifications/NotificationWithdrawRoute';
import NotificationChangePassword from '../components/Navigation/Notifications/NotificationChangePassword';
import NotificationTransferFrom from '../components/Navigation/Notifications/NotificationTransferFrom';
import NotificationTransferVesting from '../components/Navigation/Notifications/NotificationTransferVesting';
import NotificationChangeRecoveryAccount from '../components/Navigation/Notifications/NotificationChangeRecoveryAccount';
import NotificationTransferFromSavings from '../components/Navigation/Notifications/NotificationTransferFromSavings';
import NotificationClaimReward from '../components/Navigation/Notifications/NotificationClaimReward';
import NotificationCustomerSupport from '../components/Navigation/Notifications/NotificationCustomerSupport';

import './Notifications.less';

class Notifications extends React.Component {
  static propTypes = {
    loadingNotifications: PropTypes.bool.isRequired,
    getUpdatedUserMetadata: PropTypes.func.isRequired,
    getNotifications: PropTypes.func.isRequired,
    notifications: PropTypes.arrayOf(PropTypes.shape()),
    currentAuthUsername: PropTypes.string,
    userMetaData: PropTypes.shape(),
  };

  static defaultProps = {
    notifications: [],
    currentAuthUsername: '',
    userMetaData: {},
  };

  componentDidMount() {
    const { userMetaData, notifications, currentAuthUsername } = this.props;

    if (_.isEmpty(userMetaData)) {
      this.props.getUpdatedUserMetadata();
    }

    if (_.isEmpty(notifications)) {
      this.props.getNotifications(currentAuthUsername);
    }
  }

  render() {
    const { notifications, currentAuthUsername, userMetaData, loadingNotifications } = this.props;
    const lastSeenTimestamp = _.get(userMetaData, 'notifications_last_timestamp');

    return (
      <div className="NotificationsPage">
        <div className="NotificationsPage__title">
          <h1>
            <FormattedMessage id="notifications" defaultMessage="Notifications" />(
            <a href={'/notification-settings'}>
              <FormattedMessage id="settings_notify" defaultMessage="settings" />
            </a>
            )
          </h1>
        </div>
        <p className="NotificationsPage__paragraph">
          <FormattedMessage
            id="notify_list_message"
            defaultMessage="You can now receive instant mobile notifications via the Telegram app when someone replies
          to or re-blogs your post on Hive, mentions you, follows you, transfers funds to you, and so
          on."
          />
        </p>
        <p className="NotificationsPage__paragraph">
          <FormattedMessage
            id="notify_list_message_telegram"
            defaultMessage="Open the Telegram chart with {link} and enter the Hive usernames
          to subscribes."
            values={{
              link: (
                <a
                  href={'https://web.telegram.org/#/im?p=@WaivioNotificationsBot'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <b>@WaivioNotificationsBot</b>
                </a>
              ),
            }}
          />
        </p>
        <div className="NotificationsPage__content">
          {loadingNotifications && (
            <div className="NotificationsPage__loading">
              <Loading />
            </div>
          )}
          {_.map(notifications, (notification, index) => {
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
                  />
                );
              case notificationConstants.FOLLOW:
                return <NotificationFollowing key={key} notification={notification} read={read} />;
              case notificationConstants.MENTION:
                return <NotificationMention key={key} notification={notification} read={read} />;
              case notificationConstants.VOTE:
                return (
                  <NotificationVote
                    key={key}
                    notification={notification}
                    read={read}
                    currentAuthUsername={currentAuthUsername}
                  />
                );
              case notificationConstants.REBLOG:
                return (
                  <NotificationReblog
                    key={key}
                    notification={notification}
                    read={read}
                    currentAuthUsername={currentAuthUsername}
                  />
                );
              case notificationConstants.TRANSFER:
                return <NotificationTransfer key={key} notification={notification} read={read} />;
              case notificationConstants.WITNESS_VOTE:
                return (
                  <NotificationVoteWitness key={key} notification={notification} read={read} />
                );
              case notificationConstants.STATUS_CHANGE:
                return (
                  <NotificationChangeStatus key={key} notification={notification} read={read} />
                );
              case notificationConstants.POWER_DOWN:
                return (
                  <NotificationPowerDown
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
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
              case notificationConstants.CUSTOMER_SUPPORT:
                return (
                  <NotificationCustomerSupport
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                    currentAuthUsername={currentAuthUsername}
                  />
                );
              default:
                return null;
            }
          })}
          {_.isEmpty(notifications) && !loadingNotifications && (
            <div className="Notification Notification__empty">
              <FormattedMessage
                id="notifications_empty_message"
                defaultMessage="You currently have no notifications."
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    notifications: getNotificationsState(state),
    userMetaData: getAuthenticatedUserMetaData(state),
    currentAuthUsername: getAuthenticatedUserName(state),
    loadingNotifications: getIsLoadingNotifications(state),
  }),
  {
    getUpdatedUserMetadata: getUserMetadata,
    getNotifications,
  },
)(requiresLogin(Notifications));

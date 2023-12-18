import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as notificationConstants from '../../common/constants/notifications';
import { getUserMetadata } from '../../store/usersStore/usersActions';
import { getNotifications } from '../../store/userStore/userActions';
import requiresLogin from '../auth/requiresLogin';
import Loading from '../components/Icon/Loading';
import NotificationTemplate from '../components/Navigation/Notifications/NotificationTemplate';
import {
  getAuthenticatedUserMetaData,
  getAuthenticatedUserName,
} from '../../store/authStore/authSelectors';
import * as userSelectors from '../../store/userStore/userSelectors';
import { getWalletType, isEmptyAmount } from '../../common/helpers/notificationsHelper';
import { parseJSON } from '../../common/helpers/parseJSON';
import { getObjectInfo } from '../../waivioApi/ApiClient';

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
  constructor(props) {
    super(props);

    this.state = {
      objNames: {},
    };
  }

  componentDidMount() {
    const { userMetaData, notifications, currentAuthUsername } = this.props;

    if (!_.isEmpty(notifications)) {
      this.props.notifications.forEach(notification =>
        this.getObjectInfoAsync(notification).then(r =>
          this.setState({ objNames: { ...this.state.objNames, [notification.authorPermlink]: r } }),
        ),
      );
    }
    if (_.isEmpty(userMetaData)) {
      this.props.getUpdatedUserMetadata();
    }

    if (_.isEmpty(notifications)) {
      this.props.getNotifications(currentAuthUsername);
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.notifications !== this.props.notifications) {
      if (!_.isEmpty(this.props.notifications) && _.isEmpty(this.state.objNames)) {
        this.props.notifications.forEach(notification =>
          this.getObjectInfoAsync(notification).then(r =>
            this.setState({
              objNames: { ...this.state.objNames, [notification.authorPermlink]: r },
            }),
          ),
        );
      }
    }
  }

  // eslint-disable-next-line consistent-return
  getObjectInfoAsync = async notif => {
    if (notif.type === notificationConstants.BELL_THREAD) {
      try {
        const result = await getObjectInfo([notif.authorPermlink]);

        return result.wobjects?.[0]?.name || result.wobjects?.[0]?.default_name;
      } catch (error) {
        console.error(error);

        return '';
      }
    }
  };
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
                  href={'https://t.me/WaivioNotificationsBot'}
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
                let id = 'replied_to_your_comment';
                let defaultMessage = '{username} has replied to your comment';

                if (notification.reply) {
                  id = 'notification_reply_username_post';
                  defaultMessage = '{username} commented on your post';
                }

                return (
                  <NotificationTemplate
                    username={notification.author}
                    id={id}
                    defaultMessage={defaultMessage}
                    values={{
                      username: <span className="username">{notification.author}</span>,
                    }}
                    url={`/@${notification.author}/${notification.permlink}`}
                    key={key}
                    notification={notification}
                    currentAuthUsername={currentAuthUsername}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.OBJECT_UPDATES:
                return (
                  <NotificationTemplate
                    url={`/object/${notification.authorPermlink}/updates/${notification.fieldName}`}
                    username={notification.initiator}
                    id="notification_object_update"
                    defaultMessage="{user} added a new {update} for {objectName}"
                    values={{
                      user: <span className="username">{notification.initiator}</span>,
                      update: (
                        <span style={{ textTransform: 'lowercase' }}>
                          {' '}
                          <FormattedMessage
                            id={`object_field_${notification.fieldName}`}
                            defaultMessage={notification.fieldName}
                          />
                        </span>
                      ),
                      objectName: <span className="username">{notification.objectName}</span>,
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.BELL_THREAD:
                return (
                  <NotificationTemplate
                    url={`/object/${notification.authorPermlink}/threads`}
                    username={notification.author}
                    id="notification_object_bell_thread"
                    defaultMessage="{author} published thread to {objectName}"
                    values={{
                      author: <span className="username">{notification.author}</span>,
                      objectName: (
                        <span className="username">
                          {this.state.objNames[notification.authorPermlink]}
                        </span>
                      ),
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.GROUP_ID_UPDATES:
                return (
                  <NotificationTemplate
                    url={`/object/${notification.authorPermlink}/updates/groupId`}
                    username={notification.initiator}
                    id="notification_group_id_update"
                    defaultMessage="{user} used the group ID for {objectName}"
                    values={{
                      user: <span className="username">{notification.initiator}</span>,
                      objectName: <span className="username">{notification.objectName}</span>,
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.GROUP_ID_UPDATES_REJECT:
                return (
                  <NotificationTemplate
                    url={`/object/${notification.authorPermlink}/updates/groupId`}
                    username={notification.initiator}
                    id="notification_group_id_update_reject"
                    defaultMessage="{user} removed the group ID from {objectName}"
                    values={{
                      user: <span className="username">{notification.initiator}</span>,
                      objectName: <span className="username">{notification.objectName}</span>,
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.OBJECT_UPDATES_REJECT:
                return (
                  <NotificationTemplate
                    url={`/object/${notification.authorPermlink}/updates/${notification.fieldName}`}
                    username={notification.initiator}
                    id="notification_object_update_reject"
                    defaultMessage="{user} rejected the {update} for {objectName}"
                    values={{
                      user: <span className="username">{notification.initiator}</span>,
                      update: (
                        <span style={{ textTransform: 'lowercase' }}>
                          {' '}
                          <FormattedMessage
                            id={`object_field_${notification.fieldName}`}
                            defaultMessage={notification.fieldName}
                          />
                        </span>
                      ),
                      objectName: <span className="username">{notification.objectName}</span>,
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.FOLLOW:
                return (
                  <NotificationTemplate
                    url={`/@${notification.follower}`}
                    username={notification.follower}
                    id="notification_following_username"
                    defaultMessage="{username} started following you"
                    values={{
                      username: <span className="username">{notification.follower}</span>,
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.ARBITRAGE:
                return (
                  <NotificationTemplate
                    url={`/@${currentAuthUsername}/transfers?type=rebalancing`}
                    id="rebalance_alert"
                    iconType={'swap'}
                    defaultMessage="Rebalancing alert for {pair}: {differencePercent}% difference"
                    values={{
                      pair: notification.tokenPair.replace('_', ' / ').replace('/', ' / '),
                      differencePercent: notification.differencePercent,
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.MENTION:
                const defaultMentionMessage = notification.is_root_post
                  ? '{username} mentioned you in a post'
                  : '{username} mentioned you in a comment';

                return (
                  <NotificationTemplate
                    url={`/@${notification.author}/${notification.permlink}`}
                    username={notification.author}
                    id="notification_mention_username_post"
                    defaultMessage={defaultMentionMessage}
                    values={{
                      username: <span className="username">{notification.author}</span>,
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.REBLOG:
                return (
                  <NotificationTemplate
                    url={`/@${notification.account}`}
                    username={notification.account}
                    id="notification_reblogged_username_post"
                    defaultMessage="{username} reblogged your post"
                    values={{
                      username: <span className="username">{notification.account}</span>,
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    currentAuthUsername={currentAuthUsername}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.TRANSFER:
                const parseMemo = parseJSON(notification.memo);

                return (
                  <NotificationTemplate
                    url={`/@${currentAuthUsername}/transfers?type=${getWalletType(
                      notification.amount,
                    )}`}
                    id="notification_transfer_username_amount"
                    defaultMessage="{username} transferred {amount} to you"
                    values={{
                      username: (
                        <span className="username">{parseMemo?.from || notification.from}</span>
                      ),
                      amount: notification.amount,
                    }}
                    username={parseMemo?.from || notification.from}
                    key={key}
                    notification={notification}
                    currentAuthUsername={currentAuthUsername}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.DELEGATE:
                if (notification.to) {
                  return (
                    <NotificationTemplate
                      url={`/@${notification.to}/transfers?type=${getWalletType(
                        notification.amount,
                      )}`}
                      username={notification.to}
                      id="notification_delegate_username_amount"
                      defaultMessage="You delegated {amount} to {username}"
                      values={{
                        username: <span className="username">{notification.to}</span>,
                        amount: notification.amount,
                      }}
                      key={key}
                      notification={notification}
                      read={read}
                      currentAuthUsername={currentAuthUsername}
                      onClick={this.handleNotificationsClick}
                    />
                  );
                }

                return (
                  <NotificationTemplate
                    url={`/@${notification.from}/transfers?type=${getWalletType(
                      notification.amount,
                    )}`}
                    username={notification.from}
                    id="notification_delegate_username_amount"
                    defaultMessage="{username} delegated {amount} to you"
                    values={{
                      username: <span className="username">{notification.from}</span>,
                      amount: notification.amount,
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    currentAuthUsername={currentAuthUsername}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.UNDELEGATE:
                if (notification.to) {
                  return (
                    <NotificationTemplate
                      url={`/@${notification.to}/transfers?type=${getWalletType(
                        notification.amount,
                      )}`}
                      username={notification.to}
                      id="notification_undelegation_username_amount"
                      defaultMessage="You started undelegation {amount} to {username}"
                      values={{
                        username: <span className="username">{notification.to}</span>,
                        amount: notification.amount,
                      }}
                      key={key}
                      notification={notification}
                      read={read}
                      currentAuthUsername={currentAuthUsername}
                      onClick={this.handleNotificationsClick}
                    />
                  );
                }

                return (
                  <NotificationTemplate
                    key={key}
                    url={`/@${notification.from}/transfers?type=${getWalletType(
                      notification.amount,
                    )}`}
                    username={notification.from}
                    id="notification_undelegation_username_amount"
                    defaultMessage="{username} started undelegation {amount} to you"
                    values={{
                      username: <span className="username">{notification.from}</span>,
                      amount: notification.amount,
                    }}
                    notification={notification}
                    read={read}
                    currentAuthUsername={currentAuthUsername}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.DELEGATE_VESTING_SHARES:
                if (notification.to) {
                  const delegateDefaultMessage = isEmptyAmount(notification.amount)
                    ? 'You delegated {amount} to {username}'
                    : 'You undelegated to {username}';

                  return (
                    <NotificationTemplate
                      url={`/@${notification.to}/transfers?type=${getWalletType(
                        notification.amount,
                      )}`}
                      username={notification.to}
                      id="delegate_vesting_shares"
                      defaultMessage={delegateDefaultMessage}
                      values={{
                        username: <span className="username">{notification.to}</span>,
                        amount: notification.amount,
                      }}
                      key={key}
                      notification={notification}
                      read={read}
                      currentAuthUsername={currentAuthUsername}
                      onClick={this.handleNotificationsClick}
                    />
                  );
                }

                const defaultMessageTo = isEmptyAmount(notification.amount)
                  ? '{username} delegated {amount} to you'
                  : '{username} undelegated to you';

                return (
                  <NotificationTemplate
                    url={`/@${notification.from}/transfers?type=${getWalletType(
                      notification.amount,
                    )}`}
                    username={notification.from}
                    id="delegate_vesting_shares"
                    values={{
                      username: <span className="username">{notification.from}</span>,
                      amount: notification.amount,
                    }}
                    defaultMessage={defaultMessageTo}
                    key={key}
                    notification={notification}
                    read={read}
                    currentAuthUsername={currentAuthUsername}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.WITNESS_VOTE:
                const witnessId = notification.approve
                  ? 'notification_approved_witness'
                  : 'notification_unapproved_witness';
                const witnessDefaultMessage = notification.approve
                  ? '{username} approved your witness'
                  : '{username} unapproved your witness';

                return (
                  <NotificationTemplate
                    url={`/@${notification.account}`}
                    username={notification.account}
                    id={witnessId}
                    defaultMessage={witnessDefaultMessage}
                    values={{
                      username: <span className="username">{notification.account}</span>,
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.STATUS_CHANGE:
                return (
                  <NotificationTemplate
                    username={notification.author}
                    url={`/object/${notification.author_permlink}/updates/status`}
                    id="status_change"
                    defaultMessage="{username} marked {restaurant} as {status}"
                    values={{
                      username: <span className="username">{notification.author}</span>,
                      restaurant: <span className="object_name">{notification.object_name}</span>,
                      status: <span className="newStatus">{notification.newStatus}</span>,
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.POWER_DOWN:
                return (
                  <NotificationTemplate
                    url={`/@${notification.account}/transfers?type=${getWalletType(
                      notification.amount,
                    )}`}
                    username={notification.account}
                    id="power_down_notification"
                    defaultMessage="{username} initiated 'Power Down' on {amount}"
                    values={{
                      username: <span className="username">{notification.account}</span>,
                      amount: <span>{notification.amount}</span>,
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.FILL_ORDER:
                return (
                  <NotificationTemplate
                    url={`/@${notification.account}/transfers`}
                    username={notification.account}
                    id="fill_order_notification"
                    defaultMessage="You bought {current_pays} and get {open_pays} from {exchanger}"
                    values={{
                      current_pays: <span>{notification.current_pays}</span>,
                      open_pays: <span>{notification.open_pays}</span>,
                      exchanger: <span>{notification.exchanger}</span>,
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.REJECT_UPDATE:
                const parent = notification.parent_permlink && notification.parent_name;

                return (
                  <NotificationTemplate
                    url={`/object/${notification.author_permlink}/updates/${notification.object_name}`}
                    username={notification.voter}
                    id="reject_update"
                    defaultMessage="{voter} rejected your update for '{object_name}'"
                    values={{
                      voter: <span className="username">{notification.voter}</span>,
                      object_name: (
                        <span>
                          {notification.object_name}
                          {parent ? `(${notification.parent_name})` : null}
                        </span>
                      ),
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.ACTIVATION_CAMPAIGN:
                return (
                  <NotificationTemplate
                    id="activation_campaign"
                    defaultMessage="{author} launched a new campaign for {object_name}"
                    values={{
                      author: <span className="username">{notification.author}</span>,
                      object_name: <span>{notification.object_name}</span>,
                    }}
                    username={notification.author}
                    url={`/rewards/${notification.reach}/all/${notification.author_permlink}`}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.SUSPENDED_STATUS:
                return (
                  <NotificationTemplate
                    url={`/@${notification.reviewAuthor}/${notification.reviewPermlink}`}
                    username={notification.sponsor}
                    id="suspended_status"
                    defaultMessage="Warning: in {days} day(s) all {sponsor} campaigns will be suspended because the accounts payable for {reviewAuthor}"
                    values={{
                      days: <span className="username">{notification.days}</span>,
                      sponsor: <span>{notification.sponsor}</span>,
                      reviewAuthor: <span>{notification.reviewAuthor}</span>,
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.WITHDRAW_ROUTE:
                const isReceive = currentAuthUsername === notification.from_account;
                const urlToWithdrawRoute = `/@${notification.to_account}`;
                const urlFromWithdrawRoute = isReceive
                  ? `/@${notification.to_account}/transfers?type=HIVE`
                  : `/@${notification.from_account}/transfers?type=HIVE`;
                const isCountedPercent = notification.percent === 0;
                const isSetId = !isReceive ? 'withdraw_route_from' : 'withdraw_route_to';
                const isCanceledId =
                  isCountedPercent && currentAuthUsername === notification.from_account
                    ? 'withdraw_vesting_route_is_canceled_to'
                    : 'withdraw_vesting_route_is_canceled_from';

                return (
                  <NotificationTemplate
                    username={notification.from_account}
                    url={urlFromWithdrawRoute}
                    id={isCountedPercent ? isCanceledId : isSetId}
                    values={{
                      to_account: (
                        <Link to={urlToWithdrawRoute}>
                          <span className="username">{notification.to_account}</span>
                        </Link>
                      ),
                      from_account: (
                        <Link to={urlFromWithdrawRoute}>
                          <span className="username">{notification.from_account}</span>
                        </Link>
                      ),
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.CHANGE_PASSWORD:
                return (
                  <NotificationTemplate
                    url={`/@${notification.account}`}
                    username={notification.account}
                    id="change_password"
                    defaultMessage="Account {account} initiated a password change procedure"
                    values={{
                      account: <span className="username">{notification.account}</span>,
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.TRANSFER_FROM:
                return (
                  <NotificationTemplate
                    url={`/@${notification.to}/transfers?type=${getWalletType(
                      notification.amount,
                    )}`}
                    username={notification.to}
                    id="transfer_from"
                    defaultMessage="You transferred {amount} to {to}"
                    values={{
                      to: <span className="username">{notification.to}</span>,
                      amount: notification.amount,
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.TRANSFER_TO_VESTING:
                let transferringId;
                let transferringDefaultMessage;
                const transferringValues = {
                  from: <span className="username">{notification.from}</span>,
                  to: <span className="username">{notification.to}</span>,
                  amount: <span>{notification.amount}</span>,
                };

                if (notification.to === currentAuthUsername) {
                  transferringId = 'power_up_initiated_from';
                  transferringDefaultMessage = "{from} initiated 'Power up' on {amount} to you";
                }
                if (notification.from === currentAuthUsername) {
                  transferringId = 'power_up_initiated_to';
                  transferringDefaultMessage = "You initiated 'Power up' on {amount} to {to}";
                }
                if (notification.from === notification.to) {
                  transferringId = 'power_up_initiated';
                  transferringDefaultMessage = "You initiated 'Power up' on {amount}";
                }
                const userAccount =
                  notification.to === currentAuthUsername ? notification.from : notification.to;

                return (
                  <NotificationTemplate
                    url={`/@${userAccount}/transfers?type=${getWalletType(notification.amount)}`}
                    username={userAccount}
                    id={transferringId}
                    defaultMessage={transferringDefaultMessage}
                    values={transferringValues}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.CHANGE_RECOVERY_ACCOUNT:
                return (
                  <NotificationTemplate
                    url={`/@${notification.new_recovery_account}`}
                    username={notification.account_to_recover}
                    id="change_password"
                    defaultMessage="Account {account} initiated a password change procedure"
                    values={{
                      account_to_recover: (
                        <span className="username">{notification.account_to_recover}</span>
                      ),
                      new_recovery_account: (
                        <span className="username">{notification.new_recovery_account}</span>
                      ),
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.TRANSFER_FROM_SAVINGS:
                return (
                  <NotificationTemplate
                    url={`/@${notification.from}/transfers/`}
                    username={notification.from}
                    id="transfer_from_savings"
                    defaultMessage="Account {from} initiated a power down on the saving account to {to}"
                    values={{
                      from: <span className="username">{notification.from}</span>,
                      to: <span className="username">{notification.to}</span>,
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.CLAIM_REWARD:
                return (
                  <NotificationTemplate
                    id="claim_reward_notify"
                    defaultMessage="You claim reward {rewardHIVE}, {rewardHBD}, {rewardHP}"
                    values={{
                      account: <span className="username">{notification.account}</span>,
                      rewardHIVE: <span>{notification.rewardHive}</span>,
                      rewardHP: <span>{notification.rewardHP}</span>,
                      rewardHBD: <span>{notification.rewardHBD}</span>,
                    }}
                    username={notification.account}
                    url={`/@${notification.account}/transfers?type=HIVE`}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.CAMPAIGN_MESSAGE:
                const url = notification.notSponsor
                  ? `/rewards/messages?reservationPermlink=${notification.parent_permlink}`
                  : `/rewards/history?reservationPermlink=${notification.parent_permlink}&guideNames=${notification.author}`;

                return notification.notSponsor ? (
                  <NotificationTemplate
                    username={notification.author}
                    url={url}
                    id="customer_support"
                    defaultMessage="{author} asked about {campaignName}"
                    values={{
                      author: <span className="username">{notification.author}</span>,
                      campaignName: (
                        <span>
                          {notification.campaignName || (
                            <FormattedMessage id="notify_campaign" defaultMessage="campaign" />
                          )}
                        </span>
                      ),
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                ) : (
                  <NotificationTemplate
                    username={notification.author}
                    url={url}
                    id="campaign_message_reply"
                    defaultMessage="{author} replied on your comment"
                    values={{
                      author: <span className="username">{notification.author}</span>,
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.LIKE:
                const likeId = !notification.likesCount
                  ? 'like_post_notify_priority'
                  : 'like_post_notify_other';
                const likeDefaultMessage = !notification.likesCount
                  ? "{voter} liked your post '{postTitle}'"
                  : "{voter} and {likesCount} others liked your post '{postTitle}'";
                const likeValues = !notification.likesCount
                  ? {
                      voter: <span className="username">{notification.voter}</span>,
                      postTitle: <span>{notification.title}</span>,
                    }
                  : {
                      voter: <span className="username">{notification.voter}</span>,
                      likesCount: <span>{notification.likesCount}</span>,
                      postTitle: <span>{notification.title}</span>,
                    };

                return (
                  <NotificationTemplate
                    url={`/@${notification.author}/${notification.permlink}`}
                    username={notification.voter}
                    id={likeId}
                    defaultMessage={likeDefaultMessage}
                    values={likeValues}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.MY_LIKE:
                return (
                  <NotificationTemplate
                    url={`/@${notification.author}/${notification.permlink}`}
                    username={notification.author}
                    id="my_like_notify"
                    defaultMessage="You liked {post}"
                    values={{
                      post: <span>{notification.title}</span>,
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.MY_COMMENT:
                return (
                  <NotificationTemplate
                    url={`/@${notification.author}/${notification.permlink}`}
                    username={notification.author}
                    id="my_comment_notify"
                    defaultMessage="You replied to {parentAuthor}"
                    values={{
                      parentAuthor: <span>{notification.parentAuthor}</span>,
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.MY_POST:
                return (
                  <NotificationTemplate
                    url={`/@${notification.author}/${notification.permlink}`}
                    username={notification.author}
                    id="my_post_notify"
                    defaultMessage="You created post {post}"
                    values={{
                      post: <span>{notification.title}</span>,
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.BELL_POST:
                return (
                  <NotificationTemplate
                    url={`/@${notification.author}/${notification.permlink}`}
                    id="notification_bell_post"
                    username={notification.author}
                    defaultMessage="New post by {username}: {title}"
                    values={{
                      username: <span className="username">{notification.author}</span>,
                      title: <span className="username">{notification.title}</span>,
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.BELL_REBLOG:
                return (
                  <NotificationTemplate
                    url={`/@${notification.account}`}
                    username={notification.account}
                    id="notification_bell_reblog"
                    defaultMessage="{account} re-blogged {author}'s post: {title}"
                    values={{
                      account: <span className="username">{notification.account}</span>,
                      author: <span className="username">{notification.author}</span>,
                      title: <span>{notification.title}</span>,
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.BELL_FOLLOW:
                return (
                  <NotificationTemplate
                    username={notification.follower}
                    url={`/@${notification.following}`}
                    id="notification_bell_follow"
                    defaultMessage="{follower} followed {following}"
                    values={{
                      follower: <span className="username">{notification.follower}</span>,
                      following: <span className="username">{notification.following}</span>,
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.CAMPAIGN_RESERVATION:
                const currentFilter = notification.isReleased
                  ? 'released=Released'
                  : 'reserved=Reserved';
                const campaignUrl = `/rewards/guideHistory?campaign=${notification.campaignName}&${currentFilter}`;

                return notification.isReleased ? (
                  <NotificationTemplate
                    url={campaignUrl}
                    username={notification.author}
                    id="notification_campaign_released_reservation"
                    defaultMessage="{author} released a reservation for {campaignName}"
                    values={{
                      author: <span className="username">{notification.author}</span>,
                      campaignName: <span>{notification.campaignName}</span>,
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                ) : (
                  <NotificationTemplate
                    url={campaignUrl}
                    username={notification.author}
                    id="notification_campaign_reserved_reservation"
                    defaultMessage="{author} made a reservation for {campaignName}"
                    values={{
                      author: <span className="username">{notification.author}</span>,
                      campaignName: <span>{notification.campaignName}</span>,
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.BELL_WOBJECT_REWARDS:
                return (
                  <NotificationTemplate
                    url={`/rewards/${notification.reach}/all/${notification.primaryObject}`}
                    username={notification.guideName}
                    id="notification_bell_object_rewards"
                    defaultMessage="{guideName} launched a reward campaign for {objectName}"
                    values={{
                      guideName: <span className="username">{notification.guideName}</span>,
                      objectName: <span className="username">{notification.objectName}</span>,
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.BELL_WOBJECT_POST:
                return (
                  <NotificationTemplate
                    url={`/object/${notification.wobjectPermlink}`}
                    username={notification.author}
                    id="notification_bell_object_post"
                    defaultMessage="{author} referenced {wobjectName}"
                    values={{
                      author: <span className="username">{notification.author}</span>,
                      wobjectName: <span className="username">{notification.wobjectName}</span>,
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );

              case notificationConstants.DEACTIVATION_CAMPAIGN:
                return (
                  <NotificationTemplate
                    url={`/object/${notification.author_permlink}`}
                    username={notification.author}
                    id="deactivation_campaign"
                    defaultMessage="{author} has deactivated the campaign for {object_name}"
                    values={{
                      author: <span className="username">{notification.author}</span>,
                      object_name: <span>{notification.object_name}</span>,
                    }}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                  />
                );
              case notificationConstants.WEBSITE_BALANCE:
                return (
                  <NotificationTemplate
                    url={'/manage'}
                    key={key}
                    notification={notification}
                    read={read}
                    onClick={this.handleNotificationsClick}
                    username={currentAuthUsername}
                    id={notification.message}
                    defaultMessage={notification.message}
                  />
                );
              case notificationConstants.CANCEL_UNSTAKE:
                return (
                  <NotificationTemplate
                    url={`/@${notification.account}/transfers?type=${getWalletType(
                      notification.amount,
                    )}`}
                    username={notification.account}
                    id="notification_unstake_username_amount"
                    defaultMessage="{username} cancelled power down on {amount}"
                    values={{
                      username:
                        notification.account !== currentAuthUsername ? (
                          <span className="username">{notification.account}</span>
                        ) : (
                          <span>You</span>
                        ),
                      amount: notification.amount,
                    }}
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
    notifications: userSelectors.getNotifications(state),
    userMetaData: getAuthenticatedUserMetaData(state),
    currentAuthUsername: getAuthenticatedUserName(state),
    loadingNotifications: userSelectors.getIsLoadingNotifications(state),
  }),
  {
    getUpdatedUserMetadata: getUserMetadata,
    getNotifications,
  },
)(requiresLogin(Notifications));

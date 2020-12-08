import * as notificationConstants from '../../common/constants/notifications';

export const getNotificationsMessage = (notification, intl, displayUsername) => {
  switch (notification.type) {
    case notificationConstants.REPLY:
      return intl.formatMessage(
        {
          id: 'notification_reply_username_post',
          defaultMessage: '{username} commented on your post',
        },
        { username: displayUsername ? notification.author : '' },
      );
    case notificationConstants.FOLLOW:
      return intl.formatMessage(
        {
          id: 'notification_following_username',
          defaultMessage: '{username} started following you',
        },
        { username: displayUsername ? notification.follower : '' },
      );
    case notificationConstants.MENTION:
      return notification.is_root_post
        ? intl.formatMessage(
            {
              id: 'notification_mention_username_post',
              defaultMessage: '{username} mentioned you in a post',
            },
            { username: displayUsername ? notification.author : '' },
          )
        : intl.formatMessage(
            {
              id: 'notification_mention_username_post',
              defaultMessage: '{username} mentioned you in a comment',
            },
            { username: displayUsername ? notification.author : '' },
          );
    case notificationConstants.REBLOG:
      return intl.formatMessage(
        {
          id: 'notification_reblogged_username_post',
          defaultMessage: '{username} reblogged your post',
        },
        { username: displayUsername ? notification.account : '' },
      );
    case notificationConstants.TRANSFER:
      return intl.formatMessage(
        {
          id: 'notification_transfer_username_amount',
          defaultMessage: '{username} transferred {amount} to you',
        },
        {
          username: displayUsername ? notification.from : '',
          amount: notification.amount,
        },
      );
    case notificationConstants.WITNESS_VOTE:
      return notification.approve
        ? intl.formatMessage(
            {
              id: 'notification_approved_witness',
              defaultMessage: '{username} approved your witness',
            },
            { username: displayUsername ? notification.account : '' },
          )
        : intl.formatMessage(
            {
              id: 'notification_unapproved_witness',
              defaultMessage: '{username} unapproved your witness',
            },
            { username: displayUsername ? notification.account : '' },
          );
    case notificationConstants.STATUS_CHANGE:
      return intl.formatMessage(
        {
          id: 'status_change',
          defaultMessage: '{username} marked {restaurant} as {status}',
        },
        {
          username: notification.author,
          restaurant: notification.object_name,
          status: notification.newStatus,
        },
      );
    case notificationConstants.POWER_DOWN:
      return intl.formatMessage(
        {
          id: 'power_down_notification',
          defaultMessage: "{username} initiated 'Power Down' on {amount}",
        },
        {
          username: notification.account,
          amount: notification.amount,
        },
      );
    case notificationConstants.FILL_ORDER:
      return intl.formatMessage(
        {
          id: 'fill_order_notification',
          defaultMessage: 'You sold {current_pays} and bought {open_pays} from {exchanger}',
        },
        {
          current_pays: notification.current_pays,
          open_pays: notification.open_pays,
          exchanger: notification.exchanger,
        },
      );
    case notificationConstants.REJECT_UPDATE:
      return intl.formatMessage(
        {
          id: 'reject_update',
          defaultMessage: 'Your update to {object_name} was rejected',
        },
        {
          voter: notification.voter,
          object_name: notification.object_name,
        },
      );
    case notificationConstants.ACTIVATION_CAMPAIGN:
      return intl.formatMessage(
        {
          id: 'activation_campaign',
          defaultMessage: '{author} launched a new campaign for {object_name}',
        },
        {
          author: notification.author,
          object_name: notification.object_name,
        },
      );
    case notificationConstants.SUSPENDED_STATUS:
      return intl.formatMessage(
        {
          id: 'suspended_status',
          defaultMessage:
            'Warning: in {days} day(s) all {sponsor} campaigns will be suspended because the accounts payable for {reviewAuthor}',
        },
        {
          days: notification.days,
          sponsor: notification.sponsor,
          reviewAuthor: notification.reviewAuthor,
        },
      );
    case notificationConstants.WITHDRAW_ROUTE:
      return intl.formatMessage(
        {
          id: 'withdraw_route',
          defaultMessage:
            'Account {to_account} registered withdraw route for {from_account} account',
        },
        {
          to_account: notification.to_account,
          from_account: notification.from_account,
        },
      );
    case notificationConstants.CHANGE_PASSWORD:
      return intl.formatMessage(
        {
          id: 'change_password',
          defaultMessage: 'Account {account} initiated a password change procedure',
        },
        {
          account: notification.account,
        },
      );
    case notificationConstants.TRANSFER_FROM:
      return intl.formatMessage(
        {
          id: 'transfer_from',
          defaultMessage: 'You transferred {amount} to {to}',
        },
        {
          amount: notification.amount,
          to: notification.to,
        },
      );
    case notificationConstants.TRANSFER_TO_VESTING:
      return intl.formatMessage(
        {
          id: 'transfer_to_vesting',
          defaultMessage: '{from} sent to {to} {amount}',
        },
        {
          from: notification.from,
          to: notification.to,
          amount: notification.amount,
        },
      );
    case notificationConstants.CHANGE_RECOVERY_ACCOUNT:
      return intl.formatMessage(
        {
          id: 'change_recovery_account',
          defaultMessage:
            '{account_to_recover} initiated change recovery account on {new_recovery_account}',
        },
        {
          account_to_recover: notification.account_to_recover,
          new_recovery_account: notification.new_recovery_account,
        },
      );
    case notificationConstants.TRANSFER_FROM_SAVINGS:
      return intl.formatMessage(
        {
          id: 'transfer_from_savings',
          defaultMessage: 'Account {from} initiated a power down on the saving account to {to}',
        },
        {
          from: notification.from,
          to: notification.to,
        },
      );
    case notificationConstants.CLAIM_REWARD:
      return intl.formatMessage(
        {
          id: 'claim_reward_notify',
          defaultMessage: '{account} claim reward {rewardHBD}',
        },
        {
          account: notification.account,
          rewardHBD: notification.rewardHBD,
        },
      );
    case notificationConstants.CAMPAIGN_MESSAGE:
      return intl.formatMessage(
        {
          id: 'customer_support',
          defaultMessage: '{author} asked about {campaignName}',
        },
        {
          author: notification.author,
          campaignName: notification.campaignName,
        },
      );
    case notificationConstants.LIKE:
      return intl.formatMessage(
        {
          id: 'like_post_notify_priority',
          defaultMessage: "{voter} liked your post '{postTitle}'",
        },
        {
          voter: notification.voter,
          postTitle: notification.postTitle,
        },
      );
    case notificationConstants.MY_LIKE:
      return intl.formatMessage(
        {
          id: 'my_like_notify',
          defaultMessage: 'You liked {post}',
        },
        {
          post: notification.title,
        },
      );
    case notificationConstants.MY_COMMENT:
      return intl.formatMessage(
        {
          id: 'my_comment_notify',
          defaultMessage: 'You replied to {parentAuthor}',
        },
        {
          parentAuthor: notification.parentAuthor,
        },
      );
    case notificationConstants.MY_POST:
      return intl.formatMessage(
        {
          id: 'my_post_notify',
          defaultMessage: 'You created post {post}',
        },
        {
          post: notification.title,
        },
      );
    case notificationConstants.CAMPAIGN_RESERVATION:
      if (notification.isReleased) {
        return intl.formatMessage(
          {
            id: 'notification_campaign_released_reservation',
            defaultMessage: '{author} released a reservation for {campaignName}',
          },
          {
            author: notification.author,
            campaignName: notification.campaignName,
          },
        );
      }
      return intl.formatMessage(
        {
          id: 'notification_campaign_reserved_reservation',
          defaultMessage: '{author} made a reservation for {campaignName}',
        },
        {
          author: notification.author,
          campaignName: notification.campaignName,
        },
      );
    default:
      return intl.formatMessage({
        id: 'notification_generic_default_message',
        defaultMessage: 'You have a new notification',
      });
  }
};

export const getNotificationsLink = (notification, currentAuthUsername) => {
  switch (notification.type) {
    case notificationConstants.REPLY:
      return `/@${currentAuthUsername}/${notification.parent_permlink}/#@${notification.author}/${notification.permlink}`;
    case notificationConstants.FOLLOW:
      return `/@${notification.follower}`;
    case notificationConstants.MENTION:
      return `/@${notification.author}/${notification.permlink}`;
    case notificationConstants.REBLOG:
      return `/@${currentAuthUsername}/${notification.permlink}`;
    case notificationConstants.TRANSFER:
      return `/@${notification.account}/transfers`;
    case notificationConstants.WITNESS_VOTE:
      return `/@${notification.account}`;
    case notificationConstants.STATUS_CHANGE:
      return `/object/${notification.author_permlink}/updates/status`;
    case notificationConstants.POWER_DOWN:
      return `/@${notification.account}/transfers`;
    case notificationConstants.FILL_ORDER:
      return `/@${notification.account}/transfers`;
    case notificationConstants.REJECT_UPDATE:
      return `/object/${notification.author_permlink}/updates/${notification.object_name}`;
    case notificationConstants.ACTIVATION_CAMPAIGN:
      return `/rewards/all/${notification.author_permlink}`;
    case notificationConstants.SUSPENDED_STATUS:
      return `/@${notification.reviewAuthor}/${notification.reviewPermlink}`;
    case notificationConstants.WITHDRAW_ROUTE:
      return `/@${notification.from_account}`;
    case notificationConstants.CHANGE_PASSWORD:
      return `/@${notification.account}`;
    case notificationConstants.TRANSFER_FROM:
      return `/@${notification.to}/transfers`;
    case notificationConstants.TRANSFER_TO_VESTING:
      return `/@${notification.from}/transfers`;
    case notificationConstants.CHANGE_RECOVERY_ACCOUNT:
      return `/@${notification.new_recovery_account}`;
    case notificationConstants.TRANSFER_FROM_SAVINGS:
      return `/@${notification.from}/transfers`;
    case notificationConstants.CLAIM_REWARD:
      return `/@${notification.account}`;
    case notificationConstants.CAMPAIGN_MESSAGE:
      return `/@${notification.author}/${notification.permlink}`;
    case notificationConstants.LIKE:
      return `/@${notification.author}/${notification.permlink}`;
    case notificationConstants.MY_LIKE:
      return `/@${notification.author}/${notification.permlink}`;
    case notificationConstants.MY_COMMENT:
      return `/@${notification.author}/${notification.permlink}`;
    case notificationConstants.MY_POST:
      return `/@${notification.author}/${notification.permlink}`;
    default:
      return '/notifications-list';
  }
};

export const getNotificationsAvatar = (notification, currentAuthUsername) => {
  switch (notification.type) {
    case notificationConstants.REPLY:
      return notification.author;
    case notificationConstants.FOLLOW:
      return notification.follower;
    case notificationConstants.MENTION:
      return notification.author;
    case notificationConstants.TRANSFER:
      return notification.from;
    case notificationConstants.REBLOG:
    case notificationConstants.WITNESS_VOTE:
      return notification.account;
    case notificationConstants.STATUS_CHANGE:
      return notification.author;
    case notificationConstants.POWER_DOWN:
      return notification.account;
    case notificationConstants.FILL_ORDER:
      return notification.account;
    case notificationConstants.REJECT_UPDATE:
      return notification.voter;
    case notificationConstants.ACTIVATION_CAMPAIGN:
      return notification.author;
    case notificationConstants.SUSPENDED_STATUS:
      return notification.sponsor;
    case notificationConstants.WITHDRAW_ROUTE:
      return notification.from_account;
    case notificationConstants.CHANGE_PASSWORD:
      return notification.account;
    case notificationConstants.TRANSFER_FROM:
      return notification.to;
    case notificationConstants.TRANSFER_TO_VESTING:
      return notification.from;
    case notificationConstants.CHANGE_RECOVERY_ACCOUNT:
      return notification.account_to_recover;
    case notificationConstants.TRANSFER_FROM_SAVINGS:
      return notification.from;
    case notificationConstants.CLAIM_REWARD:
      return notification.account;
    case notificationConstants.CAMPAIGN_MESSAGE:
      return notification.author;
    case notificationConstants.LIKE:
      return notification.voter;
    case notificationConstants.MY_LIKE:
      return notification.author;
    case notificationConstants.MY_COMMENT:
      return notification.author;
    case notificationConstants.MY_POST:
      return notification.author;
    case notificationConstants.CAMPAIGN_RESERVATION:
      return notification.author;
    default:
      return currentAuthUsername;
  }
};

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
    case notificationConstants.VOTE: {
      let message = intl.formatMessage(
        {
          id: 'notification_unvoted_username_post',
          defaultMessage: '{username} unvoted your post',
        },
        {
          username: displayUsername ? notification.voter : '',
        },
      );

      if (notification.weight > 0) {
        message = intl.formatMessage(
          {
            id: 'notification_upvoted_username_post',
            defaultMessage: '{username} upvoted your post',
          },
          { username: displayUsername ? notification.voter : '' },
        );
      } else if (notification.weight < 0) {
        message = intl.formatMessage(
          {
            id: 'notification_downvoted_username_post',
            defaultMessage: '{username} downvoted your post',
          },
          { username: displayUsername ? notification.voter : '' },
        );
      }

      return message;
    }
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
          defaultMessage: '{username} transfered {amount} to you',
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
            'After {days} day(s) {sponsor} campaigns will be blocked, please pay the debt for the review',
        },
        {
          days: notification.days,
          sponsor: notification.sponsor,
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
    case notificationConstants.VOTE:
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
    case notificationConstants.VOTE:
      return notification.voter;
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
    default:
      return currentAuthUsername;
  }
};

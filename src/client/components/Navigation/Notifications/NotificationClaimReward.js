import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { epochToUTC } from '../../../../common/helpers/formatter';
import Avatar from '../../Avatar';
import './Notification.less';

const NotificationClaimReward = ({ notification, read, onClick }) => {
  const url = `/@${notification.account}/transfers`;

  return (
    <Link
      to={url}
      onClick={onClick}
      className={classNames('Notification', {
        'Notification--unread': !read,
      })}
    >
      <Avatar username={notification.account} size={40} />
      <div className="Notification__text">
        <div className="Notification__text__message">
          <FormattedMessage
            id="claim_reward_notify"
            defaultMessage="You claim reward {rewardHIVE}, {rewardHBD}, {rewardHP}"
            values={{
              account: <span className="username">{notification.account}</span>,
              rewardHIVE: <span>{notification.rewardHive}</span>,
              rewardHP: <span>{notification.rewardHP}</span>,
              rewardHBD: <span>{notification.rewardHBD}</span>,
            }}
          />
        </div>
        <div className="Notification__text__date">
          <FormattedRelative value={epochToUTC(notification.timestamp)} />
        </div>
      </div>
    </Link>
  );
};

NotificationClaimReward.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    account: PropTypes.string,
    rewardHive: PropTypes.string,
    rewardHP: PropTypes.string,
    rewardHBD: PropTypes.string,
    timestamp: PropTypes.number,
  }),
  onClick: PropTypes.func,
};

NotificationClaimReward.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
};

export default NotificationClaimReward;

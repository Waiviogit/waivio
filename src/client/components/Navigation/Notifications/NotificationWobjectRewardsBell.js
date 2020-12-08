import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import Avatar from '../../Avatar';
import { epochToUTC } from '../../../helpers/formatter';
import './Notification.less';

const NotificationWobjectRewardsBell = ({ notification, read, onClick }) => (
  <Link
    to={`/rewards/all/${notification.primaryObject}`}
    className={classNames('Notification', {
      'Notification--unread': !read,
    })}
    onClick={onClick}
  >
    <Avatar username={notification.guideName} size={40} />
    <div className="Notification__text">
      <div className="Notification__text__message">
        <FormattedMessage
          id="notification_bell_object_rewards"
          defaultMessage="{guideName} launched a reward campaign for {objectName}"
          values={{
            guideName: <span className="username">{notification.guideName}</span>,
            objectName: <span className="username">{notification.objectName}</span>,
          }}
        />
      </div>
      <div className="Notification__text__date">
        <FormattedRelative value={epochToUTC(notification.timestamp)} />
      </div>
    </div>
  </Link>
);

NotificationWobjectRewardsBell.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    primaryObject: PropTypes.string,
    guideName: PropTypes.string,
    objectName: PropTypes.string,
    timestamp: PropTypes.number,
  }),
  onClick: PropTypes.func,
};

NotificationWobjectRewardsBell.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
};

export default NotificationWobjectRewardsBell;

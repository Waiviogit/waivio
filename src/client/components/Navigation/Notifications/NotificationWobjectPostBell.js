import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import Avatar from '../../Avatar';
import { epochToUTC } from '../../../../common/helpers/formatter';
import './Notification.less';

const NotificationWobjectPostBell = ({ notification, read, onClick }) => (
  <Link
    to={`/object/${notification.wobjectPermlink}`}
    className={classNames('Notification', {
      'Notification--unread': !read,
    })}
    onClick={onClick}
  >
    <Avatar username={notification.author} size={40} />
    <div className="Notification__text">
      <div className="Notification__text__message">
        <FormattedMessage
          id="notification_bell_object_post"
          defaultMessage="{author} referenced {wobjectName}"
          values={{
            author: <span className="username">{notification.author}</span>,
            wobjectName: <span className="username">{notification.wobjectName}</span>,
          }}
        />
      </div>
      <div className="Notification__text__date">
        <FormattedRelative value={epochToUTC(notification.timestamp)} />
      </div>
    </div>
  </Link>
);

NotificationWobjectPostBell.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    wobjectPermlink: PropTypes.string,
    author: PropTypes.string,
    wobjectName: PropTypes.string,
    timestamp: PropTypes.number,
  }),
  onClick: PropTypes.func,
};

NotificationWobjectPostBell.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
};

export default NotificationWobjectPostBell;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedRelative, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import Avatar from '../../Avatar';
import { epochToUTC } from '../../../../common/helpers/formatter';
import './Notification.less';

const NotificationWebsiteBalance = ({ notification, read, onClick, currentAuthUsername }) => (
  <Link
    to="/manage"
    className={classNames('Notification', {
      'Notification--unread': !read,
    })}
    onClick={onClick}
  >
    <Avatar username={currentAuthUsername} size={40} />
    <div className="Notification__text">
      <FormattedMessage id={notification.message} defaultMessage={notification.message} />
      <div className="Notification__text__date">
        <FormattedRelative value={epochToUTC(notification.timestamp)} />
      </div>
    </div>
  </Link>
);

NotificationWebsiteBalance.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    message: PropTypes.string,
    timestamp: PropTypes.number,
  }),
  onClick: PropTypes.func,
  currentAuthUsername: PropTypes.string,
};

NotificationWebsiteBalance.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
  currentAuthUsername: '',
};

export default NotificationWebsiteBalance;

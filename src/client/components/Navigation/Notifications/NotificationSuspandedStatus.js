import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { epochToUTC } from '../../../helpers/formatter';
import Avatar from '../../Avatar';
import './Notification.less';

const NotificationSuspandedStatus = ({ notification, read, onClick }) => {
  const url = `/@${notification.reviewAuthor}/${notification.reviewPermlink}`;

  return (
    <Link
      to={url}
      onClick={onClick}
      className={classNames('Notification', {
        'Notification--unread': !read,
      })}
    >
      <Avatar username={notification.sponsor} size={40} />
      <div className="Notification__text">
        <div className="Notification__text__message">
          <FormattedMessage
            id="suspended_status"
            defaultMessage="After {days} day(s) {sponsor} campaigns will be blocked, please pay the debt for the review"
            values={{
              days: <span className="username">{notification.days}</span>,
              sponsor: <span>{notification.sponsor}</span>,
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

NotificationSuspandedStatus.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    reviewAuthor: PropTypes.string,
    sponsor: PropTypes.string,
    timestamp: PropTypes.number,
    reviewPermlink: PropTypes.string,
    days: PropTypes.number,
  }),
  onClick: PropTypes.func,
};

NotificationSuspandedStatus.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
};

export default NotificationSuspandedStatus;

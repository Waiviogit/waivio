import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { epochToUTC } from '../../../helpers/formatter';
import Avatar from '../../Avatar';
import './Notification.less';

const NotificationCustomerSupport = ({ notification, read, onClick, currentAuthUsername }) => (
  <Link
    to={`/@${currentAuthUsername}/${notification.permlink}`}
    onClick={onClick}
    className={classNames('Notification', {
      'Notification--unread': !read,
    })}
  >
    <Avatar username={notification.author} size={40} />
    <div className="Notification__text">
      <div className="Notification__text__message">
        <FormattedMessage
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
        />
      </div>
      <div className="Notification__text__date">
        <FormattedRelative value={epochToUTC(notification.timestamp)} />
      </div>
    </div>
  </Link>
);

NotificationCustomerSupport.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    author: PropTypes.string,
    campaignName: PropTypes.string,
    permlink: PropTypes.string,
    timestamp: PropTypes.number,
  }),
  onClick: PropTypes.func,
  currentAuthUsername: PropTypes.string,
};

NotificationCustomerSupport.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
  currentAuthUsername: '',
};

export default NotificationCustomerSupport;

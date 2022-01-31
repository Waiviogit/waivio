import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { epochToUTC } from '../../../../common/helpers/formatter';
import Avatar from '../../Avatar';
import './Notification.less';

const NotificationFillOrder = ({ notification, read, onClick }) => {
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
            id="fill_order_notification"
            defaultMessage="You bought {current_pays} and get {open_pays} from {exchanger}"
            values={{
              current_pays: <span>{notification.current_pays}</span>,
              open_pays: <span>{notification.open_pays}</span>,
              exchanger: <span>{notification.exchanger}</span>,
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

NotificationFillOrder.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    account: PropTypes.string,
    current_pays: PropTypes.number,
    open_pays: PropTypes.string,
    exchanger: PropTypes.string,
    timestamp: PropTypes.number,
  }),
  onClick: PropTypes.func,
};

NotificationFillOrder.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
};

export default NotificationFillOrder;

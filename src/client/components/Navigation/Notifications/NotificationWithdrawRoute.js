import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { epochToUTC } from '../../../../common/helpers/formatter';
import Avatar from '../../Avatar';
import './Notification.less';

const NotificationWithdrawRoute = ({ notification, read, onClick }) => {
  const urlTo = `/@${notification.to_account}`;
  const urlFrom = `/@${notification.from_account}/transfers`;

  return (
    <Link
      to={urlFrom}
      onClick={onClick}
      className={classNames('Notification', {
        'Notification--unread': !read,
      })}
    >
      <Avatar username={notification.from_account} size={40} />
      <div className="Notification__text">
        <div className="Notification__text__message">
          <FormattedMessage
            id="withdraw_route"
            defaultMessage="{from_account} set withdraw route to {to_account}"
            values={{
              to_account: (
                <Link to={urlTo}>
                  <span className="username">{notification.to_account}</span>
                </Link>
              ),
              from_account: (
                <Link to={urlFrom}>
                  <span className="username">{notification.from_account}</span>
                </Link>
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
};

NotificationWithdrawRoute.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    from_account: PropTypes.string,
    to_account: PropTypes.string,
    timestamp: PropTypes.number,
  }),
  onClick: PropTypes.func,
};

NotificationWithdrawRoute.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
};

export default NotificationWithdrawRoute;

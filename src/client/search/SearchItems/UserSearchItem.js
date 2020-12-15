import { FormattedMessage } from 'react-intl';
import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '../../components/Avatar';
import WeightTag from '../../components/WeightTag';

const UserSearchItem = ({ user }) => {
  if (!user) return null;

  return (
    <React.Fragment>
      <div className="Topnav__search-content-wrap">
        <Avatar username={user.account} size={40} />
        <div className="Topnav__search-content">{user.account}</div>
        <span className="Topnav__search-expertize">
          <WeightTag weight={user.wobjects_weight} />
          &middot;
          <span className="Topnav__search-follow-counter">{user.followers_count}</span>
        </span>
      </div>
      <div className="Topnav__search-content-small">
        {user.youFollows && !user.followsYou && (
          <FormattedMessage id="following_user" defaultMessage="following" />
        )}
        {!user.youFollows && user.followsYou && (
          <FormattedMessage id="follows you" defaultMessage="follows you" />
        )}
        {user.youFollows && user.followsYou && (
          <FormattedMessage id="mutual_follow" defaultMessage="mutual following" />
        )}
      </div>
    </React.Fragment>
  );
};

UserSearchItem.propTypes = {
  user: PropTypes.shape({
    youFollows: PropTypes.bool,
    followsYou: PropTypes.bool,
    followers_count: PropTypes.number,
    wobjects_weight: PropTypes.number,
    account: PropTypes.string,
  }).isRequired,
};

export default UserSearchItem;

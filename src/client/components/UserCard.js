import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FollowButton from '../widgets/FollowButton';
import Avatar from '../components/Avatar';
import './UserCard.less';

const UserCard = ({ username, alt }) => (
  <div className="UserCard">
    <div className="UserCard__left">
      <Link to={`/@${username.name || username}`}>
        <Avatar username={username.name || username} size={40} />
      </Link>
      <Link to={`/@${username.name || username}`}>
        <span className="username">{username.name || username}</span>
      </Link>
      {alt && <span className="UserCard__alt">{alt}</span>}
    </div>
    <FollowButton following={username.name || username} followingType="user" secondary />
  </div>
);

UserCard.propTypes = {
  username: PropTypes.oneOfType([PropTypes.string, PropTypes.shape]),
  alt: PropTypes.node,
};

UserCard.defaultProps = {
  alt: '',
  username: '' || {},
};

export default UserCard;

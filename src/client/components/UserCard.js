import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FollowButton from '../widgets/FollowButton';
import Avatar from '../components/Avatar';
import './UserCard.less';

const UserCard = ({ user, alt }) => (
  <div className="UserCard">
    <div className="UserCard__left">
      <Link to={`/@${user.name}`}>
        <Avatar username={user.name} size={40} />
      </Link>
      <Link to={`/@${user.name}`}>
        <span className="username">{user.name}</span>
      </Link>
      {alt && <span className="UserCard__alt">{alt}</span>}
    </div>
    <FollowButton following={user.name} followingType="user" secondary />
  </div>
);

UserCard.propTypes = {
  user: PropTypes.shape(),
  alt: PropTypes.node,
};

UserCard.defaultProps = {
  alt: '',
  user: {},
};

export default UserCard;

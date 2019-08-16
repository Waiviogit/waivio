import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FollowButton from '../widgets/FollowButton';
import Avatar from '../components/Avatar';
import './UserCard.less';

const UserCard = ({ user, showFollow }) => (
  <div className="UserCard">
    <div className="UserCard__left">
      <div className="UserCard__wrap">
        <Link to={`/@${user.name}`}>
          <Avatar username={user.name} size={40} />
        </Link>
        <Link to={`/@${user.name}`}>
          <span className="username">{user.name}</span>
        </Link>
      </div>
    </div>
    {showFollow && <FollowButton following={user.name} followingType="user" secondary />}
  </div>
);

UserCard.propTypes = {
  user: PropTypes.shape(),
  showFollow: PropTypes.bool,
};

UserCard.defaultProps = {
  user: {},
  showFollow: true,
  authUser: '',
};

export default UserCard;

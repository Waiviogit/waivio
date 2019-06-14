import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from '../Avatar';
import FollowButton from '../../widgets/FollowButton';
import WeightTag from '../../components/WeightTag';
import './User.less';

const User = ({ user }) => (
  <div key={user.name} className="User">
    <div className="User__top">
      <div className="User__links">
        <Link to={`/@${user.name}`}>
          <Avatar username={user.name} size={34} />
        </Link>
        <Link to={`/@${user.name}`} title={user.name} className="User__name">
          <span className="username">{user.name}</span>
        </Link>
      </div>
      <div className="User__follow">
        {user.weight && typeof user.weight === 'number' ? (
          <WeightTag weight={user.weight} />
        ) : (
          <FollowButton following={user.name} followingType="user" secondary />
        )}
      </div>
    </div>
    <div className="User__divider" />
  </div>
);

User.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    weight: PropTypes.number,
  }).isRequired,
};

export default User;

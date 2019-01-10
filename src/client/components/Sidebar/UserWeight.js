import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from '../Avatar';
import FollowButton from '../../widgets/FollowButton';
import './ObjectComponent.less';
import WeightTag from '../WeightTag';

const UserWeight = ({ user }) => (
  <div key={user.name} className="Object">
    <div className="Object__top">
      <div className="Object__links">
        <Link to={{ pathname: `/@${user.name}` }}>
          <Avatar username={user.name} size={34} />
        </Link>
        <Link to={{ pathname: `/@${user.name}` }} title={user.name} className="Object__name">
          <span className="username">{user.name}</span>
        </Link>
        <WeightTag rank={user.rank} weight={user.weight} />
      </div>
      <div className="Object__follow">
        <FollowButton following={user.name} followingType="user" secondary />
      </div>
    </div>
    <div className="Object__divider" />
  </div>
);

UserWeight.propTypes = {
  user: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired,
};

export default UserWeight;

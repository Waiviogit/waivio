import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from '../Avatar';
import FollowButton from '../../widgets/FollowButton';
import './ObjectCard.less';
import WeightTag from '../WeightTag';

const UserWeight = ({ user }) => (
  <div key={user.name} className="ObjectCard">
    <div className="ObjectCard__top">
      <div className="ObjectCard__links">
        <Link to={{ pathname: `/@${user.name}` }}>
          <Avatar username={user.name} size={34} />
        </Link>
        <Link to={{ pathname: `/@${user.name}` }} title={user.name} className="ObjectCard__name">
          <span className="username">{user.name}</span>
        </Link>
        <WeightTag rank={user.rank} weight={user.weight} />
      </div>
      <div className="ObjectCard__follow">
        <FollowButton following={user.name} followingType="user" secondary />
      </div>
    </div>
    <div className="ObjectCard__divider" />
  </div>
);

UserWeight.propTypes = {
  user: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired,
};

export default UserWeight;

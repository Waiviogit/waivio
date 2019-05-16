import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FollowButton from '../widgets/FollowButton';
import Avatar from '../components/Avatar';
import './UserCard.less';

const UserCard = ({ user, alt, showFollow, withLinks }) => (
  <div className="UserCard">
    <div className="UserCard__left">
      {withLinks ? (
        <div className="UserCard__wrap">
          <Link to={`/@${user.name}`}>
            <Avatar username={user.name} size={40} />
          </Link>
          <Link to={`/@${user.name}`}>
            <span className="username">{user.name}</span>
          </Link>
        </div>
      ) : (
        <div className="UserCard__wrap">
          <div>
            <Avatar username={user.name} size={40} />
          </div>
          <div>
            <span className="username">{user.name}</span>
          </div>
        </div>
      )}
      {alt && <span className={showFollow ? 'UserCard__alt' : 'UserCard__short'}>{alt}</span>}
    </div>
    {showFollow && <FollowButton following={user.name} followingType="user" secondary />}
  </div>
);

UserCard.propTypes = {
  user: PropTypes.shape(),
  alt: PropTypes.node,
  showFollow: PropTypes.bool,
  withLinks: PropTypes.bool,
};

UserCard.defaultProps = {
  alt: '',
  user: {},
  showFollow: true,
  withLinks: true,
  authUser: '',
};

export default UserCard;

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FollowButton from '../widgets/FollowButton';
import Avatar from '../components/Avatar';

import './UserCard.less';

const UserCard = ({ user, alt, showFollow, unfollow, follow }) =>
  user && (
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
        {alt && <span className={showFollow ? 'UserCard__alt' : 'UserCard__short'}>{alt}</span>}
      </div>
      {showFollow && (
        <FollowButton
          unfollowUser={unfollow}
          followUser={follow}
          following={user.youFollows}
          user={user}
          followingType="user"
          secondary
        />
      )}
    </div>
  );

UserCard.propTypes = {
  user: PropTypes.shape(),
  alt: PropTypes.node,
  showFollow: PropTypes.bool,
  unfollow: PropTypes.func,
  follow: PropTypes.func,
};

UserCard.defaultProps = {
  alt: '',
  user: {},
  showFollow: true,
  authUser: '',
  unfollow: () => {},
  follow: () => {},
};

export default UserCard;

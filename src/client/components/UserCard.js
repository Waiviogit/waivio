import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FollowButton from '../widgets/FollowButton';
import Avatar from '../components/Avatar';

import './UserCard.less';

const UserCard = ({ user, alt, showFollow, unfollow, follow, admin, moderator }) => {
  const status = moderator ? 'moderator' : 'admin';
  // const followersCount = user.users.length;

  return (
    user && (
      <div className="UserCard">
        <div className={showFollow ? 'UserCard__left' : 'UserCard__sidebar'}>
          <div className="UserCard__wrap">
            <Link to={`/@${user.name}`}>
              <Avatar username={user.name} size={40} />
            </Link>
            <Link to={`/@${user.name}`}>
              <span className="username">{user.name}</span>
            </Link>
            {(admin || moderator) && (
              <span>
                &nbsp;(<span className="UserCard__status">{status}</span>)
              </span>
            )}
          </div>
          {alt && (
            <span className={showFollow ? 'UserCard__alt BlockWeight' : 'UserCard__short'}>
              {alt}
            </span>
          )}
          <span className={showFollow ? 'reblogged' : 'rebloggedFollowersNone'}>
            &middot;&nbsp;&nbsp;{` ${user.followers_count} `}
          </span>
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
    )
  );
};

UserCard.propTypes = {
  user: PropTypes.shape(),
  alt: PropTypes.node,
  showFollow: PropTypes.bool,
  unfollow: PropTypes.func,
  follow: PropTypes.func,
  admin: PropTypes.bool,
  moderator: PropTypes.bool,
};

UserCard.defaultProps = {
  alt: '',
  user: {},
  showFollow: true,
  authUser: '',
  unfollow: () => {},
  follow: () => {},
  admin: false,
  moderator: false,
};

export default UserCard;

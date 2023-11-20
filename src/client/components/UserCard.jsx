import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import FollowButton from '../widgets/FollowButton';
import Avatar from '../components/Avatar';

import './UserCard.less';

const UserCard = ({ user, alt, showFollow, unfollow, follow, withoutLine, handleClick }) => {
  const cardView = showFollow ? 'UserCard__left' : 'UserCard__sidebar';
  const weightBlock = showFollow ? 'UserCard__alt BlockWeight' : 'UserCard__short';
  const followersCountBlock = showFollow ? 'reblogged' : 'rebloggedFollowersNone';
  const userCardClassList = classNames('UserCard', {
    'UserCard--withoutLine': withoutLine,
  });

  return (
    user && (
      <div className={userCardClassList} role="presentation" onClick={handleClick}>
        <div className={cardView}>
          <div className="UserCard__wrap">
            <Link to={`/@${user.name}`}>
              <Avatar username={user.name} size={40} />
            </Link>
            <Link to={`/@${user.name}`}>
              <span className="username">{user.name}</span>
            </Link>
            {user.admin && (
              <span>
                &nbsp;(<span className="UserCard__status">admin</span>)
              </span>
            )}
          </div>
          {alt && <span className={weightBlock}>{alt}</span>}
          <span className={followersCountBlock}>
            {Boolean(user.followers_count) && `· ${user.followers_count} `}
          </span>
        </div>
        {showFollow && !withoutLine && (
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
  withoutLine: PropTypes.bool,
  unfollow: PropTypes.func,
  follow: PropTypes.func,
  handleClick: PropTypes.func,
};

UserCard.defaultProps = {
  alt: '',
  user: {},
  showFollow: true,
  withoutLine: false,
  authUser: '',
  unfollow: () => {},
  follow: () => {},
  handleClick: () => {},
};

export default UserCard;

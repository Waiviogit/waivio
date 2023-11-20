import React from 'react';
import PropTypes from 'prop-types';
import { has } from 'lodash';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Avatar from '../components/Avatar';
import FollowButton from '../widgets/FollowButton';
import WeightTag from '../../client/components/WeightTag';

import './Discover.less';

const DiscoverUser = ({ user, isReblogged, unfollow, follow }) => (
  <div key={user.name} className="Discover__user">
    <div className="Discover__user__content">
      <div className="Discover__user__links">
        <Link to={`/@${user.name}`}>
          <Avatar username={user.name} size={40} />
        </Link>
        <div className="Discover__user__profile">
          <div className="Discover__user__profile__header">
            <Link to={`/@${user.name}`}>
              <span className="Discover__user__name">
                <span className="username">{user.name}</span>
              </span>
            </Link>
            {has(user, 'wobjects_weight') && <WeightTag weight={user.wobjects_weight} />}
            {isReblogged && (
              <span className="reblogged">
                &middot;&nbsp;&nbsp;{` ${user.followers_count} `}
                {user.followsYou && (
                  <span>
                    &middot;&nbsp;
                    <FormattedMessage id="follows you" defaultMessage="follows you" />
                  </span>
                )}
              </span>
            )}
            <div className="Discover__user__follow">
              <FollowButton
                following={user.youFollows}
                user={user}
                unfollowUser={unfollow}
                followingType="user"
                secondary={isReblogged}
                followUser={follow}
                top
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="Discover__user__divider" />
  </div>
);

DiscoverUser.propTypes = {
  user: PropTypes.shape().isRequired,
  isReblogged: PropTypes.bool,
  unfollow: PropTypes.func,
  follow: PropTypes.func,
};

DiscoverUser.defaultProps = {
  isReblogged: false,
  unfollow: () => {},
  follow: () => {},
};

export default DiscoverUser;

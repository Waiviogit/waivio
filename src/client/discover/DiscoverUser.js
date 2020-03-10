import React from 'react';
import PropTypes from 'prop-types';
import { attempt, isError, has, get } from 'lodash';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Avatar from '../components/Avatar';
import FollowButton from '../widgets/FollowButton';
import WeightTag from '../../client/components/WeightTag';

const DiscoverUser = ({ user, isReblogged }) => {
  const parsedJSON = attempt(JSON.parse, user.json_metadata);
  const userJSON = isError(parsedJSON) ? {} : parsedJSON;
  const profileName = get(userJSON, 'profile.name');

  return (
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
                  <span className="username">{profileName || user.name}</span>
                </span>
              </Link>
              {has(user, 'wobjects_weight') && <WeightTag weight={user.wobjects_weight} />}
              {isReblogged && (
                <span className="reblogged">
                  &nbsp;&middot;{` ${user.followers_count} `}
                  {user.followsMe && (
                    <span>
                      &middot;&nbsp;
                      <FormattedMessage id="follows you" defaultMessage="follows you" />
                    </span>
                  )}
                </span>
              )}
              <div className="Discover__user__follow">
                <FollowButton following={user.name} followingType="user" secondary={isReblogged} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="Discover__user__divider" />
    </div>
  );
};

DiscoverUser.propTypes = {
  user: PropTypes.shape().isRequired,
  isReblogged: PropTypes.bool,
};

DiscoverUser.defaultProps = {
  isReblogged: false,
};

export default DiscoverUser;

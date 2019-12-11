import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import Avatar from '../components/Avatar';
import FollowButton from '../widgets/FollowButton';
import WeightTag from '../../client/components/WeightTag';

const DiscoverUser = ({ user }) => {
  const parsedJSON = _.attempt(JSON.parse, user.json_metadata);
  const userJSON = _.isError(parsedJSON) ? {} : parsedJSON;
  const userProfile = _.has(userJSON, 'profile') ? userJSON.profile : {};
  const name = userProfile.name;

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
                  <span className="username">{name || user.name}</span>
                </span>
              </Link>
              {user.wobjects_weight && typeof user.wobjects_weight === 'number' && (
                <WeightTag weight={user.wobjects_weight} />
              )}
              <div className="Discover__user__follow">
                <FollowButton following={user.name} followingType="user" />
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
};

export default DiscoverUser;

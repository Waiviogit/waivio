import React from 'react';
import PropTypes from 'prop-types';
import UserProfile from '../../user/UserProfile';

const UserBlog = props => {
  const { match } = props;

  return (
    <div>
      <UserProfile match={match} isBlogInObject />
    </div>
  );
};

UserBlog.propTypes = {
  match: PropTypes.shape().isRequired,
};

export default UserBlog;

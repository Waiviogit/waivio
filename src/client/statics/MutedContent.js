import React from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { getAuthenticatedUserName } from '../../store/authStore/authSelectors';

import './EmptyFeed.less';

const EmptyMutedUserProfile = ({ user }) => {
  const authName = useSelector(getAuthenticatedUserName);
  let message = '';

  if ((user.muted && isEmpty(user.mutedBy)) || user.mutedBy?.includes(authName))
    message = <div>Muted by you</div>;
  else if (!isEmpty(user.mutedBy)) message = <div>Blocked by a website moderator</div>;

  return <div className="feed_empty">{message}</div>;
};

EmptyMutedUserProfile.propTypes = {
  user: PropTypes.shape({
    mutedBy: PropTypes.arrayOf(PropTypes.string),
    muted: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default EmptyMutedUserProfile;

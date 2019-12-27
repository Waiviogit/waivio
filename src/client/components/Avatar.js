import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';
import { getAuthenticatedUserAvatar, getAuthenticatedUserName } from '../reducers';
import './Avatar.less';

export function getAvatarURL(username, size = 100, guestAvatar, currentUserName) {
  if (username === currentUserName && guestAvatar) {
    return guestAvatar;
  }
  return size > 64
    ? `https://steemitimages.com/u/${username}/avatar`
    : `https://steemitimages.com/u/${username}/avatar/small`;
}
// todo: add logic for fetching guest users avatars

const Avatar = ({ username, size }) => {
  const guestAvatar = useSelector(getAuthenticatedUserAvatar);
  const currentUserName = useSelector(getAuthenticatedUserName, shallowEqual);

  let style = {
    minWidth: `${size}px`,
    width: `${size}px`,
    height: `${size}px`,
  };

  const url = getAvatarURL(username, size, guestAvatar, currentUserName);

  if (username) {
    style = {
      ...style,
      backgroundImage: `url(${url})`,
    };
  }

  return <div className="Avatar" style={style} title={username} />;
};

Avatar.propTypes = {
  username: PropTypes.string.isRequired,
  size: PropTypes.number,
};

Avatar.defaultProps = {
  size: 100,
};

export default Avatar;

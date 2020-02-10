import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getAuthenticatedUser } from '../reducers';
import './Avatar.less';

export function getAvatarURL(username, size = 100) {
  if (username && username.includes('waivio_')) {
    const authenticatedUser = useSelector(getAuthenticatedUser);
    const lastAccountUpdate = moment(authenticatedUser.updatedAt).unix();
    return `https://waivio.nyc3.digitaloceanspaces.com/avatar/${username}?${lastAccountUpdate}`;
  }
  return size > 64
    ? `https://steemitimages.com/u/${username}/avatar`
    : `https://steemitimages.com/u/${username}/avatar/small`;
}

const Avatar = ({ username, size }) => {
  let style = {
    minWidth: `${size}px`,
    width: `${size}px`,
    height: `${size}px`,
  };

  const url = getAvatarURL(username, size);

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

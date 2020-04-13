import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { getAuthenticatedUser } from '../reducers';
import './Avatar.less';

const baseAvatarUrl = 'https://images.hive.blog/u';
const steemAvatarUrl = 'https://steemitimages.com/u';

export function getAvatarURL(username, size = 100, authenticatedUser, url = baseAvatarUrl) {
  const lastAccountUpdate = !isEmpty(authenticatedUser)
    ? moment(authenticatedUser.updatedAt || authenticatedUser.last_account_update).unix()
    : '';

  if (username && username.includes('waivio_')) {
    return `https://waivio.nyc3.digitaloceanspaces.com/avatar/${username}?${lastAccountUpdate}`;
  }

  if (!isEmpty(authenticatedUser) && authenticatedUser.name === username) {
    return `${url}/${username}/avatar`;
  }

  return size > 64 ? `${url}/${username}/avatar` : `${url}/${username}/avatar/small`;
}

const Avatar = ({ username, size, handleChangeUrl }) => {
  const [url, setUrl] = useState('');

  const style = {
    minWidth: `${size}px`,
    width: `${size}px`,
    height: `${size}px`,
  };
  const authenticatedUser = useSelector(getAuthenticatedUser);

  useEffect(() => {
    setUrl(getAvatarURL(username, size, authenticatedUser));
    handleChangeUrl(url);
  }, []);

  return (
    <img
      className="Avatar"
      style={style}
      title={username}
      src={url}
      alt={username}
      onError={() => {
        setUrl(getAvatarURL(username, size, authenticatedUser, steemAvatarUrl));
        handleChangeUrl(url);
      }}
      onLoad={() => handleChangeUrl(url)}
    />
  );
};

Avatar.propTypes = {
  username: PropTypes.string.isRequired,
  size: PropTypes.number,
  handleChangeUrl: PropTypes.func,
};

Avatar.defaultProps = {
  size: 100,
  handleChangeUrl: () => {},
};

export default Avatar;

import React from 'react';
import { connect, useSelector } from 'react-redux';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { BXY_GUEST_PREFIX, GUEST_PREFIX } from '../../common/constants/waivio';
import { getAuthenticatedUser } from '../../store/authStore/authSelectors';
import { parseJSON } from '../../common/helpers/parseJSON';
import { getUser } from '../../store/usersStore/usersSelectors';
import './Avatar.less';
import { getProxyImageURL } from '../../common/helpers/image';

export function getAvatarURL(username, size = 100, authenticatedUser) {
  const url = 'https://images.hive.blog/u';
  const lastAccountUpdate = !isEmpty(authenticatedUser)
    ? moment(authenticatedUser.updatedAt || authenticatedUser.last_account_update).unix()
    : '';

  if (username && (username?.includes(GUEST_PREFIX) || username?.includes(BXY_GUEST_PREFIX))) {
    return `https://waivio.nyc3.digitaloceanspaces.com/avatar/${username}?${lastAccountUpdate}`;
  }

  if (!isEmpty(authenticatedUser) && authenticatedUser.name === username) {
    return `${url}/${username}/avatar/large?${lastAccountUpdate}`;
  }

  return size > 64 ? `${url}/${username}/avatar` : `${url}/${username}/avatar/small`;
}

const Avatar = ({ avatar, username, size, authenticatedUser, isSquare, lightbox }) => {
  const authUser = useSelector(state => getUser(state, authenticatedUser.name));
  const avatarClassNames = classnames('Avatar', {
    'Avatar-square': isSquare,
    'Avatar-lightbox': lightbox,
  });
  let style = {
    minWidth: `${size}px`,
    width: `${size}px`,
    height: `${size}px`,
  };
  let url = getAvatarURL(username, size, authenticatedUser);

  if (avatar) {
    url = avatar;
  }

  if (username === authUser?.name) {
    const profileImage = parseJSON(authUser?.posting_json_metadata)?.profile?.profile_image;
    const proxyProfileImage = profileImage?.includes('images.hive.blog')
      ? profileImage
      : getProxyImageURL(profileImage);

    url = profileImage ? proxyProfileImage : url;
  }

  if (username) {
    style = {
      ...style,
      backgroundImage: `url(${url})`,
    };
  }

  return <div className={avatarClassNames} style={style} title={username} />;
};

Avatar.propTypes = {
  username: PropTypes.string,
  avatar: PropTypes.string,
  authenticatedUser: PropTypes.shape({
    name: PropTypes.string,
  }),
  size: PropTypes.number,
  isSquare: PropTypes.bool,
  lightbox: PropTypes.bool,
};

Avatar.defaultProps = {
  size: 100,
  username: '',
  authenticatedUser: {},
  isSquare: false,
  lightbox: false,
};

export default connect(state => ({ authenticatedUser: getAuthenticatedUser(state) }))(Avatar);

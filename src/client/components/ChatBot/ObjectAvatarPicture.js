import PropTypes from 'prop-types';
import React from 'react';
import { getProxyImageURL } from '../../../common/helpers/image';
import DEFAULTS from '../../object/const/defaultValues';

const ObjectAvatarPicture = ({ object, className = '' }) => {
  const avatarUrl = object.avatar || object.parent?.avatar;
  const proxyUrl = avatarUrl ? getProxyImageURL(avatarUrl, 'preview') : DEFAULTS.AVATAR;

  return (
    <img
      src={proxyUrl}
      alt={object.name || object.default_name || 'Object'}
      className={`object-avatar ${className}`}
      style={{
        cursor: 'pointer',
        objectFit: 'contain',
        height: 'auto',
        alignSelf: 'flex-start',
      }}
      onClick={() => window.open(`/object/${object.author_permlink}`, '_blank')}
    />
  );
};

ObjectAvatarPicture.propTypes = {
  object: PropTypes.shape({
    author_permlink: PropTypes.string.isRequired,
    name: PropTypes.string,
    default_name: PropTypes.string,
    avatar: PropTypes.string,
    parent: PropTypes.shape({
      avatar: PropTypes.string,
    }),
  }).isRequired,

  className: PropTypes.string,
};

export default ObjectAvatarPicture;

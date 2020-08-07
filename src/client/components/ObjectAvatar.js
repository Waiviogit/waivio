import React from 'react';
import PropTypes from 'prop-types';
import { filter, maxBy, includes, get } from 'lodash';

import DEFAULTS from '../object/const/defaultValues';

import './ObjectAvatar.less';

export const getObjectUrl = item => {
  const avatarFields = filter(item.fields, o => o.name === 'avatar');
  const avatarField = maxBy(avatarFields, 'weight');
  return avatarField ? avatarField.body : null;
};

const ObjectAvatar = ({ item, size }) => {
  let style = {
    minWidth: `${size}px`,
    width: `${size}px`,
    height: `${size}px`,
  };
  let url = item.avatar || get(item, ['parent', 'avatar']);

  if (includes(url, 'waivio.')) url = `${url}${size < 41 ? '_small' : '_medium'}`;

  if (url) {
    style = {
      ...style,
      backgroundImage: `url(${url})`,
    };
  } else {
    style = {
      ...style,
      backgroundImage: `url(${DEFAULTS.AVATAR})`,
    };
  }

  return <div className="ObjectAvatar" style={style} />;
};

ObjectAvatar.propTypes = {
  item: PropTypes.shape({
    parent: PropTypes.oneOfType([
      PropTypes.shape({
        avatar: PropTypes.string,
      }),
      PropTypes.string,
    ]),
    avatar: PropTypes.string,
  }),
  size: PropTypes.number,
};

ObjectAvatar.defaultProps = {
  size: 100,
  item: {},
};

export default ObjectAvatar;

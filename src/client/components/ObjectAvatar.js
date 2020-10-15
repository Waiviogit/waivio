import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { DEFAULT_OBJECT_AVATAR_URL } from '../../common/constants/waivio';
import './ObjectAvatar.less';

const ObjectAvatar = ({ item, size }) => {
  let style = {
    minWidth: `${size}px`,
    width: `${size}px`,
    height: `${size}px`,
  };

  let url = item.avatar;
  if (_.includes(url, 'waivio.')) url = `${url}${size < 41 ? '_small' : '_medium'}`;
  if (url) {
    style = {
      ...style,
      backgroundImage: `url(${url})`,
    };
  } else {
    style = {
      ...style,
      backgroundImage: `url(${DEFAULT_OBJECT_AVATAR_URL})`,
    };
  }

  return <div className="ObjectAvatar" style={style} />;
};

ObjectAvatar.propTypes = {
  item: PropTypes.shape({ tag: PropTypes.string }),
  size: PropTypes.number,
};

ObjectAvatar.defaultProps = {
  size: 100,
  item: {},
};

export default ObjectAvatar;

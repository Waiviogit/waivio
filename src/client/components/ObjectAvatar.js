import React from 'react';
import PropTypes from 'prop-types';
import { includes, get } from 'lodash';

import DEFAULTS from '../object/const/defaultValues';
import { getProxyImageURL } from '../../common/helpers/image';

import './ObjectAvatar.less';

const ObjectAvatar = ({ item, size }) => {
  let style = {
    minWidth: `${size}px`,
    width: `${size}px`,
    height: `${size}px`,
  };
  const parent = get(item, ['parent'], {});
  let url = item.avatar || parent.avatar;

  if (url) url = getProxyImageURL(url, 'preview');
  else url = DEFAULTS.AVATAR;

  if (includes(url, 'waivio.')) url = `${url}${size < 41 ? '_small' : '_medium'}`;

  style = {
    ...style,
    backgroundImage: `url(${url})`,
  };

  return <div className="ObjectAvatar" style={style} />;
};

ObjectAvatar.propTypes = {
  item: PropTypes.shape({
    parent: PropTypes.oneOfType([PropTypes.shape(), PropTypes.string]),
    avatar: PropTypes.string,
  }),
  size: PropTypes.number,
};

ObjectAvatar.defaultProps = {
  size: 100,
  item: {},
};

export default ObjectAvatar;

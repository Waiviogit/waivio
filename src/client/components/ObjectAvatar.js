import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import './ObjectAvatar.less';

const defaultUrl = 'https://steemitimages.com/u/waivio/avatar/small';

const getObjectUrl = item => {
  const o = _.find(item.fields, ['name', 'avatarImage']);
  return o ? o.body : null;
};

const ObjectAvatar = ({ item, size }) => {
  let style = {
    minWidth: `${size}px`,
    width: `${size}px`,
    height: `${size}px`,
  };

  const url = getObjectUrl(item);

  if (url) {
    style = {
      ...style,
      backgroundImage: `url(${url})`,
    };
  } else {
    style = {
      ...style,
      backgroundImage: `url(${defaultUrl})`,
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

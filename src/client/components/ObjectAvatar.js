import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import './ObjectAvatar.less';

const defaultUrl =
  'https://cdn.steemitimages.com/DQmWxwUb1hpd3X2bSL9VrWbJvNxKXDS2kANWoGTkwi4RdwV/unknown.png';

export const getObjectUrl = item => {
  const avatarFields = _.filter(item.fields, o => o.name === 'avatar');
  const avatarField = _.maxBy(avatarFields, 'weight');
  return avatarField ? avatarField.body : null;
};

const ObjectAvatar = ({ item, size }) => {
  let style = {
    minWidth: `${size}px`,
    width: `${size}px`,
    height: `${size}px`,
  };

  let url = getObjectUrl(item);
  if (_.includes(url, 'waivio.')) url = `${url}${size < 41 ? '_small' : '_medium'}`;
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

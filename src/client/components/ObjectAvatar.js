import React from 'react';
import PropTypes from 'prop-types';
import './ObjectAvatar.less';

const defaultUrl = 'https://steemitimages.com/u/waivio/avatar/small';

const ObjectAvatar = ({ url, size }) => {
  let style = {
    minWidth: `${size}px`,
    width: `${size}px`,
    height: `${size}px`,
  };

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
  url: PropTypes.string.isRequired,
  size: PropTypes.number,
};

ObjectAvatar.defaultProps = {
  size: 100,
  url: defaultUrl,
};

export default ObjectAvatar;

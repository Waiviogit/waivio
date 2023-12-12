import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { getProxyImageURL } from '../../../common/helpers/image';

const CustomImage = ({ src, className, onClick }) => {
  const [url, setUrl] = useState(getProxyImageURL(src));

  return (
    <img className={className} onError={() => setUrl(src)} onClick={onClick} alt="" src={url} />
  );
};

CustomImage.propTypes = {
  src: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default CustomImage;

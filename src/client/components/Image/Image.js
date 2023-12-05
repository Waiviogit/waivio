import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { getProxyImageURL } from '../../../common/helpers/image';

const CustomImage = ({ src, className, onClick }) => {
  const [url, setUrl] = useState();
  const img = new Image();

  img.src = getProxyImageURL(src);
  img.onerror = () => setUrl(src);
  img.onload = () => setUrl(getProxyImageURL(src));

  return url ? <img className={className} onClick={onClick} alt="" src={url} /> : null;
};

CustomImage.propTypes = {
  src: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default CustomImage;

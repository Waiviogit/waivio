import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { getProxyImageURL } from '../../../common/helpers/image';
import { isManualAltText } from '../../../common/helpers/imageCaption';

const CustomImage = ({ src, className, onClick, alt }) => {
  const [url, setUrl] = useState(getProxyImageURL(src));

  return (
    <img
      className={className}
      onError={() => setUrl(src)}
      onClick={onClick}
      alt={isManualAltText(alt, src) ? alt : ''}
      src={url}
      data-fallback-src={src}
    />
  );
};

CustomImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default CustomImage;

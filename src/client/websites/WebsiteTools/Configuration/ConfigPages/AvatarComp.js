import React, { useEffect, useState } from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';

const AvatarComp = ({ link, isBanner, isDesktopLogo = false }) => {
  const [isRectangle, setIsRectangle] = useState(false);

  useEffect(() => {
    if (!link || !isDesktopLogo) return;

    const img = new Image();
    img.src = link;
    img.onload = () => {
      setIsRectangle(img.naturalWidth > img.naturalHeight);
    };
  }, [link, isDesktopLogo]);

  const baseClass = `WebsitesConfigurations__${isBanner ? 'banner' : 'avatar'}`;
  const shapeClass =
    isDesktopLogo && !isBanner ? `${baseClass}--${isRectangle ? 'rectangle' : 'square'}` : '';

  return (
    <>
      {link ? (
        <div
          className={`${baseClass} ${shapeClass}`}
          style={{
            backgroundImage: `url(${link})`,
            backgroundPosition: isBanner ? 'left' : 'center',
            backgroundSize: 'cover',
          }}
        />
      ) : (
        <div
          className="WebsitesConfigurations__avatar"
          style={{
            backgroundColor: '#cccccc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <Icon type="picture" />
        </div>
      )}
    </>
  );
};

AvatarComp.propTypes = {
  link: PropTypes.string,
  isBanner: PropTypes.bool,
  isDesktopLogo: PropTypes.bool,
};

export default AvatarComp;

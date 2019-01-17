import React from 'react';
import PropTypes from 'prop-types';
import { Carousel, Icon } from 'antd';
import './PicturesCarousel.less';

const Arrow = ({ className, style, onClick, icon }) => (
  <Icon
    className={className}
    style={{ ...style, fontSize: '20px' }}
    type={icon}
    onClick={onClick}
  />
);

Arrow.propTypes = {
  className: PropTypes.string.isRequired,
  style: PropTypes.shape().isRequired,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
};

const PicturesCarousel = ({ pics }) => {
  const settings = {
    arrows: true,
    lazyLoad: true,
    nextArrow: <Arrow icon="right" />,
    prevArrow: <Arrow icon="left" />,
  };

  return (
    pics.length && (
      <Carousel {...settings}>
        {pics.map(pic => (
          <img key={pic} src={pic} alt="pic" />
        ))}
      </Carousel>
    )
  );
};

PicturesCarousel.propTypes = {
  pics: PropTypes.arrayOf(PropTypes.string),
};

PicturesCarousel.defaultProps = {
  pics: [],
};

export default PicturesCarousel;

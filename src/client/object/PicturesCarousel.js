import React from 'react';
import PropTypes from 'prop-types';
import { Carousel } from 'antd';
import './PicturesCarousel.less';

const PicturesCarousel = ({ pics }) =>
  pics.length && (
    <Carousel autoplay lazyLoad>
      {pics.map(pic => (
        <img key={pic} src={pic} alt="pic" />
      ))}
    </Carousel>
  );

PicturesCarousel.propTypes = {
  pics: PropTypes.arrayOf(PropTypes.string),
};

PicturesCarousel.defaultProps = {
  pics: [],
};

export default PicturesCarousel;

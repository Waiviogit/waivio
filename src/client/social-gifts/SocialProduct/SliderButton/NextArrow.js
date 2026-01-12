import { Icon } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

const NextArrow = ({ onClick, currentSlide, slideCount, slidesToShow }) => {
  const hide = currentSlide >= slideCount - slidesToShow;

  return (
    <span
      className={`PicturesSlider__arrow PicturesSlider__arrow--next ${
        hide ? 'PicturesSlider__arrow--hidden' : ''
      }`}
      onClick={hide ? undefined : onClick}
    >
      <Icon type="caret-right" />
    </span>
  );
};

NextArrow.propTypes = {
  onClick: PropTypes.func,
  currentSlide: PropTypes.number,
  slideCount: PropTypes.number,
  slidesToShow: PropTypes.number,
};

export default NextArrow;

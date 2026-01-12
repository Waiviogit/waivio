import { Icon } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

const PrevArrow = ({ onClick, currentSlide }) => {
  const hide = currentSlide <= 0;

  return (
    <span
      className={`PicturesSlider__arrow PicturesSlider__arrow--prev ${
        hide ? 'PicturesSlider__arrow--hidden' : ''
      }`}
      onClick={hide ? undefined : onClick}
    >
      <Icon type="caret-left" />
    </span>
  );
};

PrevArrow.propTypes = {
  onClick: PropTypes.func,
  currentSlide: PropTypes.number,
};

export default PrevArrow;

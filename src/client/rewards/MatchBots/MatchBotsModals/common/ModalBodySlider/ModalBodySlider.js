import { Slider } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';

import './ModalBodySlider.less';

const ModalBodySlider = ({
  marks,
  sliderValue,
  handleChangeSlider,
  sliderTitle,
  sliderDescription,
}) => {
  const formatTooltip = value => `${value}%`;

  return (
    <div className="modalBodySlider">
      <p className="modalBodySlider_title">{sliderTitle}</p>
      <Slider
        min={1}
        defaultValue={sliderValue}
        marks={marks}
        tipFormatter={formatTooltip}
        onChange={handleChangeSlider}
      />
      <p className="modalBodySlider_text">{sliderDescription}</p>
    </div>
  );
};

ModalBodySlider.propTypes = {
  marks: PropTypes.shape(),
  sliderValue: PropTypes.number,
  handleChangeSlider: PropTypes.func,
  sliderTitle: PropTypes.string.isRequired,
  sliderDescription: PropTypes.string.isRequired,
};

ModalBodySlider.defaultProps = {
  marks: {
    1: '1%',
    25: '25%',
    50: '50%',
    75: '75%',
    100: '100%',
  },
  sliderValue: 100,
  handleChangeSlider: () => {},
};

export default ModalBodySlider;

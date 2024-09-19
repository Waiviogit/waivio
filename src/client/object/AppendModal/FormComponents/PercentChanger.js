import React, { useState } from 'react';
import { Slider } from 'antd';
import PropTypes from 'prop-types';

const PercentChanger = ({ max = 100, onAfterChange }) => {
  const [value, setValue] = useState(1);
  const onChange = percent => {
    const percentValue = percent < max ? percent : max;

    setValue(percentValue);
  };

  return (
    <Slider
      className="obj-item-slider"
      min={1}
      max={100}
      value={value}
      onChange={onChange}
      onAfterChange={percentValue => onAfterChange(percentValue)}
    />
  );
};

PercentChanger.propTypes = {
  max: PropTypes.string,
  onAfterChange: PropTypes.func,
};

export default PercentChanger;

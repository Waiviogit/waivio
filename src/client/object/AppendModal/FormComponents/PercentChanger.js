import React, { useState } from 'react';
import { Slider } from 'antd';
import PropTypes from 'prop-types';

import './PercentChanger.less';

const PercentChanger = ({ max = 100, onAfterChange, defaultPercent = 1 }) => {
  const [value, setValue] = useState(defaultPercent);
  const onChange = percent => {
    const percentValue = percent < max && percent > 0 ? percent : max;

    setValue(percentValue);
  };

  return (
    <div>
      <span
        style={{
          display: 'inline-block',
          marginTop: '10px',
        }}
      >
        Frequency of use: {value}%.
      </span>
      <Slider
        className="PercentChanger"
        min={1}
        max={100}
        value={value}
        onChange={onChange}
        onAfterChange={percentValue => onAfterChange(percentValue)}
      />
    </div>
  );
};

PercentChanger.propTypes = {
  max: PropTypes.number,
  defaultPercent: PropTypes.number,
  onAfterChange: PropTypes.func,
};

export default PercentChanger;

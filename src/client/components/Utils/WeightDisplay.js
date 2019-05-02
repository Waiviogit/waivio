import React from 'react';
import PropTypes from 'prop-types';
import { roundNumberToThousands } from '../../vendor/steemitHelpers';

const WeightDisplay = ({ value }) => {
  const negative = value < 0;
  const shortValue = value.toFixed(2);
  const formattedValue = roundNumberToThousands(shortValue);
  return (
    <span>
      {negative && '-'}
      {formattedValue}
    </span>
  );
};

WeightDisplay.propTypes = {
  value: PropTypes.number,
};

WeightDisplay.defaultProps = {
  value: 0,
};

export default WeightDisplay;

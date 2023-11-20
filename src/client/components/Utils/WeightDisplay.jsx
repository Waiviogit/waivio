import React from 'react';
import PropTypes from 'prop-types';
import { roundNumberToThousands } from '../../vendor/steemitHelpers';

const WeightDisplay = ({ value }) => {
  const currValue = value > 0 ? value : 0;
  const shortValue = currValue.toFixed(2);
  const formattedValue = roundNumberToThousands(shortValue);

  return <span>{formattedValue}</span>;
};

WeightDisplay.propTypes = {
  value: PropTypes.number,
};

WeightDisplay.defaultProps = {
  value: 0,
};

export default WeightDisplay;

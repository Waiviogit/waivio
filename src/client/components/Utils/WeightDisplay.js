import React from 'react';
import PropTypes from 'prop-types';
import { roundNumberToThousands } from '../../vendor/steemitHelpers';

const WeightDisplay = ({ value }) => {
  const shortValue = value.toFixed(2);
  const formattedValue = value > 0 ? roundNumberToThousands(shortValue) : 0;

  return <span>{formattedValue}</span>;
};

WeightDisplay.propTypes = {
  value: PropTypes.number,
};

WeightDisplay.defaultProps = {
  value: 0,
};

export default WeightDisplay;

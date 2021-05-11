import React from 'react';
import PropTypes from 'prop-types';
import { round } from 'lodash';
import { roundNumberToThousands } from '../../vendor/steemitHelpers';

const WeightDisplay = ({ value }) => {
  const shortValue = round(value, 2);
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

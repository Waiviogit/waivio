import React from 'react';
import PropTypes from 'prop-types';

import USDDisplay from '../../../components/Utils/USDDisplay';

import './MarkerWithReward.less';

const MarkerWithReward = props => (
  <span className="MarkerWithReward">
    <USDDisplay currencyDisplay="symbol" value={props.price} />
  </span>
);

export default MarkerWithReward;

MarkerWithReward.propTypes = {
  price: PropTypes.number.isRequired,
};

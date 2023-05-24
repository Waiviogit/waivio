import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import USDDisplay from '../../../components/Utils/USDDisplay';

import './MarkerWithReward.less';

const MarkerWithReward = props => {
  const classList = classNames('MarkerWithReward', { 'MarkerWithReward--hovered': props.hovered });

  return (
    <span className={classList}>
      <USDDisplay currencyDisplay="symbol" value={props.price} />
      <span className="MarkerWithReward__triangular" />
    </span>
  );
};

export default MarkerWithReward;

MarkerWithReward.propTypes = {
  price: PropTypes.number.isRequired,
  hovered: PropTypes.bool.isRequired,
};

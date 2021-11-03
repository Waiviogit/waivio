import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { get } from 'lodash';

import USDDisplay from '../../../components/Utils/USDDisplay';
import { initialColors } from '../../constants/colors';

import './MarkerWithReward.less';

const MarkerWithReward = props => {
  const classList = classNames('MarkerWithReward', { 'MarkerWithReward--hovered': props.hovered });
  const markerColor = get(props, 'colors.mapMarkerBody', '') || initialColors.marker;
  const textColor = get(props, 'colors.mapMarkerText', '') || initialColors.text;

  return (
    <span className={classList} style={{ background: markerColor, color: textColor }}>
      <USDDisplay currencyDisplay="symbol" value={props.price} />
      <span
        className="MarkerWithReward__triangular"
        style={{
          borderColor: `${markerColor} transparent transparent transparent`,
        }}
      />
    </span>
  );
};

export default MarkerWithReward;

MarkerWithReward.propTypes = {
  price: PropTypes.number.isRequired,
  hovered: PropTypes.bool.isRequired,
};

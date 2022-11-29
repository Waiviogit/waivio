import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';

import './DistrictsCard.less';

const DistrictsCard = props => (
  <Link to={`/map?${props.route}&showPanel=true&type=restaurant`} className="DistrictsCard">
    <h5 className="DistrictsCard__city">{props.city}</h5>
    <div className="DistrictsCard__counter">
      {props.counter}{' '}
      {props.intl.formatMessage({ id: 'restaurants', defaultMessage: 'restaurants' })}
    </div>
  </Link>
);

DistrictsCard.propTypes = {
  city: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,
  counter: PropTypes.number.isRequired,
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(DistrictsCard);

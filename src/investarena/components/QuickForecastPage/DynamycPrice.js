import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import USDDisplay from '../../../client/components/Utils/USDDisplay';

const DynamicPrice = ({ postPrice, quotes, security }) => {
  const price = quotes[security] && quotes[security].bidPrice;
  const rise = postPrice < price;
  const priceClassList = classNames('ForecastCard__price', {
    'ForecastCard__price--fall': !rise,
    'ForecastCard__price--rise': rise,
  });

  return (
    <div className={priceClassList}>
      <USDDisplay value={+price} />
    </div>
  );
};

DynamicPrice.propTypes = {
  postPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  quotes: PropTypes.shape({}).isRequired,
  security: PropTypes.string.isRequired,
};

DynamicPrice.defaultProps = {
  closedPrice: 0,
};

const mapStateToProps = state => ({
  quotes: state.quotes,
});

export default connect(mapStateToProps)(DynamicPrice);

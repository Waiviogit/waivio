import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import USDDisplay from '../../../client/components/Utils/USDDisplay';

const DynamicPrice = ({ postPrice, quotes, secur, closedPrice, intl }) => {
  const price = quotes[secur] && quotes[secur].bidPrice;
  const activePrice = closedPrice || price;
  const rise = postPrice < activePrice;
  const priceClassList = classNames('ForecastCard__price', {
    'ForecastCard__price--fall': !rise,
    'ForecastCard__price--rise': rise,
  });

  return (
    <div className="ForecastCard__val">
      <div>
        {closedPrice
          ? intl.formatMessage({
              id: 'forecast_closed',
              defaultMessage: 'Closed',
            })
          : intl.formatMessage({
              id: 'forecast_active',
              defaultMessage: 'Now',
            })}
      </div>
      <div className={priceClassList}>
        <USDDisplay value={+activePrice} />
      </div>
    </div>
  );
};

DynamicPrice.propTypes = {
  postPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  quotes: PropTypes.shape({}).isRequired,
  secur: PropTypes.string.isRequired,
  closedPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

DynamicPrice.defaultProps = {
  closedPrice: 0,
};

const mapStateToProps = state => ({
  quotes: state.quotes,
});

export default injectIntl(connect(mapStateToProps)(DynamicPrice));

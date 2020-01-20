import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {injectIntl} from 'react-intl';

import USDDisplay from '../../../client/components/Utils/USDDisplay';

const DynamicPrice = ({postPrice, quotes, secur, closedPrice, intl}) => {
  const price = quotes[secur].bidPrice;
  const activePrice = closedPrice || price;
  const rise = postPrice < activePrice;
  const priceClassList = classNames("forecastCard__price", {
    'forecastCard__price--fall': !rise,
    'forecastCard__price--rise': rise,
  });

  return (
    <div className="forecastCard__val">
      <div>
        {
          closedPrice
            ? (
              intl.formatMessage({
                id: 'forecast_closed',
                defaultMessage: 'Closed'
              })
            ) : (
              intl.formatMessage({
                id: 'forecast_active',
                defaultMessage: 'Now'
              })
            )
        }
      </div>
      <div className={priceClassList}>
        <USDDisplay value={+activePrice}/>
      </div>
    </div>
  )
};

DynamicPrice.propTypes = {
  postPrice: PropTypes.number.isRequired,
  quotes: PropTypes.shape().isRequired,
  secur: PropTypes.string.isRequired,
  closedPrice: PropTypes.number.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};
const mapStateToProps = state => ({
  quotes: state.quotes
});

export default injectIntl(connect(mapStateToProps)(DynamicPrice));

import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import USDDisplay from '../../../client/components/Utils/USDDisplay';
import DynamicPrice from './DynamicPrice';

const DynamicPriceWrapper = ({ postPrice, secur, closedPrice }) => {
  const rise = postPrice < closedPrice;
  const priceClassList = classNames('ForecastCard__price', {
    'ForecastCard__price--fall': !rise,
    'ForecastCard__price--rise': rise,
  });

  return (
    <div className="ForecastCard__val">
      <div>
        {closedPrice ? (
          <FormattedMessage id="forecast_closed" defaultMessage="Closed" />
        ) : (
          <FormattedMessage id="forecast_active" defaultMessage="Now" />
        )}
      </div>
      <div className={priceClassList}>
        {closedPrice ? (
          <span title={closedPrice}>
            <USDDisplay value={+closedPrice} />
          </span>
        ) : (
          <DynamicPrice postPrice={postPrice} security={secur} />
        )}
      </div>
    </div>
  );
};

DynamicPriceWrapper.propTypes = {
  postPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  secur: PropTypes.string.isRequired,
  closedPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
};

DynamicPriceWrapper.defaultProps = {
  closedPrice: 0,
};

export default injectIntl(DynamicPriceWrapper);

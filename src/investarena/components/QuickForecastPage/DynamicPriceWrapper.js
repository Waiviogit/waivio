import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {injectIntl} from "react-intl";
import USDDisplay from "../../../client/components/Utils/USDDisplay";
import DynamicPrice from "./DynamycPrice";

const DynamicPriceWrapper = ({ postPrice, secur, closedPrice, intl }) => {
  const rise = postPrice < closedPrice;
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
        {closedPrice
          ? (<USDDisplay value={+closedPrice}/>)
          : (<DynamicPrice postPrice={postPrice} security={secur}/>)
        }
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

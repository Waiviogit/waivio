import { FormattedNumber } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import './CurrencyItem.less';

const CurrencyItem = ({ item, isSmall }) => {
  return (
    <div className="CurrencyItem">
      <i className="CurrencyItem__beaxy-icon" style={{ backgroundImage: `url(${item.logoUrl})` }} />
      {!isSmall && (
        <div className="CurrencyItem__label">
          <div>{item.name}</div>
        </div>
      )}
      <div className="CurrencyItem__value">
        <span>
          <FormattedNumber value={item.balance ? item.balance : 0} />
          {` ${item.currency}`}
        </span>
      </div>
    </div>
  );
};

CurrencyItem.propTypes = {
  item: PropTypes.shape().isRequired,
  isSmall: PropTypes.bool,
};

CurrencyItem.defaultProps = {
  isSmall: false,
};

export default CurrencyItem;

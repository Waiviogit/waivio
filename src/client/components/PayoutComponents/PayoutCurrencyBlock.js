import React from 'react';
import PropTypes from 'prop-types';
import USDDisplay from '../Utils/USDDisplay';

import './PayoutCurrencyBlock.less';

const PayoutCurrencyBlock = props => (
  <React.Fragment>
    <div className="PayoutCurrencyBlock__currency">
      <div>
        HBD: <USDDisplay value={props.HBDPayout} currencyDisplay="symbol" />
      </div>
      <div>
        WAIV: <USDDisplay value={props.WAIVPayout} currencyDisplay="symbol" />
      </div>
    </div>
    <div className="PayoutCurrencyBlock__total">
      <span>Total:</span>{' '}
      <b>
        <USDDisplay value={props.totalPayout} currencyDisplay="symbol" />
      </b>
    </div>
  </React.Fragment>
);

PayoutCurrencyBlock.propTypes = {
  totalPayout: PropTypes.number.isRequired,
  WAIVPayout: PropTypes.number.isRequired,
  HBDPayout: PropTypes.number.isRequired,
};

export default PayoutCurrencyBlock;

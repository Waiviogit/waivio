import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import USDDisplay from '../../Utils/USDDisplay';

import './PayoutCurrencyBlock.less';

const PayoutCurrencyBlock = props => (
  <React.Fragment>
    <div className="PayoutCurrencyBlock__currency">
      <div className="PayoutCurrencyBlock__waiv">
        WAIV: <USDDisplay value={props.WAIVPayout} currencyDisplay="symbol" />
      </div>
      <div>
        HIVE: <USDDisplay value={props.HIVEPayout} currencyDisplay="symbol" />
      </div>
      <div>
        HBD: <USDDisplay value={props.HBDPayout} currencyDisplay="symbol" />
      </div>
    </div>
    <div className="PayoutCurrencyBlock__total">
      <span tab={props.intl.formatMessage({ id: 'total', defaultMessage: 'Total' })}>Total:</span>{' '}
      <USDDisplay value={props.totalPayout} currencyDisplay="symbol" />
    </div>
  </React.Fragment>
);

PayoutCurrencyBlock.propTypes = {
  intl: PropTypes.shape().isRequired,
  totalPayout: PropTypes.number.isRequired,
  WAIVPayout: PropTypes.number.isRequired,
  HBDPayout: PropTypes.number.isRequired,
  HIVEPayout: PropTypes.number.isRequired,
};

export default PayoutCurrencyBlock;
injectIntl(PayoutCurrencyBlock);

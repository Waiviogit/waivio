import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import TradeButton from '../TradeButton';
import { exponentialToDecimal } from '../../platform/platformHelper';
import './TradingForm.less';

const TradingForm = ({ direction }) => {
  const amountAvailable = 100;
  const termCurrency = 'BTC';
  const baseCurrency = 'GO';
  const feeCurrency = direction === 'buy' ? baseCurrency : termCurrency;
  const totalValue = exponentialToDecimal(0.0000515);
  const feeValue = exponentialToDecimal(0.00000013);
  return (
    <div className={`st-trading-form ${direction}`}>
      <div className="st-trading-form-header">
        <div className="flex-info-block">
          <i className="iconfont icon-prompt info-icon" />
          <FormattedMessage id="trading_form_available" defaultMessage="Available" />:&nbsp;&nbsp;
          <span className="fw5">{amountAvailable}&nbsp;{termCurrency}</span>
        </div>
      </div>

      <div className="st-trading-form__row amount">
        Amount input
      </div>

      <div className="st-trading-form__row button">
        <TradeButton type={direction} />
      </div>

      <div className="st-trading-form-footer">
        <div className="flex-info-block">
          <i className="iconfont icon-prompt info-icon" />
          <FormattedMessage id="trading_form_" defaultMessage="Total" />&nbsp;≈&nbsp;
          <span className="fw5">{totalValue}&nbsp;{termCurrency}</span>
        </div>
        <div className="flex-info-block">
          <i className="iconfont icon-prompt info-icon" />
          <FormattedMessage id="trading_form_" defaultMessage="Fee" />&nbsp;≈&nbsp;
          <span className="fw5">{feeValue}&nbsp;{feeCurrency}</span>
        </div>
      </div>
    </div>
  );
};

TradingForm.propTypes = {
  direction: PropTypes.oneOf(['buy', 'sell']).isRequired,
};

export default TradingForm;

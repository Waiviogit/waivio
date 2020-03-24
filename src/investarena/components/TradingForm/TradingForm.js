import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import TradeButton from '../TradeButton';
import { exponentialToDecimal } from '../../platform/platformHelper';
import withTrade from '../HOC/withTrade';
import './TradingForm.less';

const TradingForm = ({ amount, direction, quoteSettings, handleChangeInput }) => {
  const { baseCurrency, termCurrency } = quoteSettings;
  const amountAvailable = 100;
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

      <div className="flex-info-block justify-content-center">
        <FormattedMessage id="trading_form_amount" defaultMessage="Amount" />:&nbsp;
        <div className="trading_form_amount__input">
          <input type="text" value={amount} onChange={handleChangeInput}/>
        </div>
        <span>{baseCurrency}</span>
      </div>

      <div>
        <TradeButton type={direction} />
      </div>

      <div className="st-trading-form-footer">
        <div className="flex-info-block">
          <i className="iconfont icon-prompt info-icon" />
          <FormattedMessage id="trading_form_total" defaultMessage="Total" />&nbsp;≈&nbsp;
          <span className="fw5">{totalValue}&nbsp;{termCurrency}</span>
        </div>
        <div className="flex-info-block">
          <i className="iconfont icon-prompt info-icon" />
          <FormattedMessage id="trading_form_fee" defaultMessage="Fee" />&nbsp;≈&nbsp;
          <span className="fw5">{feeValue}&nbsp;{feeCurrency}</span>
        </div>
      </div>
    </div>
  );
};

TradingForm.propTypes = {
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  direction: PropTypes.oneOf(['buy', 'sell']).isRequired,
  // quoteSecurity: PropTypes.string.isRequired, // pass to withTrade
  quoteSettings: PropTypes.shape({
    baseCurrency: PropTypes.string.isRequired,
    termCurrency: PropTypes.string.isRequired,
  }).isRequired,
  handleChangeInput: PropTypes.func.isRequired,
};

export default withTrade(TradingForm);

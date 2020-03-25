import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import TradeButton from '../TradeButton';
import { PlatformHelper } from '../../platform/platformHelper';
import withTrade from '../HOC/withTrade';
import './TradingForm.less';

const TradingForm = ({ amount, side, fees, quoteSettings, handleChangeInput, createMarketOrder }) => {
  const { baseCurrency, termCurrency } = quoteSettings;
  const amountAvailable = 100;
  const feeCurrency = side === 'buy' ? baseCurrency : termCurrency;
  const totalValue = PlatformHelper.exponentialToDecimal(0.0000515);

  const handleTradeButtonClick = () => {
    createMarketOrder(side, amount);
  };
  return (
    <div className={`st-trading-form ${side}`}>
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
        <TradeButton type={side} onClick={handleTradeButtonClick} />
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
          <span className="fw5">{fees.takerFee}&nbsp;{feeCurrency}</span>
        </div>
      </div>
    </div>
  );
};

TradingForm.propTypes = {
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  side: PropTypes.oneOf(['buy', 'sell']).isRequired,
  // quoteSecurity: PropTypes.string.isRequired, // pass to withTrade
  fees: PropTypes.shape({
    makerFee: PropTypes.string,
    takerFee: PropTypes.string,
  }).isRequired,
  quoteSettings: PropTypes.shape({
    baseCurrency: PropTypes.string.isRequired,
    termCurrency: PropTypes.string.isRequired,
  }).isRequired,
  handleChangeInput: PropTypes.func.isRequired,
  createMarketOrder: PropTypes.func.isRequired,
};

export default withTrade(TradingForm);

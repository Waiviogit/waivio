import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import TradeButton from '../TradeButton';
import { PlatformHelper } from '../../platform/platformHelper';
import withTrade from '../HOC/withTrade';
import './TradingForm.less';

const TradingForm = ({
  amount,
  caller,
  side,
  fees,
  quoteSettings,
  isWalletsExist,
  wallet,
  handleChangeInput,
  createMarketOrder,
}) => {
  const { baseCurrency, termCurrency } = quoteSettings;
  const feeCurrency = side === 'buy' ? baseCurrency : termCurrency;
  const totalValue = PlatformHelper.exponentialToDecimal(0.0000515);

  const handleTradeButtonClick = () => {
    createMarketOrder(side, amount, caller);
  };
  return (
    <div className={`st-trading-form ${side}`}>
      <div className="st-trading-form-header">
        <div className="flex-info-block">
          <i className="iconfont icon-prompt info-icon" />
          <FormattedMessage id="trading_form_available" defaultMessage="Available" />
          :&nbsp;&nbsp;
          <span className="fw5">
            {`${wallet.balance} ${wallet.currency}`}
          </span>
        </div>
      </div>

      <div className="flex-info-block justify-content-center">
        <FormattedMessage id="trading_form_amount" defaultMessage="Amount" />
        :&nbsp;
        <div className="trading_form_amount__input">
          <input type="text" value={amount} onChange={handleChangeInput} disabled={!isWalletsExist}/>
        </div>
        <span>{baseCurrency}</span>
      </div>

      <div className="st-trading-form__button-wrap">
        <TradeButton size="large" type={side} onClick={handleTradeButtonClick}>
          {`${amount} ${baseCurrency} ${side}`}
        </TradeButton>
      </div>

      <div className="st-trading-form-footer">
        <div className="flex-info-block">
          <i className="iconfont icon-prompt info-icon" />
          <FormattedMessage id="trading_form_total" defaultMessage="Total" />
          &nbsp;≈&nbsp;
          <span className="fw5">
            {totalValue}&nbsp;{termCurrency}
          </span>
        </div>
        <div className="flex-info-block">
          <i className="iconfont icon-prompt info-icon" />
          <FormattedMessage id="trading_form_fee" defaultMessage="Fee" />
          &nbsp;≈&nbsp;
          <span className="fw5">
            {fees.takerFee}&nbsp;{feeCurrency}
          </span>
        </div>
      </div>
    </div>
  );
};

TradingForm.propTypes = {
  /* passed props */
  caller: PropTypes.string.isRequired,
  // quoteSecurity: PropTypes.string.isRequired, // pass to withTrade
  side: PropTypes.oneOf(['buy', 'sell']).isRequired,

  /* withTrade */
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  fees: PropTypes.shape({
    makerFee: PropTypes.string,
    takerFee: PropTypes.string,
  }).isRequired,
  quoteSettings: PropTypes.shape({
    baseCurrency: PropTypes.string.isRequired,
    termCurrency: PropTypes.string.isRequired,
  }).isRequired,
  isWalletsExist: PropTypes.bool.isRequired,
  wallet: PropTypes.shape({
    id: PropTypes.string,
    value: PropTypes.number,
    name: PropTypes.string,
    balance: PropTypes.number,
    currency: PropTypes.string,
    logoName: PropTypes.string,
    logoUrl: PropTypes.string,
  }).isRequired,
  handleChangeInput: PropTypes.func.isRequired,
  createMarketOrder: PropTypes.func.isRequired,
};

export default withTrade(TradingForm);

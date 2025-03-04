import React from 'react';
import { FormattedNumber } from 'react-intl';
import PropTypes from 'prop-types';
import USDDisplay from '../../../components/Utils/USDDisplay';
import { getProxyImageURL } from '../../../../common/helpers/image';
import { HIVE_ENGINE_DEFAULT_SWAP_LIST } from '../../../../common/constants/swapList';
import WalletActionEngine from '../../WalletSummaryInfo/components/WalletAction/WalletActionEngine';
import { toFixed } from '../../../../common/helpers/formatter';

import './HiveEngineCurrencyItem.less';

const HiveEngineCurrencyItem = ({ token, rates }) => {
  const stake = token.stake || 0;
  const balance = HIVE_ENGINE_DEFAULT_SWAP_LIST.includes(token.symbol)
    ? (Number(token.balance) + Number(stake)) * rates[token.symbol]
    : (Number(token.balance) + Number(stake)) * rates[token.symbol] * rates.HIVE;
  const isSwapSymbol = token.symbol?.includes('SWAP');
  const minAmount = 0.001;
  const showItem =
    isSwapSymbol || (!isSwapSymbol && (token.balance >= minAmount || token.stake >= minAmount));
  const avatar = token.avatar ? getProxyImageURL(token.avatar) : token.avatar;

  return (
    showItem && (
      <div key={token.symbol} className="HiveEngineCurrencyItem">
        <img src={avatar} alt="" className="HiveEngineCurrencyItem__avatar" />
        <div className="HiveEngineCurrencyItem__info">
          <div className="HiveEngineCurrencyItem__row HiveEngineCurrencyItem__row--paddingBottom">
            <span>
              {token.symbol} (<USDDisplay currencyDisplay="symbol" value={balance} />)
            </span>
            <span>
              {token.stakingEnabled && (
                <span className="HiveEngineCurrencyItem__shadow">liquid: </span>
              )}
              <span className="HiveEngineCurrencyItem__bold">
                <FormattedNumber value={toFixed(token.balance, 1000)} maximumFractionDigits={3} />
              </span>{' '}
              {token.symbol}
            </span>
          </div>
          <div className="HiveEngineCurrencyItem__row">
            <span className="HiveEngineCurrencyItem__shadow">{token.name}</span>
            {token.stakingEnabled && (
              <span>
                <span className="HiveEngineCurrencyItem__shadow">staked: </span>
                <span className="HiveEngineCurrencyItem__bold">
                  <FormattedNumber value={toFixed(token.stake, 1000)} maximumFractionDigits={3} />
                </span>{' '}
                {token.symbol}
              </span>
            )}
            {token.orderKey && Boolean(+token.balance) && (
              <WalletActionEngine
                withdrawCurrencyOption={[token.symbol.replace('SWAP.', '')]}
                mainCurrency={token.symbol}
                options={['swap']}
              />
            )}
          </div>
        </div>
      </div>
    )
  );
};

HiveEngineCurrencyItem.propTypes = {
  token: PropTypes.shape({
    balance: PropTypes.string,
    orderKey: PropTypes.number,
    name: PropTypes.string,
    rate: PropTypes.number,
    symbol: PropTypes.string,
    avatar: PropTypes.string,
    stake: PropTypes.string,
    stakingEnabled: PropTypes.bool,
  }).isRequired,
  rates: PropTypes.shape({
    HIVE: PropTypes.number,
  }).isRequired,
};

export default HiveEngineCurrencyItem;

import React from 'react';
import { FormattedNumber } from 'react-intl';
import PropTypes from 'prop-types';
import USDDisplay from '../../../components/Utils/USDDisplay';

import './HiveEngineCurrencyItem.less';

const HiveEngineCurrencyItem = ({ token, hiveRate }) => {
  const balance = (Number(token.balance) + Number(token.stake)) * token.rate * hiveRate;

  return (
    <div key={token.symbol} className="HiveEngineCurrencyItem">
      <img src={token.avatar} alt="" className="HiveEngineCurrencyItem__avatar" />
      <div className="HiveEngineCurrencyItem__info">
        <div className="HiveEngineCurrencyItem__row">
          <span>
            {token.symbol} (<USDDisplay currencyDisplay="symbol" value={balance} />)
          </span>
          <span>
            {token.stakingEnabled && (
              <span className="HiveEngineCurrencyItem__shadow">liquid: </span>
            )}
            <span className="HiveEngineCurrencyItem__bold">
              <FormattedNumber value={token.balance} maximumFractionDigits={3} />
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
                <FormattedNumber value={token.stake} maximumFractionDigits={3} />
              </span>{' '}
              {token.symbol}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

HiveEngineCurrencyItem.propTypes = {
  token: PropTypes.shape({
    balance: PropTypes.string,
    name: PropTypes.string,
    rate: PropTypes.number,
    symbol: PropTypes.string,
    avatar: PropTypes.string,
    stake: PropTypes.string,
    stakingEnabled: PropTypes.bool,
  }).isRequired,
  hiveRate: PropTypes.number.isRequired,
};

export default HiveEngineCurrencyItem;

import React from 'react';
import { FormattedNumber } from 'react-intl';
import PropTypes from 'prop-types';
import USDDisplay from '../../../components/Utils/USDDisplay';
import { getProxyImageURL } from '../../../../common/helpers/image';
import WalletAction from '../../WalletSummaryInfo/components/WalletAction/WalletActions';

import './HiveEngineCurrencyItem.less';
import { HIVE_ENGINE_DEFAULT_SWAP_LIST } from '../../../../common/constants/swapList';

const HiveEngineCurrencyItem = ({ token, hiveRate }) => {
  const stake = token.stake || 0;
  const balance = HIVE_ENGINE_DEFAULT_SWAP_LIST.includes(token.symbol)
    ? (Number(token.balance) + Number(stake)) * token.rate
    : (Number(token.balance) + Number(stake)) * token.rate * hiveRate;

  const avatar = token.avatar ? getProxyImageURL(token.avatar) : token.avatar;

  return (
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
          {token.orderKey && token.symbol !== 'SWAP.ETH' && Boolean(token.balance) && (
            <WalletAction mainKey={'withdraw'} mainCurrency={token.symbol} options={['swap']} />
          )}
        </div>
      </div>
    </div>
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
  hiveRate: PropTypes.number.isRequired,
};

export default HiveEngineCurrencyItem;

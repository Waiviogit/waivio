import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { round, get, isNil } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';
import classNames from 'classnames';

import WalletSummaryInfo from '../WalletSummaryInfo/WalletSummaryInfo';
import {
  getTokenRatesInUSD,
  getUserCurrencyBalance,
} from '../../../store/walletStore/walletSelectors';
import Loading from '../../components/Icon/Loading';
import { resetTokenBalance } from '../../../store/walletStore/walletActions';

const WAIVWalletSummaryInfo = props => {
  const balance = +get(props.currencyInfo, 'balance', 0);
  const stake = +get(props.currencyInfo, 'stake', 0);
  const unstake = +get(props.currencyInfo, 'pendingUnstake', 0);
  const delegationsIn = +get(props.currencyInfo, 'delegationsIn', 0);
  const delegationsOut = +get(props.currencyInfo, 'delegationsOut', 0);
  const estAccValue = props.rates * (Number(balance) + Number(stake));
  const delegation = delegationsIn - delegationsOut;
  const powerClassList = classNames('WalletSummaryInfo__value', {
    'WalletSummaryInfo__value--unstake': unstake,
  });

  useEffect(() => () => props.resetTokenBalance(), []);

  const formattedNumber = num => {
    if (isNil(num)) return <Loading />;

    return <FormattedNumber value={round(num, 3)} />;
  };

  return (
    <WalletSummaryInfo estAccValue={estAccValue}>
      <div className="WalletSummaryInfo__itemWrap">
        <div className="WalletSummaryInfo__item">
          <img
            className="WalletSummaryInfo__icon waiv"
            src="https://waivio.nyc3.digitaloceanspaces.com/1633000477_5d88f63a-80e0-4882-92c8-ad7d0ce36dcf"
            alt="hive"
          />
          <div className="WalletSummaryInfo__label">WAIV</div>
          <div className="WalletSummaryInfo__value">{formattedNumber(balance)} WAIV</div>
        </div>
        <p className="WalletSummaryInfo__description">Liquid WAIV tokens</p>
      </div>
      <div className="WalletSummaryInfo__itemWrap">
        <div className="WalletSummaryInfo__item">
          <i className="iconfont icon-flashlight_fill WalletSummaryInfo__icon" />
          <div className="WalletSummaryInfo__label">WAIV Power</div>
          <div className={powerClassList}>
            {formattedNumber(stake)}
            {!!unstake && <span> - {formattedNumber(unstake)}</span>}{' '}
            {!!delegation && (
              <span>
                ({delegation > 0 && '+'}
                {formattedNumber(delegation)})
              </span>
            )}{' '}
            WP
          </div>
        </div>
        <p className="WalletSummaryInfo__description">Staked WAIV tokens</p>
      </div>
    </WalletSummaryInfo>
  );
};

WAIVWalletSummaryInfo.propTypes = {
  currencyInfo: PropTypes.shape({}).isRequired,
  resetTokenBalance: PropTypes.func.isRequired,
  rates: PropTypes.number.isRequired,
};

export default connect(
  state => ({
    currencyInfo: getUserCurrencyBalance(state, 'WAIV'),
    rates: getTokenRatesInUSD(state, 'WAIV'),
  }),
  {
    resetTokenBalance,
  },
)(WAIVWalletSummaryInfo);

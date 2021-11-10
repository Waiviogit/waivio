import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { round } from 'lodash';
import PropTypes from 'prop-types';

import WalletSummaryInfo from '../../WalletSummaryInfo/WalletSummaryInfo';
import { getTokenRatesInUSD } from '../../../../store/walletStore/walletSelectors';
import Loading from '../../../components/Icon/Loading';
import { getTokenBalance } from '../../../../waivioApi/ApiClient';

const WAIVWalletSummaryInfo = props => {
  const [currencyInfo, setCurrencyInfo] = useState({});
  const rates = useSelector(state => getTokenRatesInUSD(state, 'WAIV'));
  const estAccValue = rates * (Number(currencyInfo.balance) + Number(currencyInfo.stake));

  useEffect(() => {
    getTokenBalance('WAIV', props.name).then(res => setCurrencyInfo(res));
  }, []);

  const formattedNumber = num => {
    if (!num) return <Loading />;
    const precision = num > 0.01 || num === 0 ? 2 : 3;

    return round(num, precision);
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
          <div className="WalletSummaryInfo__value">
            {formattedNumber(currencyInfo.balance)} WAIV
          </div>
        </div>
        <p className="WalletSummaryInfo__description">Liquid WAIV tokens</p>
      </div>
      <div className="WalletSummaryInfo__itemWrap">
        <div className="WalletSummaryInfo__item">
          <i className="iconfont icon-flashlight_fill WalletSummaryInfo__icon" />
          <div className="WalletSummaryInfo__label">WAIV Power</div>
          <div className="WalletSummaryInfo__value">{formattedNumber(currencyInfo.stake)} WP</div>
        </div>
        <p className="WalletSummaryInfo__description">Staked WAIV tokens</p>
      </div>
    </WalletSummaryInfo>
  );
};

WAIVWalletSummaryInfo.propTypes = {
  name: PropTypes.string.isRequired,
};

export default WAIVWalletSummaryInfo;

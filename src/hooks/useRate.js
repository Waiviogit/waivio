import { useSelector } from 'react-redux';
import { get } from 'lodash';
import { getCryptosPriceHistory } from '../store/appStore/appSelectors';
import { getTokensBalanceListForTransfer } from '../store/walletStore/walletSelectors';

const useRate = () => {
  const cryptosPriceHistory = useSelector(getCryptosPriceHistory);
  const hiveRateInUsd = get(cryptosPriceHistory, 'hive.usdPriceHistory.usd', null);
  const tokensList = useSelector(getTokensBalanceListForTransfer);
  const rates = tokensList.reduce((acc, curr) => {
    acc[curr.symbol] = curr.rate;

    return acc;
  }, {});

  return {
    hiveRateInUsd,
    rates,
  };
};

export default useRate;

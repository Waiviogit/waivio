import React from 'react';
import { useSelector } from 'react-redux';
import { getCurrentWalletType } from '../../../../store/walletStore/walletSelectors';
import HiveWalletSidebar from './HiveWalletSidebar';
import CryptoTrendingCharts from '../CryptoTrendingCharts';
import { HBD, HIVE, WAIV } from '../../../../common/constants/cryptos';

const WalletSidebarSwitcher = () => {
  const type = useSelector(getCurrentWalletType);
  const cryptos = [WAIV.symbol, HIVE.symbol, HBD.symbol];

  switch (type) {
    case 'HIVE':
      return <HiveWalletSidebar cryptos={cryptos} />;

    default:
      return <CryptoTrendingCharts cryptos={cryptos} />;
  }
};

export default WalletSidebarSwitcher;

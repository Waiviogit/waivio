import React from 'react';
import HiveWalletSidebar from './HiveWalletSidebar';
import { HBD, HIVE, WAIV } from '../../../../common/constants/cryptos';

const WalletSidebarSwitcher = () => {
  const cryptos = [WAIV.symbol, HIVE.symbol, HBD.symbol];

  return <HiveWalletSidebar cryptos={cryptos} />;
};

export default WalletSidebarSwitcher;

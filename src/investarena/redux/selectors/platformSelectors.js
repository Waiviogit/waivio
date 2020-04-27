import { createSelector } from 'reselect';
import { isEmpty } from 'lodash';
import { makeGetQuoteSettingsState } from './quotesSettingsSelectors';

// selector
const getPlatformState = state => state.platform;
// reselect function
export const getIsConnectPlatformState = createSelector(
  [getPlatformState],
  platform => platform.connect,
);
export const getIsLoadingPlatformState = createSelector(
  [getPlatformState],
  platform => platform.isLoading,
);
export const getPlatformNameState = createSelector(
  [getPlatformState],
  platform => platform.platformName,
);
export const makePlatformUserStatisticsState = () =>
  createSelector(
    getPlatformState,
    (state, props) => props.balanceType,
    (platform, balanceType) => platform.userStatistics[balanceType],
  );
export const getPlatformCurrentAccountState = createSelector(
  [getPlatformState],
  platform => platform.currentAccountName,
);
export const getPlatformUserAccountsState = createSelector(
  [getPlatformState],
  platform => platform.accounts,
);
export const getPlatformAccountCurrencyState = createSelector(
  [getPlatformState],
  platform => platform.accountCurrency,
);
export const getUserWalletState = createSelector(
  [getPlatformState],
  platform => platform.userWallet,
);
export const makeUserWalletState = () =>
  createSelector(
    makeGetQuoteSettingsState(),
    getUserWalletState,
    (state, props) => props.side,
    (quoteSetting, wallet, side) => {
      if (quoteSetting && !isEmpty(wallet) && (side === 'buy' || side === 'sell')) {
        const walletCurrency =
          side === 'buy' ? quoteSetting.termCurrency : quoteSetting.baseCurrency;
        const userWallet = wallet.find(w => w.currency === walletCurrency);
        return userWallet || { balance: 0, currency: walletCurrency };
      }
      return null;
    },
  );
export const makeIsWalletsExistState = () =>
  createSelector(makeGetQuoteSettingsState(), getUserWalletState, (quoteSetting, wallet) => {
    if (quoteSetting && !isEmpty(wallet)) {
      const { baseCurrency, termCurrency } = quoteSetting;
      const baseCurrencyWallet = wallet.find(w => w.currency === baseCurrency);
      const termCurrencyWallet = wallet.find(w => w.currency === termCurrency);
      return {
        [baseCurrency]: Boolean(baseCurrencyWallet),
        [termCurrency]: Boolean(termCurrencyWallet),
        both: Boolean(baseCurrencyWallet && termCurrencyWallet),
      };
    }
    return false;
  });

import { get } from 'lodash';
import { createSelector } from 'reselect';

import getWeightHelper from '../../client/helpers/appHelper';

// selector
export const appState = state => state.app;

// reselect function
export const getRate = createSelector([appState], state => state.rate);

export const getIsTrendingTopicsLoading = createSelector(
  [appState],
  state => state.trendingTopicsLoading,
);

export const getRewardFund = createSelector([appState], state => state.rewardFund);

export const getRewardFundRecentClaims = createSelector(
  [getRewardFund],
  state => state.recent_claims,
);

export const getRewardBalance = createSelector([getRewardFund], state => state.reward_balance);

export const getIsFetching = createSelector([appState], state => state.isFetching);

export const getIsBannerClosed = createSelector([appState], state => state.bannerClosed);

export const getAppUrl = createSelector([appState], state => state.appUrl);

export const getUsedLocale = createSelector([appState], state => state.usedLocale);

export const getScreenSize = createSelector([appState], state => state.screenSize);

export const getTranslations = createSelector([appState], state => state.translations);

export const getTranslationByKey = (key, defaultMessage = '') =>
  createSelector(getTranslations, translations => get(translations, key, defaultMessage));

export const getCryptosPriceHistory = createSelector([appState], state =>
  get(state, 'cryptosPriceHistory'),
);

export const getShowPostModal = createSelector([appState], state => state.showPostModal);

export const getCurrentShownPost = createSelector([appState], state => state.currentShownPost);

export const getIsMobile = createSelector([appState], state => state.isMobile);

export const getCurrPage = createSelector([appState], state => state.currPage);

export const getCurrentHost = createSelector([appState], state => state.appUrl);

export const getMapForMainPage = createSelector([appState], state => state.currMap);

export const getWebsiteConfiguration = createSelector([appState], state => state.configuration);

export const getConfigurationValues = createSelector([appState], state => state.configuration);

export const getWebsiteLogo = createSelector([appState], state => state.logo);

export const getWebsiteMainMap = createSelector([appState], state => state.currMap);

export const getIsWaivio = createSelector([appState], state => state.isWaivio);

export const getReserveCounter = createSelector([appState], state => state.reservedCounter);

export const getWebsiteBeneficiary = createSelector([appState], state => state.websiteBeneficiary);

export const getWebsiteParentHost = createSelector([appState], state => state.parentHost);

export const getHelmetIcon = createSelector([appState], state => state.helmetIcon);

export const getHostAddress = createSelector([appState], state => state.hostAddress);

export const getCurrentCurrency = createSelector([appState], state => state.currencyInfo);

export const getIsDiningGifts = createSelector([appState], state => state.isDiningGifts);

export const getWebsiteName = createSelector([appState], state => state.websiteName);

export const getWeightValue = createSelector(
  getRate,
  getRewardFund,
  getRewardFundRecentClaims,
  getRewardBalance,
  (state, weight) => weight,
  (rate, rewardFund, recentClaims, rewardBalance, weight) =>
    getWeightHelper(rate, rewardFund, recentClaims, rewardBalance, weight),
);

export const getIsEngLocale = createSelector([getUsedLocale], locale => locale === 'en-US');

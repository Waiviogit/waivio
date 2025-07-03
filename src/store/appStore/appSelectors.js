import { get } from 'lodash';
import { createSelector } from 'reselect';

import getWeightHelper from '../../common/helpers/appHelper';

// selector
export const appState = state => state.app;

// reselect function
export const getRate = createSelector([appState], state => state.rate);
export const getSafeLinksFromState = createSelector([appState], state => state.safeLinks);

export const getIsTrendingTopicsLoading = createSelector(
  [appState],
  state => state.trendingTopicsLoading,
);

export const getRewardFund = createSelector([appState], state => state.rewardFund);

// use only this
export const getAppHost = createSelector([appState], state => state.appHost);

export const getUserAdministrator = createSelector([appState], state => state.isUserAdministrator);

export const getRewardFundRecentClaims = createSelector(
  [getRewardFund],
  state => state.recent_claims,
);

export const getRewardBalance = createSelector([getRewardFund], state => state.reward_balance);

export const getIsFetching = createSelector([appState], state => state.isFetching);

export const getIsBannerClosed = createSelector([appState], state => state.bannerClosed);

export const getAppUrl = createSelector([appState], state => state.appUrl);

export const getMainObj = createSelector([appState], state => state.mainObj);

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

export const getWebsiteConfiguration = createSelector([appState], state => state?.configuration);

export const getWebsiteLanguage = createSelector([appState], state => state?.websiteLanguage);

export const getConfigurationValues = createSelector([appState], state => state.configuration);

export const getWebsiteLogo = createSelector([appState], state => state.logo);

export const getInfoLoaded = createSelector([appState], state => state.infoLoaded);

export const getShopSettings = createSelector(
  [appState],
  state => state.configuration?.shopSettings,
);

export const getIsSocial = createSelector([appState], state => state.isSocial);

export const getWebsiteColors = createSelector([getWebsiteConfiguration], state => state.colors);

export const getWebsiteNameForHeader = createSelector(
  [getWebsiteConfiguration],
  state => state.header?.name,
);

export const getWebsiteDefaultIconList = createSelector(
  [getWebsiteConfiguration],
  state => state.defaultListImage,
);

export const getWebsiteStartPage = createSelector(
  [getWebsiteConfiguration],
  state => state.header?.startup || 'map',
);

export const getWebsiteMainMap = createSelector([appState], state => state.currMap);

export const getIsWaivio = createSelector([appState], state => state.isWaivio);

export const getReserveCounter = createSelector([appState], state => state.reservedCounter);

export const getWebsiteBeneficiary = createSelector([appState], state => state.websiteBeneficiary);

export const getWebsiteParentHost = createSelector([appState], state => state.parentHost);

export const getHelmetIcon = createSelector([appState], state => state.helmetIcon);

export const getHostAddress = createSelector([appState], state => state.hostAddress);

export const getSiteName = createSelector(
  [appState],
  state => state?.websiteName || state?.host || '',
);

export const getCurrentCurrency = createSelector([appState], state => state.currencyInfo);
export const getCurrency = createSelector([appState], state => state.currency);
export const getSiteTrusties = createSelector([appState], state => state.trustedAll);

export const getIsDiningGifts = createSelector([appState], state => state.isDiningGifts);
export const getIsSocialGifts = createSelector([appState], state => state.isSocialGifts);

export const getWebsiteName = createSelector([appState], state => state.websiteName);

export const getNavigItems = createSelector([appState], state => state.navigItems);

export const getSettingsLoading = createSelector([appState], state => state.settingsLoading);
export const getFacebookAuthId = createSelector([appState], state => state.facebookAuthId);
export const getGoogleAuthId = createSelector([appState], state => state.googleAuthId);
export const getAppAgent = createSelector([appState], state => state.appAgent);

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

import {
  getAppUrl,
  getCryptosPriceHistory,
  getCurrentShownPost,
  getIsBannerClosed,
  getIsFetching,
  getIsTrendingTopicsLoading,
  getRate,
  getRewardFund,
  getScreenSize,
  getShowPostModal,
  getTranslations,
  getUsedLocale,
} from '../../store/appStore/appSelectors';

jest.mock('../../vendor/steemitHelpers.js', () => {});

describe('fromApp', () => {
  let state;

  beforeEach(() => {
    state = {
      app: {
        rate: 'rate',
        trendingTopicsLoading: 'trendingTopicsLoading',
        rewardFund: 'rewardFund',
        trendingTopics: 'trendingTopics',
        isFetching: 'isFetching',
        bannerClosed: 'bannerClosed',
        appUrl: 'appUrl',
        usedLocale: 'usedLocale',
        screenSize: 'screenSize',
        translations: 'translations',
        cryptosPriceHistory: 'cryptosPriceHistory',
        showPostModal: 'showPostModal',
        currentShownPost: 'currentShownPost',
      },
    };
  });

  it('Should return rate', () => {
    expect(getRate(state)).toBe('rate');
  });

  it('Should return trendingTopicsLoading', () => {
    expect(getIsTrendingTopicsLoading(state)).toBe('trendingTopicsLoading');
  });

  it('Should return rewardFund', () => {
    expect(getRewardFund(state)).toBe('rewardFund');
  });

  it('Should return isFetching', () => {
    expect(getIsFetching(state)).toBe('isFetching');
  });

  it('Should return bannerClosed', () => {
    expect(getIsBannerClosed(state)).toBe('bannerClosed');
  });

  it('Should return appUrl', () => {
    expect(getAppUrl(state)).toBe('appUrl');
  });

  it('Should return usedLocale', () => {
    expect(getUsedLocale(state)).toBe('usedLocale');
  });

  it('Should return screenSize', () => {
    expect(getScreenSize(state)).toBe('screenSize');
  });

  it('Should return translations', () => {
    expect(getTranslations(state)).toBe('translations');
  });

  it('Should return cryptosPriceHistory', () => {
    expect(getCryptosPriceHistory(state)).toBe('cryptosPriceHistory');
  });

  it('Should return showPostModal', () => {
    expect(getShowPostModal(state)).toBe('showPostModal');
  });

  it('Should return currentShownPost', () => {
    expect(getCurrentShownPost(state)).toBe('currentShownPost');
  });
});

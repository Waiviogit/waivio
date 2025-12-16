import React from 'react';
import PropTypes from 'prop-types';
import { connect, batch } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { ConfigProvider, Layout } from 'antd';
import Cookie from 'js-cookie';
import enUS from 'antd/es/locale/en_US';
import ruRU from 'antd/es/locale/ru_RU';
import ukUA from 'antd/es/locale/uk_UA';
import { findLanguage, getRequestLocale, loadLanguage } from '../common/translations';
import {
  login,
  busyLogin,
  getAuthGuestBalance as dispatchGetAuthGuestBalance,
} from '../store/authStore/authActions';
import { getNotifications } from '../store/userStore/userActions';
import {
  getRate,
  getRewardFund,
  setUsedLocale,
  setAppUrl,
  getCurrentAppSettings,
  getWebsiteConfigForSSR,
  getCryptoPriceHistory,
} from '../store/appStore/appActions';
import NotificationPopup from './notifications/NotificationPopup';
import BBackTop from './components/BBackTop';
import { guestUserRegex } from '../common/helpers/regexHelpers';
import ErrorBoundary from './widgets/ErrorBoundary';
import Loading from './components/Icon/Loading';
import { getIsDiningGifts, getTranslations, getUsedLocale } from '../store/appStore/appSelectors';
import { getAuthenticatedUserName, getIsAuthFetching } from '../store/authStore/authSelectors';
import { getIsOpenWalletTable } from '../store/walletStore/walletSelectors';
import { getLocale } from '../store/settingsStore/settingsSelectors';
import MainPageHeader from './websites/WebsiteLayoutComponents/Header/MainPageHeader';
import QuickRewardsModal from './rewards/QiuckRewardsModal/QuickRewardsModal';
import { getIsOpenModal } from '../store/quickRewards/quickRewardsSelectors';
import { getTokenRates, getGlobalProperties } from '../store/walletStore/walletActions';
import { hexToRgb } from '../common/helpers';
import { initialColors } from './websites/constants/colors';
import { getSwapEnginRates } from '../store/ratesStore/ratesAction';
import { setLocale } from '../store/settingsStore/settingsActions';
import { getWebsiteSettings } from '../store/websiteStore/websiteActions';
import LinkSafetyModal from './widgets/LinkSafetyModal/LinkSafetyModal';
import CookieNotice from './widgets/CookieNotice/CookieNotice';

export const AppSharedContext = React.createContext({ usedLocale: 'en-US', isGuestUser: false });

@withRouter
@connect(
  state => ({
    username: getAuthenticatedUserName(state),
    usedLocale: getUsedLocale(state),
    translations: getTranslations(state),
    locale: getLocale(state),
    isOpenWalletTable: getIsOpenWalletTable(state),
    loadingFetching: getIsAuthFetching(state),
    isDiningGifts: getIsDiningGifts(state),
    isOpenModal: getIsOpenModal(state),
  }),
  {
    login,
    getNotifications,
    getRate,
    getRewardFund,
    busyLogin,
    setUsedLocale,
    dispatchGetAuthGuestBalance,
    getCurrentAppSettings,
    setLocale,
    getTokenRates,
    getCryptoPriceHistory,
    getSwapEnginRates,
    getGlobalProperties,
    getWebsiteSettings,
  },
)
class WebsiteWrapper extends React.PureComponent {
  static propTypes = {
    route: PropTypes.shape().isRequired,
    locale: PropTypes.string.isRequired,
    usedLocale: PropTypes.string,
    translations: PropTypes.shape(),
    username: PropTypes.string,
    login: PropTypes.func,
    // getRewardFund: PropTypes.func,
    // getRate: PropTypes.func,
    getNotifications: PropTypes.func,
    setUsedLocale: PropTypes.func,
    busyLogin: PropTypes.func,
    getCurrentAppSettings: PropTypes.func,
    isOpenModal: PropTypes.bool,
    isDiningGifts: PropTypes.bool,
    dispatchGetAuthGuestBalance: PropTypes.func,
    getTokenRates: PropTypes.func.isRequired,
    isOpenWalletTable: PropTypes.bool,
    loadingFetching: PropTypes.bool,
    location: PropTypes.shape({
      search: PropTypes.string,
      pathname: PropTypes.string,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
    getCryptoPriceHistory: PropTypes.func.isRequired,
    setLocale: PropTypes.func.isRequired,
    getSwapEnginRates: PropTypes.func.isRequired,
    getRate: PropTypes.func,
    getRewardFund: PropTypes.func,
    getGlobalProperties: PropTypes.func,
  };

  static defaultProps = {
    usedLocale: null,
    translations: {},
    username: '',
    login: () => {},
    logout: () => {},
    getRewardFund: () => {},
    getCurrentAppSettings: () => {},
    getRate: () => {},
    getTrendingTopics: () => {},
    getNotifications: () => {},
    setUsedLocale: () => {},
    busyLogin: () => {},
    dispatchGetAuthGuestBalance: () => {},
    isOpenWalletTable: false,
    isDiningGifts: false,
    isOpenModal: false,
    loadingFetching: true,
    location: {},
  };

  static fetchData({ store, req }) {
    const state = store.getState();
    let activeLocale = getLocale(state);

    if (activeLocale === 'auto') {
      activeLocale = req.cookies.language || getRequestLocale(req.get('Accept-Language'));
    }
    const lang = loadLanguage(activeLocale);

    return Promise.all([
      store.dispatch(setAppUrl(`https://${req.headers.host}`)),
      store.dispatch(setUsedLocale(lang)),
      store.dispatch(getWebsiteConfigForSSR(req.hostname)),
    ]);
  }

  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    const token = query.get('access_token');
    const provider = query.get('socialProvider');
    const locale = query.get('usedLocale');
    const nightmode = Cookie.get('nightmode');

    if (typeof document !== 'undefined') {
      if (nightmode === 'true') document.body.classList.add('nightmode');
      else document.body.classList.remove('nightmode');
    }

    this.props.getRate();
    this.props.getRewardFund();
    this.props.getGlobalProperties();
    this.props.getCurrentAppSettings().then(res => {
      this.props.getTokenRates('WAIV');
      this.props.getCryptoPriceHistory();
      this.props.getSwapEnginRates();
      if (!this.props.username) this.props.setLocale(locale || res.language);
      const mainColor = res.configuration?.colors?.mapMarkerBody || initialColors.marker;
      const textColor = res.configuration?.colors?.mapMarkerText || initialColors.text;

      if (typeof document !== 'undefined') {
        document.body.style.setProperty('--website-color', mainColor);
        document.body.style.setProperty('--website-hover-color', hexToRgb(mainColor, 6));
        document.body.style.setProperty('--website-light-color', hexToRgb(mainColor, 1));
        document.body.style.setProperty('--website-text-color', textColor);
      }
      this.props.login(token, provider).then(() => {
        batch(() => {
          this.props.getNotifications();
          this.props.busyLogin();
          this.props.dispatchGetAuthGuestBalance();
        });

        if (token && provider) {
          query.delete('access_token');
          query.delete('socialProvider');
          let queryString = query.toString();

          if (queryString) queryString = `/?${queryString}`;

          this.props.history.push(`${this.props?.location.pathname}${queryString}`);
        }
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.locale !== nextProps.locale) this.loadLocale(nextProps.locale);
  }

  componentDidUpdate() {
    const nightmode = Cookie.get('nightmode');

    if (typeof document !== 'undefined') {
      if (nightmode === 'true') document.body.classList.add('nightmode');
      else document.body.classList.remove('nightmode');
    }
  }

  loadLocale = async locale => {
    const lang = await loadLanguage(locale);

    this.props.setUsedLocale(lang);
  };

  getAntdLocale = language => {
    switch (language.id) {
      case 'ru-RU':
        return ruRU;
      case 'uk-UA':
        return ukUA;
      default:
        return enUS;
    }
  };

  render() {
    const {
      usedLocale,
      translations,
      username,
      isOpenWalletTable,
      loadingFetching,
      location,
      isDiningGifts,
      isOpenModal,
    } = this.props;
    const language = findLanguage(usedLocale);
    const antdLocale = this.getAntdLocale(language);
    const signInPage = location?.pathname?.includes('sign-in');

    return (
      <IntlProvider
        key={language.id}
        locale={language.localeData}
        defaultLocale="en"
        messages={translations}
      >
        <ConfigProvider locale={antdLocale}>
          <AppSharedContext.Provider
            value={{
              usedLocale,
              isGuestUser: username && guestUserRegex.test(username),
            }}
          >
            <Layout data-dir={language && language.rtl ? 'rtl' : 'ltr'}>
              {!signInPage && (
                <MainPageHeader
                  withMap={
                    isDiningGifts
                      ? location?.pathname === '/map'
                      : ['/map', '/'].includes(location?.pathname)
                  }
                />
              )}
              <div>
                {loadingFetching ? <Loading /> : renderRoutes(this.props.route.routes)}
                <LinkSafetyModal />
                <NotificationPopup />
                <CookieNotice />
                <BBackTop className={isOpenWalletTable ? 'WalletTable__bright' : 'primary-modal'} />
              </div>
            </Layout>
            {isOpenModal && <QuickRewardsModal />}
          </AppSharedContext.Provider>
        </ConfigProvider>
      </IntlProvider>
    );
  }
}

export default ErrorBoundary(WebsiteWrapper);

import React from 'react';
import PropTypes from 'prop-types';
import { connect, batch } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { ConfigProvider, Layout } from 'antd';
import enUS from 'antd/es/locale/en_US';
import ruRU from 'antd/es/locale/ru_RU';
import ukUA from 'antd/es/locale/uk_UA';
import { findLanguage, getRequestLocale, loadLanguage } from './translations';
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
} from '../store/appStore/appActions';
import NotificationPopup from './notifications/NotificationPopup';
import BBackTop from './components/BBackTop';
import { guestUserRegex } from './helpers/regexHelpers';
import ErrorBoundary from './widgets/ErrorBoundary';
import Loading from './components/Icon/Loading';
import WebsiteHeader from './websites/WebsiteLayoutComponents/Header/WebsiteHeader';
import { getWebsiteObjWithCoordinates } from '../store/websiteStore/websiteActions';
import { getIsDiningGifts, getTranslations, getUsedLocale } from '../store/appStore/appSelectors';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getIsAuthenticated,
  getIsAuthFetching,
} from '../store/authStore/authSelectors';
import { getIsOpenWalletTable } from '../store/walletStore/walletSelectors';
import { getLocale, getNightmode } from '../store/settingsStore/settingsSelectors';
import MainPageHeader from './websites/WebsiteLayoutComponents/Header/MainPageHeader';

export const AppSharedContext = React.createContext({ usedLocale: 'en-US', isGuestUser: false });

@withRouter
@connect(
  state => ({
    user: getAuthenticatedUser(state),
    username: getAuthenticatedUserName(state),
    isAuthenticated: getIsAuthenticated(state),
    usedLocale: getUsedLocale(state),
    translations: getTranslations(state),
    locale: getLocale(state),
    nightmode: getNightmode(state),
    isOpenWalletTable: getIsOpenWalletTable(state),
    loadingFetching: getIsAuthFetching(state),
    isDiningGifts: getIsDiningGifts(state),
  }),
  {
    login,
    getNotifications,
    getRate,
    getRewardFund,
    busyLogin,
    setUsedLocale,
    dispatchGetAuthGuestBalance,
    getWebsiteObjWithCoordinates,
    getCurrentAppSettings,
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
    getRewardFund: PropTypes.func,
    getRate: PropTypes.func,
    getNotifications: PropTypes.func,
    setUsedLocale: PropTypes.func,
    busyLogin: PropTypes.func,
    getCurrentAppSettings: PropTypes.func,
    nightmode: PropTypes.bool,
    isDiningGifts: PropTypes.bool,
    dispatchGetAuthGuestBalance: PropTypes.func,
    isOpenWalletTable: PropTypes.bool,
    loadingFetching: PropTypes.bool,
    location: PropTypes.shape({
      search: PropTypes.string,
      pathname: PropTypes.string,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
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
    nightmode: false,
    dispatchGetAuthGuestBalance: () => {},
    isOpenWalletTable: false,
    isDiningGifts: false,
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
      store.dispatch(setAppUrl(`${req.protocol}://${req.headers.host}`)),
      store.dispatch(setUsedLocale(lang)),
      store.dispatch(login()),
      store.dispatch(getWebsiteConfigForSSR(req.hostname)),
    ]);
  }

  constructor(props) {
    super(props);

    this.loadLocale = this.loadLocale.bind(this);
  }

  state = {
    prevtLocationPath: '',
  };

  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    const token = query.get('access_token');
    const provider = query.get('socialProvider');

    this.props.getCurrentAppSettings().then(() => {
      this.props.getRate();

      this.props.login(token, provider).then(() => {
        batch(() => {
          this.props.getNotifications();
          this.props.busyLogin();
          this.props.getRewardFund();
          this.props.dispatchGetAuthGuestBalance();
        });

        if (token && provider) {
          query.delete('access_token');
          query.delete('socialProvider');
          let queryString = query.toString();

          if (queryString) queryString = `/?${queryString}`;

          this.props.history.push(`${this.props.location.pathname}${queryString}`);
        }
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.locale !== nextProps.locale) this.loadLocale(nextProps.locale);
  }

  componentDidUpdate() {
    if (this.props.nightmode) document.body.classList.add('nightmode');
    else document.body.classList.remove('nightmode');
  }

  async loadLocale(locale) {
    const lang = await loadLanguage(locale);

    this.props.setUsedLocale(lang);
  }

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
    } = this.props;
    const language = findLanguage(usedLocale);
    const antdLocale = this.getAntdLocale(language);
    const signInPage = location.pathname.includes('sign-in');
    const showHeader =
      !isDiningGifts ||
      (isDiningGifts && location.pathname !== '/' && location.pathname !== '/map');

    return (
      <IntlProvider key={language.id} locale={language.localeData} messages={translations}>
        <ConfigProvider locale={antdLocale}>
          <AppSharedContext.Provider
            value={{
              usedLocale,
              isGuestUser: username && guestUserRegex.test(username),
            }}
          >
            <Layout data-dir={language && language.rtl ? 'rtl' : 'ltr'}>
              {showHeader ? (
                !signInPage && (
                  <Layout.Header style={{ position: 'fixed', width: '100%', zIndex: 1050 }}>
                    <WebsiteHeader />
                  </Layout.Header>
                )
              ) : (
                <MainPageHeader withMap={location.pathname === '/map'} />
              )}
              <div className={showHeader && !signInPage && 'content'}>
                {loadingFetching ? <Loading /> : renderRoutes(this.props.route.routes)}
                <NotificationPopup />
                <BBackTop className={isOpenWalletTable ? 'WalletTable__bright' : 'primary-modal'} />
              </div>
            </Layout>
          </AppSharedContext.Provider>
        </ConfigProvider>
      </IntlProvider>
    );
  }
}

export default ErrorBoundary(WebsiteWrapper);

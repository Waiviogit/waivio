import React from 'react';
import PropTypes from 'prop-types';
import url from 'url';
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
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getIsAuthenticated,
  getLocale,
  getUsedLocale,
  getTranslations,
  getNightmode,
  isGuestUser,
  getIsOpenWalletTable,
  getIsAuthFetching,
} from './reducers';
import {
  login,
  busyLogin,
  getAuthGuestBalance as dispatchGetAuthGuestBalance,
} from './auth/authActions';
import { getNotifications } from './user/userActions';
import {
  getRate,
  getRewardFund,
  setUsedLocale,
  setAppUrl,
  getCurrentAppSettings,
} from './app/appActions';
import NotificationPopup from './notifications/NotificationPopup';
import BBackTop from './components/BBackTop';
import TopNavigation from './components/Navigation/TopNavigation';
import { guestUserRegex } from './helpers/regexHelpers';
import WelcomeModal from './components/WelcomeModal/WelcomeModal';
import ErrorBoundary from './widgets/ErrorBoundary';
import Loading from './components/Icon/Loading';
import { handleRefAuthUser } from './rewards/ReferralProgram/ReferralActions';
import { handleRefName } from './rewards/ReferralProgram/ReferralHelper';
import Header from './components/LayoutComponents/Header';

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
    isNewUser: state.settings.newUser,
    isGuest: isGuestUser(state),
    isOpenWalletTable: getIsOpenWalletTable(state),
    loadingFetching: getIsAuthFetching(state),
  }),
  {
    login,
    getNotifications,
    getRate,
    getRewardFund,
    busyLogin,
    setUsedLocale,
    dispatchGetAuthGuestBalance,
    handleRefAuthUser,
    getCurrentAppSettings,
  },
)
class Wrapper extends React.PureComponent {
  static propTypes = {
    route: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    locale: PropTypes.string.isRequired,
    history: PropTypes.shape().isRequired,
    usedLocale: PropTypes.string,
    translations: PropTypes.shape(),
    username: PropTypes.string,
    login: PropTypes.func,
    getRewardFund: PropTypes.func,
    getCurrentAppSettings: PropTypes.func,
    getRate: PropTypes.func,
    getNotifications: PropTypes.func,
    setUsedLocale: PropTypes.func,
    busyLogin: PropTypes.func,
    nightmode: PropTypes.bool,
    isNewUser: PropTypes.bool,
    dispatchGetAuthGuestBalance: PropTypes.func,
    isOpenWalletTable: PropTypes.bool,
    loadingFetching: PropTypes.bool,
    location: PropTypes.shape(),
    handleRefAuthUser: PropTypes.func,
    isGuest: PropTypes.bool,
  };

  static defaultProps = {
    usedLocale: null,
    translations: {},
    username: '',
    login: () => {},
    getCurrentAppSettings: () => {},
    logout: () => {},
    getRewardFund: () => {},
    getRate: () => {},
    getTrendingTopics: () => {},
    getNotifications: () => {},
    setUsedLocale: () => {},
    busyLogin: () => {},
    nightmode: false,
    dispatchGetAuthGuestBalance: () => {},
    isGuest: false,
    isNewUser: false,
    isOpenWalletTable: false,
    loadingFetching: true,
    location: {},
    handleRefAuthUser: () => {},
  };

  static fetchData({ store, req }) {
    const appUrl = url.format({
      protocol: req.protocol,
      host: req.get('host'),
    });
    const state = store.getState();
    let activeLocale = getLocale(state);
    if (activeLocale === 'auto') {
      activeLocale = req.cookies.language || getRequestLocale(req.get('Accept-Language'));
    }
    const lang = loadLanguage(activeLocale);

    store.dispatch(login());

    return Promise.all([store.dispatch(setAppUrl(appUrl)), store.dispatch(setUsedLocale(lang))]);
  }

  constructor(props) {
    super(props);

    this.loadLocale = this.loadLocale.bind(this);
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    this.props.getCurrentAppSettings();
  }

  componentDidMount() {
    const { location } = this.props;
    const ref = new URLSearchParams(location.search).get('ref');
    if (ref) sessionStorage.setItem('refUser', ref);

    this.props.login().then(() => {
      batch(() => {
        this.props.getNotifications();
        this.props.busyLogin();
        this.props.getRewardFund();
        this.props.dispatchGetAuthGuestBalance();
        this.props.getRate();
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    const { locale } = this.props;

    if (locale !== nextProps.locale) {
      this.loadLocale(nextProps.locale);
    }
  }

  componentDidUpdate() {
    if (this.props.nightmode) {
      document.body.classList.add('nightmode');
    } else {
      document.body.classList.remove('nightmode');
    }
    const refName = sessionStorage.getItem('refUser');
    if (this.props.isAuthenticated && refName) {
      const currentRefName = handleRefName(refName);
      this.props.handleRefAuthUser(this.props.username, currentRefName, this.props.isGuest);
      sessionStorage.removeItem('refUser');
    }
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
      user,
      isAuthenticated,
      usedLocale,
      translations,
      history,
      username,
      isNewUser,
      isOpenWalletTable,
      loadingFetching,
    } = this.props;
    const language = findLanguage(usedLocale);
    const antdLocale = this.getAntdLocale(language);

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
              <Layout.Header style={{ position: 'fixed', width: '100%', zIndex: 1050 }}>
                <Header username={user.name} />
              </Layout.Header>
              <div className="content">
                {/*<TopNavigation*/}
                {/*  authenticated={isAuthenticated}*/}
                {/*  userName={username}*/}
                {/*  location={history.location}*/}
                {/*/>*/}
                {loadingFetching ? <Loading /> : renderRoutes(this.props.route.routes)}
                <NotificationPopup />
                <BBackTop className={isOpenWalletTable ? 'WalletTable__bright' : 'primary-modal'} />
                {isNewUser && <WelcomeModal location={history.location.pathname} />}
              </div>
            </Layout>
          </AppSharedContext.Provider>
        </ConfigProvider>
      </IntlProvider>
    );
  }
}

export default ErrorBoundary(Wrapper);

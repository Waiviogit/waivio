import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { connect, batch } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { ConfigProvider, Layout } from 'antd';
import classNames from 'classnames';
import enUS from 'antd/es/locale/en_US';
import ruRU from 'antd/es/locale/ru_RU';
import ukUA from 'antd/es/locale/uk_UA';
import { findLanguage, getRequestLocale, loadLanguage } from '../common/translations';
import {
  login,
  busyLogin,
  getAuthGuestBalance as dispatchGetAuthGuestBalance,
  setAppAdministrators,
} from '../store/authStore/authActions';
import { getCoordinates, getNotifications } from '../store/userStore/userActions';
import {
  getRate,
  getRewardFund,
  setUsedLocale,
  setAppUrl,
  getCryptoPriceHistory,
} from '../store/appStore/appActions';
import NotificationPopup from './notifications/NotificationPopup';
import BBackTop from './components/BBackTop';
import TopNavigation from './components/Navigation/TopNavigation';
import { guestUserRegex } from '../common/helpers/regexHelpers';
import WelcomeModal from './components/WelcomeModal/WelcomeModal';
import ErrorBoundary from './widgets/ErrorBoundary';
import { handleRefAuthUser } from '../store/referralStore/ReferralActions';
import { handleRefName } from './rewards/ReferralProgram/ReferralHelper';
import {
  getSessionData,
  removeSessionData,
  setSessionData,
  widgetUrlConstructor,
} from './rewards/rewardsHelper';
import Topnav from './components/Navigation/Topnav';
import { getTranslations, getUsedLocale } from '../store/appStore/appSelectors';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getIsAuthenticated,
  getIsAuthFetching,
  isGuestUser,
} from '../store/authStore/authSelectors';
import { getIsOpenWalletTable } from '../store/walletStore/walletSelectors';
import { getLocale, getNightmode } from '../store/settingsStore/settingsSelectors';
import { getTokenRates, getGlobalProperties } from '../store/walletStore/walletActions';
import { getSwapEnginRates } from '../store/ratesStore/ratesAction';
import { initialColors } from './websites/constants/colors';
import { hexToRgb } from '../common/helpers';

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
    getTokenRates,
    getCryptoPriceHistory,
    getSwapEnginRates,
    getCoordinates,
    getGlobalProperties,
    setAppAdministrators,
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
    getNotifications: PropTypes.func,
    setUsedLocale: PropTypes.func,
    busyLogin: PropTypes.func,
    getRate: PropTypes.func,
    setAppAdministrators: PropTypes.func,
    getRewardFund: PropTypes.func,
    getTokenRates: PropTypes.func,
    getCryptoPriceHistory: PropTypes.func,
    getGlobalProperties: PropTypes.func,
    getCoordinates: PropTypes.func,
    nightmode: PropTypes.bool,
    isNewUser: PropTypes.bool,
    dispatchGetAuthGuestBalance: PropTypes.func,
    isOpenWalletTable: PropTypes.bool,
    location: PropTypes.shape(),
    handleRefAuthUser: PropTypes.func,
    getSwapEnginRates: PropTypes.func,
    isGuest: PropTypes.bool,
  };

  static defaultProps = {
    usedLocale: null,
    translations: {},
    username: '',
    login: () => {},
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
    const state = store.getState();
    let activeLocale = getLocale(state);

    if (activeLocale === 'auto') {
      activeLocale = req.cookies.language || getRequestLocale(req.get('Accept-Language'));
    }
    const lang = loadLanguage(activeLocale);

    return Promise.all([
      store.dispatch(setAppUrl(`https://${req.headers.host}`)),
      store.dispatch(setUsedLocale(lang)),
      store.dispatch(getRate()),
      store.dispatch(getRewardFund()),
      store.dispatch(getGlobalProperties()),
      store.dispatch(getTokenRates('WAIV')),
      store.dispatch(getCryptoPriceHistory()),
      store.dispatch(getSwapEnginRates()),
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
    const { location } = this.props;
    const querySelectorSearchParams = new URLSearchParams(location?.search);
    const ref = querySelectorSearchParams.get('ref');
    const isWidget = querySelectorSearchParams.get('display');
    const userName = querySelectorSearchParams.get('userName');

    this.props.getRate();
    this.props.getRewardFund();
    this.props.getCoordinates();
    this.props.setAppAdministrators();
    this.props.getGlobalProperties();
    this.props.getTokenRates('WAIV');
    this.props.getCryptoPriceHistory();
    this.props.getSwapEnginRates();
    if (ref) setSessionData('refUser', ref);
    if (userName) setSessionData('userName', userName);
    if (isWidget) {
      /* Check on new tab from widget:
        the page, when switching to a new tab, should not remain a widget
      */
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ prevtLocationPath: location?.pathname });
      setSessionData('isWidget', isWidget);
    }

    if (typeof document !== 'undefined') {
      document.body.style.setProperty('--website-color', initialColors.marker);
      document.body.style.setProperty('--website-hover-color', hexToRgb(initialColors.marker, 8));
      document.body.style.setProperty('--website-text-color', initialColors.text);
      document.body.style.setProperty('--website-light-color', hexToRgb(initialColors.marker, 1));
    }

    setTimeout(
      () =>
        this.props.login().then(() => {
          batch(() => {
            this.props.getNotifications();
            this.props.busyLogin();
            this.props.dispatchGetAuthGuestBalance();
          });
        }),
      1000,
    );
  }

  componentWillReceiveProps(nextProps) {
    const { locale, location } = this.props;
    const { prevtLocationPath } = this.state;

    const widgetLink = getSessionData('isWidget');
    const userName = getSessionData('userName');
    const ref = getSessionData('refUser');

    // eslint-disable-next-line consistent-return
    this.setState(() => {
      if (widgetLink && !isEqual(prevtLocationPath, location?.pathname)) {
        const newUrl = widgetUrlConstructor(widgetLink, userName, ref, location?.pathname);

        if (prevtLocationPath && location?.pathname !== '/') {
          return history.pushState('', '', newUrl);
        }
      }
    });

    if (locale !== nextProps.locale) {
      this.loadLocale(nextProps.locale);
    }
  }

  componentDidUpdate() {
    const widgetLink = getSessionData('isWidget');
    const userName = getSessionData('userName');
    const refName = getSessionData('refUser');

    if (typeof document !== 'undefined') {
      if (this.props.nightmode) document.body.classList.add('nightmode');
      else document.body.classList.remove('nightmode');
    }

    if (this.props.isAuthenticated && refName) {
      const currentRefName = handleRefName(refName);

      this.props.handleRefAuthUser(this.props.username, currentRefName, this.props.isGuest);
      removeSessionData('refUser');
    }
    if (this.props.isAuthenticated && widgetLink && userName)
      removeSessionData('userName', 'isWidget');
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
    } = this.props;
    const language = findLanguage(usedLocale);
    const antdLocale = this.getAntdLocale(language);
    const isWidget = new URLSearchParams(this.props.location?.search).get('display');

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
            <Layout
              style={{ '--website-color': '#f87007' }}
              data-dir={language && language.rtl ? 'rtl' : 'ltr'}
            >
              {!isWidget && (
                <Layout.Header style={{ position: 'fixed', width: '100%', zIndex: 1050 }}>
                  <Topnav username={user.name} />
                </Layout.Header>
              )}
              <div
                className={classNames('content', {
                  'content--widget': isWidget,
                })}
              >
                {!isWidget && (
                  <TopNavigation
                    authenticated={isAuthenticated}
                    userName={username}
                    location={history?.location}
                  />
                )}
                {renderRoutes(this.props.route.routes)}
                {!isWidget && (
                  <React.Fragment>
                    <NotificationPopup />
                    <BBackTop
                      className={isOpenWalletTable ? 'WalletTable__bright' : 'primary-modal'}
                    />
                    {isNewUser && <WelcomeModal location={history?.location.pathname} />}
                  </React.Fragment>
                )}
              </div>
            </Layout>
          </AppSharedContext.Provider>
        </ConfigProvider>
      </IntlProvider>
    );
  }
}

export default ErrorBoundary(Wrapper);

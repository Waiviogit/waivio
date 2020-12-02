import React from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
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
  logout,
  busyLogin,
  getAuthGuestBalance as dispatchGetAuthGuestBalance,
} from './auth/authActions';
import { getNotifications } from './user/userActions';
import { getRate, getRewardFund, setUsedLocale, setAppUrl } from './app/appActions';
import NotificationPopup from './notifications/NotificationPopup';
import Topnav from './components/Navigation/Topnav';
import BBackTop from './components/BBackTop';
import TopNavigation from './components/Navigation/TopNavigation';
import { guestUserRegex } from './helpers/regexHelpers';
import WelcomeModal from './components/WelcomeModal/WelcomeModal';
import { PATH_NAME_ACTIVE } from '../common/constants/rewards';
import ErrorBoundary from './widgets/ErrorBoundary';
import Loading from './components/Icon/Loading';
import { handleRefAuthUser } from './rewards/ReferralProgram/ReferralActions';
import { handleRefName } from './rewards/ReferralProgram/ReferralHelper';
import { getSessionData, removeSessionData, setSessionData } from './rewards/rewardsHelper';

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
    logout,
    getNotifications,
    getRate,
    getRewardFund,
    busyLogin,
    setUsedLocale,
    dispatchGetAuthGuestBalance,
    handleRefAuthUser,
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
    logout: PropTypes.func,
    getRewardFund: PropTypes.func,
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
    this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
  }

  state = {
    prevtLocationPath: '',
  };

  componentDidMount() {
    const { location } = this.props;
    const ref = new URLSearchParams(location.search).get('ref');
    const isWidget = new URLSearchParams(location.search).get('display');
    const userName = new URLSearchParams(location.search).get('userName');
    if (ref) {
      setSessionData('refUser', ref);
    }
    if (userName) {
      setSessionData('userName', userName);
    }
    if (isWidget) {
      /* Check on new tab from widget:
        the page, when switching to a new tab, should not remain a widget
      */
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ prevtLocationPath: location.pathname });
      setSessionData('isWidget', isWidget);
    }

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
    const { prevtLocationPath } = this.state;

    const widgetLink = getSessionData('isWidget');
    const userName = getSessionData('userName');

    // eslint-disable-next-line consistent-return
    this.setState(() => {
      if (widgetLink && !isEqual(prevtLocationPath, location.pathname)) {
        // const newUrl = `${location.pathname}/?display=${widgetLink}`;
        let newUrl = '';

        if (userName) {
          newUrl = `${location.pathname}/?userName=${userName}&display=${widgetLink}`;
        } else {
          newUrl = `${location.pathname}/?display=${widgetLink}`;
        }

        const filteredUrl = newUrl.replace(/\/{2,}/g, '/');
        if (prevtLocationPath && location.pathname !== '/') {
          return history.pushState('', '', filteredUrl);
        }
      }
    });

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
    const refName = getSessionData('refUser');
    if (this.props.isAuthenticated && refName) {
      const currentRefName = handleRefName(refName);
      this.props.handleRefAuthUser(this.props.username, currentRefName, this.props.isGuest);
      removeSessionData('refUser');
    }
  }

  async loadLocale(locale) {
    const lang = await loadLanguage(locale);

    this.props.setUsedLocale(lang);
  }

  handleMenuItemClick(key) {
    switch (key) {
      case 'logout':
        this.props.logout();
        break;
      case 'activity':
        this.props.history.push('/activity');
        break;
      case 'replies':
        this.props.history.push('/replies');
        break;
      case 'bookmarks':
        this.props.history.push('/bookmarks');
        break;
      case 'drafts':
        this.props.history.push('/drafts');
        break;
      case 'settings':
        this.props.history.push('/settings');
        break;
      case 'feed':
        this.props.history.push('/');
        break;
      case 'news':
        this.props.history.push('/trending');
        break;
      case 'objects':
        this.props.history.push('/objects');
        break;
      case 'wallet':
        this.props.history.push(`/@${this.props.username}/transfers`);
        break;
      case 'my-profile':
        this.props.history.push(`/@${this.props.username}`);
        break;
      case 'rewards':
        this.props.history.push(PATH_NAME_ACTIVE);
        break;
      case 'discover':
        this.props.history.push(`/discover-objects/hashtag`);
        break;
      case 'tools':
        this.props.history.push(`/drafts`);
        break;
      default:
        break;
    }
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
    const isWidget = new URLSearchParams(location.search).get('display');

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
              {!isWidget && (
                <Layout.Header style={{ position: 'fixed', width: '100%', zIndex: 1050 }}>
                  <Topnav username={user.name} onMenuItemClick={this.handleMenuItemClick} />
                </Layout.Header>
              )}
              <div className="content">
                {!isWidget && (
                  <TopNavigation
                    authenticated={isAuthenticated}
                    userName={username}
                    location={history.location}
                  />
                )}
                {loadingFetching ? <Loading /> : renderRoutes(this.props.route.routes)}
                {!isWidget && (
                  <React.Fragment>
                    <NotificationPopup />
                    <BBackTop
                      className={isOpenWalletTable ? 'WalletTable__bright' : 'primary-modal'}
                    />
                    {isNewUser && <WelcomeModal location={history.location.pathname} />}
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

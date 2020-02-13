import React from 'react';
import PropTypes from 'prop-types';
import url from 'url';
import { connect, batch } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { ConfigProvider, Layout } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import Cookie from 'js-cookie';
import { findLanguage, getRequestLocale, getBrowserLocale, loadLanguage } from './translations';
import {
  getIsLoaded,
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getIsAuthenticated,
  getLocale,
  getUsedLocale,
  getTranslations,
  getNightmode,
} from './reducers';
import { login, logout, busyLogin } from './auth/authActions';
import { getFollowing, getFollowingObjects, getNotifications } from './user/userActions';
import { getRate, getRewardFund, setUsedLocale, setAppUrl } from './app/appActions';
import * as reblogActions from './app/Reblog/reblogActions';
import NotificationPopup from './notifications/NotificationPopup';
import Topnav from './components/Navigation/Topnav';
import Transfer from './wallet/Transfer';
import PowerUpOrDown from './wallet/PowerUpOrDown';
import BBackTop from './components/BBackTop';
import TopNavigation from './components/Navigation/TopNavigation';
import { GUEST_PREFIX } from '../common/constants/waivio';
import WelcomeModal from './components/WelcomeModal/WelcomeModal';

export const AppSharedContext = React.createContext({ usedLocale: 'en-US', isGuestUser: false });

@withRouter
@connect(
  state => ({
    loaded: getIsLoaded(state),
    user: getAuthenticatedUser(state),
    username: getAuthenticatedUserName(state),
    isAuthenticated: getIsAuthenticated(state),
    usedLocale: getUsedLocale(state),
    translations: getTranslations(state),
    locale: getLocale(state),
    nightmode: getNightmode(state),
    isNewUser: state.settings.newUser,
    followingList: state.user.following.list,
    followingObjectsList: state.user.followingObjects.list,
  }),
  {
    login,
    logout,
    getFollowing,
    getFollowingObjects,
    getNotifications,
    getRate,
    getRewardFund,
    busyLogin,
    getRebloggedList: reblogActions.getRebloggedList,
    setUsedLocale,
  },
)
export default class Wrapper extends React.PureComponent {
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
    getFollowing: PropTypes.func,
    getFollowingObjects: PropTypes.func,
    getRewardFund: PropTypes.func,
    getRebloggedList: PropTypes.func,
    getRate: PropTypes.func,
    getNotifications: PropTypes.func,
    setUsedLocale: PropTypes.func,
    busyLogin: PropTypes.func,
    nightmode: PropTypes.bool,
    isNewUser: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    usedLocale: null,
    translations: {},
    username: '',
    login: () => {},
    logout: () => {},
    getFollowing: () => {},
    getFollowingObjects: () => {},
    getRewardFund: () => {},
    getRebloggedList: () => {},
    getRate: () => {},
    getTrendingTopics: () => {},
    getNotifications: () => {},
    setUsedLocale: () => {},
    busyLogin: () => {},
    nightmode: false,
  };

  static async fetchData({ store, req }) {
    await store.dispatch(login());

    const appUrl = url.format({
      protocol: req.protocol,
      host: req.get('host'),
    });

    store.dispatch(setAppUrl(appUrl));

    const state = store.getState();

    let activeLocale = getLocale(state);
    if (activeLocale === 'auto') {
      activeLocale = req.cookies.language || getRequestLocale(req.get('Accept-Language'));
    }

    const lang = await loadLanguage(activeLocale);

    store.dispatch(setUsedLocale(lang));
  }

  constructor(props) {
    super(props);

    this.loadLocale = this.loadLocale.bind(this);
    this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
  }

  componentDidMount() {
    this.props.login().then(() => {
      batch(() => {
        this.props.getFollowing();
        this.props.getFollowingObjects();
        this.props.getNotifications();
        this.props.busyLogin();
        this.props.getRewardFund();
        this.props.getRebloggedList();
        this.props.getRate();
      });
    });
    batch(() => {
      this.props.getRewardFund();
      this.props.getRebloggedList();
      this.props.getRate();
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
  }

  async loadLocale(locale) {
    let activeLocale = locale;
    if (activeLocale === 'auto') {
      activeLocale = Cookie.get('language') || getBrowserLocale();
    }

    const lang = await loadLanguage(activeLocale);

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
        this.props.history.push('/wallet');
        break;
      case 'my-profile':
        this.props.history.push(`/@${this.props.username}`);
        break;
      default:
        break;
    }
  }

  render() {
    const {
      user,
      isAuthenticated,
      usedLocale,
      translations,
      history,
      username,
      isNewUser,
    } = this.props;

    const language = findLanguage(usedLocale);

    return (
      <IntlProvider key={language.id} locale={language.localeData} messages={translations}>
        <ConfigProvider locale={enUS}>
          <AppSharedContext.Provider
            value={{
              usedLocale,
              isGuestUser: username && username.startsWith(GUEST_PREFIX),
            }}
          >
            <Layout data-dir={language && language.rtl ? 'rtl' : 'ltr'}>
              <Layout.Header style={{ position: 'fixed', width: '100%', zIndex: 1050 }}>
                <Topnav username={user.name} onMenuItemClick={this.handleMenuItemClick} />
              </Layout.Header>
              <div className="content">
                <TopNavigation
                  authenticated={isAuthenticated}
                  userName={username}
                  location={history.location}
                />
                {renderRoutes(this.props.route.routes)}
                <Transfer />
                <PowerUpOrDown />
                <NotificationPopup />
                <BBackTop className="primary-modal" />
                {isNewUser && <WelcomeModal location={history.location.pathname} />}
              </div>
            </Layout>
          </AppSharedContext.Provider>
        </ConfigProvider>
      </IntlProvider>
    );
  }
}

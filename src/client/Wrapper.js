import React from 'react';
import PropTypes from 'prop-types';
import url from 'url';
import { batch, connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { ConfigProvider, Layout } from 'antd';
import classNames from 'classnames';
import enUS from 'antd/lib/locale-provider/en_US';
import Cookie from 'js-cookie';
import { findLanguage, getBrowserLocale, getRequestLocale, loadLanguage } from './translations';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getChatCondition,
  getIsAuthenticated,
  getIsLoaded,
  getLocale,
  getNightmode,
  getScreenSize,
  getTranslations,
  getUsedLocale,
  isGuestUser,
} from './reducers';
import { busyLogin, login, logout } from './auth/authActions';
import { getMessagesQuantity } from '../waivioApi/ApiClient';
import {
  changeChatCondition,
  getFollowing,
  getFollowingObjects,
  getNotifications,
} from './user/userActions';
import { getRate, getRewardFund, setAppUrl, setUsedLocale } from './app/appActions';
import { getPerformersStatistic } from '../investarena/redux/actions/topPerformersActions';
import * as reblogActions from './app/Reblog/reblogActions';
import NotificationPopup from './notifications/NotificationPopup';
import Topnav from './components/Navigation/Topnav';
import Transfer from './wallet/Transfer';
import PowerUpOrDown from './wallet/PowerUpOrDown';
import BBackTop from './components/BBackTop';
import { getChartsData } from '../investarena/redux/actions/chartsActions';
import { getPlatformNameState } from '../investarena/redux/selectors/platformSelectors';
import Chat from './components/Chat/Chat';
import ChatButton from './components/ChatButton/ChatButton';

export const UsedLocaleContext = React.createContext('en-US');

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
    platformName: getPlatformNameState(state),
    isChat: getChatCondition(state),
    screenSize: getScreenSize(state),
    isGuest: isGuestUser(state),
  }),
  {
    login,
    logout,
    getFollowing,
    getFollowingObjects,
    getPerformersStatistic,
    getNotifications,
    getRate,
    getRewardFund,
    busyLogin,
    getRebloggedList: reblogActions.getRebloggedList,
    setUsedLocale,
    getChartsData,
    changeChatCondition,
  },
)
export default class Wrapper extends React.PureComponent {
  static propTypes = {
    route: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    locale: PropTypes.string.isRequired,
    history: PropTypes.shape().isRequired,
    usedLocale: PropTypes.string,
    translations: PropTypes.shape(),
    username: PropTypes.string,
    login: PropTypes.func,
    logout: PropTypes.func,
    getFollowing: PropTypes.func,
    getFollowingObjects: PropTypes.func,
    getPerformersStatistic: PropTypes.func,
    getRewardFund: PropTypes.func,
    getRebloggedList: PropTypes.func,
    getRate: PropTypes.func,
    getNotifications: PropTypes.func,
    setUsedLocale: PropTypes.func,
    busyLogin: PropTypes.func,
    nightmode: PropTypes.bool,
    getChartsData: PropTypes.func,
    platformName: PropTypes.string,
    isAuthenticated: PropTypes.bool.isRequired,
    isChat: PropTypes.bool.isRequired,
    changeChatCondition: PropTypes.func,
    screenSize: PropTypes.string.isRequired,
    isGuest: PropTypes.bool,
  };

  static defaultProps = {
    usedLocale: null,
    translations: {},
    username: '',
    login: () => {},
    logout: () => {},
    getFollowing: () => {},
    getFollowingObjects: () => {},
    getPerformersStatistic: () => {},
    getRewardFund: () => {},
    getRebloggedList: () => {},
    getRate: () => {},
    getTrendingTopics: () => {},
    getNotifications: () => {},
    setUsedLocale: () => {},
    busyLogin: () => {},
    nightmode: false,
    getChartsData: () => {},
    changeChatCondition: () => {},
    getMessagesQuantity: () => {},
    isGuest: false,
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
    this.state = {
      messagesCount: 0,
    };
  }

  componentDidMount() {
    this.props.login().then(() => {
      batch(() => {
        this.props.getFollowing();
        this.props.getFollowingObjects();
        this.props.getPerformersStatistic();
        this.props.getNotifications();
        this.props.busyLogin();
      });
      getMessagesQuantity(this.props.username).then(data =>
        this.setState({ messagesCount: data.count }),
      );
    });
    batch(() => {
      this.props.getRewardFund();
      this.props.getRebloggedList();
      this.props.getRate();
      this.props.getChartsData();
    });

    if (this.props.screenSize !== 'large') {
      window.$crisp.push(['do', 'chat:hide']);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { locale, isChat } = this.props;

    if (locale !== nextProps.locale) {
      this.loadLocale(nextProps.locale);
    }
    if (nextProps.isChat !== isChat) {
      getMessagesQuantity(this.props.username).then(data =>
        this.setState({ messagesCount: data.count }),
      );
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
      case 'myFeed':
        this.props.history.push('/my_feed');
        break;
      case 'quick_forecast':
        this.props.history.push('/quickforecast');
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
      case 'discover-objects':
        this.props.history.push(`/discover-objects/crypto`);
        break;
      case 'about':
        this.props.history.push(`/object/qjr-investarena-q-and-a/list`);
        break;
      default:
        break;
    }
  }

  render() {
    const {
      user,
      usedLocale,
      translations,
      platformName,
      username,
      isChat,
      isAuthenticated,
    } = this.props;
    const { messagesCount } = this.state;
    const language = findLanguage(usedLocale);

    return (
      <IntlProvider locale={language.localeData} messages={translations}>
        <ConfigProvider locale={enUS}>
          <UsedLocaleContext.Provider value={usedLocale}>
            <Layout data-dir={language && language.rtl ? 'rtl' : 'ltr'}>
              <Layout.Header style={{ position: 'fixed', width: '100%', zIndex: 1050 }}>
                <Topnav
                  username={user.name}
                  openChat={this.props.changeChatCondition}
                  messagesCount={messagesCount}
                  onMenuItemClick={this.handleMenuItemClick}
                />
              </Layout.Header>
              <div className={classNames('content', { 'no-broker': platformName === 'widgets' })}>
                {renderRoutes(this.props.route.routes)}
                <Transfer />
                <PowerUpOrDown />
                <NotificationPopup />
                <BBackTop className="primary-modal" />
                <ChatButton
                  openChat={this.props.changeChatCondition}
                  isChat={isChat}
                  messagesCount={messagesCount}
                  authentication={isAuthenticated}
                />
                {isAuthenticated ? (
                  <Chat
                    visibility={isChat}
                    openChat={this.props.changeChatCondition}
                    userName={username}
                  />
                ) : null}
              </div>
            </Layout>
          </UsedLocaleContext.Provider>
        </ConfigProvider>
      </IntlProvider>
    );
  }
}

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect, batch } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { ConfigProvider, Layout } from 'antd';
import {
  findLanguage,
  getAntdLocale,
  getRequestLocale,
  loadLanguage,
} from '../../common/translations';
import {
  login,
  busyLogin,
  getAuthGuestBalance as dispatchGetAuthGuestBalance,
} from '../../store/authStore/authActions';
import { getNotifications } from '../../store/userStore/userActions';
import {
  getRate,
  getRewardFund,
  setUsedLocale,
  setAppUrl,
  getCurrentAppSettings,
  getWebsiteConfigForSSR,
  getCryptoPriceHistory,
  setSocialFlag,
} from '../../store/appStore/appActions';
import Header from './Header/Header';
import NotificationPopup from './../notifications/NotificationPopup';
import BBackTop from './../components/BBackTop';
import ErrorBoundary from './../widgets/ErrorBoundary';
import Loading from './../components/Icon/Loading';
import {
  getTranslations,
  getUsedLocale,
  getWebsiteColors,
} from '../../store/appStore/appSelectors';
import { getAuthenticatedUserName, getIsAuthFetching } from '../../store/authStore/authSelectors';
import { getIsOpenWalletTable } from '../../store/walletStore/walletSelectors';
import { getLocale, getNightmode } from '../../store/settingsStore/settingsSelectors';
import QuickRewardsModal from './../rewards/QiuckRewardsModal/QuickRewardsModal';
import { getIsOpenModal } from '../../store/quickRewards/quickRewardsSelectors';
import { getTokenRates } from '../../store/walletStore/walletActions';
import { hexToRgb } from '../../common/helpers';
import { initialColors } from '../websites/constants/colors';
import { getSwapEnginRates } from '../../store/ratesStore/ratesAction';
import { setLocale } from '../../store/settingsStore/settingsActions';

const SocialWrapper = props => {
  const language = findLanguage(props.usedLocale);
  const antdLocale = getAntdLocale(language);
  const signInPage = props.location.pathname.includes('sign-in');
  const mainColor = props.colors?.mapMarkerBody || initialColors.marker;
  const loadLocale = async locale => {
    const lang = await loadLanguage(locale);

    props.setUsedLocale(lang);
  };

  useEffect(() => {
    const query = new URLSearchParams(props.location.search);
    const token = query.get('access_token');
    const provider = query.get('socialProvider');
    const locale = query.get('usedLocale');

    props.setSocialFlag();
    props.getCurrentAppSettings().then(res => {
      props.getRate();
      props.getTokenRates('WAIV');
      props.getCryptoPriceHistory();
      props.getSwapEnginRates();
      if (!props.username) props.setLocale(locale || res.language);

      props.login(token, provider).then(() => {
        batch(() => {
          props.getNotifications();
          props.busyLogin();
          props.getRewardFund();
          props.dispatchGetAuthGuestBalance();
        });

        if (token && provider) {
          query.delete('access_token');
          query.delete('socialProvider');
          let queryString = query.toString();

          if (queryString) queryString = `/?${queryString}`;

          props.history.push(`${props.location.pathname}${queryString}`);
        }
      });
    });
  }, []);

  useEffect(() => {
    loadLocale(props.locale);

    if (props.nightmode) document.body.classList.add('nightmode');
    else document.body.classList.remove('nightmode');
  }, [props.locale, props.nightmode]);

  return (
    <IntlProvider
      key={language.id}
      locale={language.localeData}
      defaultLocale="en"
      messages={props.translations}
    >
      <ConfigProvider locale={antdLocale}>
        <Layout
          style={{
            '--website-color': `${mainColor}`,
            '--website-hover-color': `${hexToRgb(mainColor, 1)}`,
          }}
          data-dir={language && language.rtl ? 'rtl' : 'ltr'}
        >
          {!signInPage && <Header />}
          <div className={'ShopWebsiteWrapper'}>
            {props.loadingFetching ? (
              <Loading />
            ) : (
              renderRoutes(props.route.routes, { isSocial: true })
            )}
            <NotificationPopup />
            <BBackTop
              className={props.isOpenWalletTable ? 'WalletTable__bright' : 'primary-modal'}
            />
          </div>
        </Layout>
        {props.isOpenModal && <QuickRewardsModal />}
      </ConfigProvider>
    </IntlProvider>
  );
};

SocialWrapper.propTypes = {
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
  isOpenModal: PropTypes.bool,
  dispatchGetAuthGuestBalance: PropTypes.func,
  setSocialFlag: PropTypes.func,
  getTokenRates: PropTypes.func.isRequired,
  isOpenWalletTable: PropTypes.bool,
  loadingFetching: PropTypes.bool,
  location: PropTypes.shape({
    search: PropTypes.string,
    pathname: PropTypes.string,
  }).isRequired,
  colors: PropTypes.shape({
    mapMarkerBody: PropTypes.string,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  getCryptoPriceHistory: PropTypes.func.isRequired,
  setLocale: PropTypes.func.isRequired,
  getSwapEnginRates: PropTypes.func.isRequired,
};

SocialWrapper.defaultProps = {
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
  isOpenModal: false,
  loadingFetching: true,
  location: {},
};

SocialWrapper.fetchData = ({ store, req }) => {
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
};

export default ErrorBoundary(
  withRouter(
    connect(
      state => ({
        username: getAuthenticatedUserName(state),
        usedLocale: getUsedLocale(state),
        translations: getTranslations(state),
        locale: getLocale(state),
        nightmode: getNightmode(state),
        isOpenWalletTable: getIsOpenWalletTable(state),
        loadingFetching: getIsAuthFetching(state),
        isOpenModal: getIsOpenModal(state),
        colors: getWebsiteColors(state),
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
        setSocialFlag,
      },
    )(SocialWrapper),
  ),
);

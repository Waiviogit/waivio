import Cookie from 'js-cookie';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect, batch, useSelector, useDispatch } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { get, isEmpty } from 'lodash';
import { ConfigProvider, Layout } from 'antd';
import { clearGuestAuthData } from '../../common/helpers/localStorageHelpers';
import {
  findLanguage,
  getAntdLocale,
  getRequestLocale,
} from '../../common/translations';
import {
  login,
  busyLogin,
  getAuthGuestBalance as dispatchGetAuthGuestBalance,
} from '../../store/authStore/authActions';
import { getObjectPosts, setFirstLoading } from '../../store/feedStore/feedActions';
import { getObject as getObjectAction } from '../../store/wObjectStore/wobjectsActions';
import {
  getUserDepartments,
  getUserShopList,
  getWobjectDepartments,
  getWobjectsShopList,
} from '../../store/shopStore/shopActions';
import { getCoordinates, getNotifications } from '../../store/userStore/userActions';
import {
  getRate,
  getRewardFund,
  setUsedLocale,
  setAppUrl,
  getCurrentAppSettings,
  getWebsiteConfigForSSR,
  getCryptoPriceHistory,
  setSocialFlag,
  setItemsForNavigation,
  setLoadingStatus,
  setMainObj,
} from '../../store/appStore/appActions';
import Header from './Header/Header';
import NotificationPopup from './../notifications/NotificationPopup';
import BBackTop from './../components/BBackTop';
import ErrorBoundary from './../widgets/ErrorBoundary';
import {
  getIsSocialGifts,
  getTranslations,
  getUsedLocale,
  getWebsiteColors,
  getWebsiteConfiguration,
} from '../../store/appStore/appSelectors';
import { getAuthenticatedUserName, getIsAuthFetching } from '../../store/authStore/authSelectors';
import { getIsOpenWalletTable } from '../../store/walletStore/walletSelectors';
import { getLocale, getNightmode } from '../../store/settingsStore/settingsSelectors';
import QuickRewardsModal from './../rewards/QiuckRewardsModal/QuickRewardsModal';
import { getIsOpenModal } from '../../store/quickRewards/quickRewardsSelectors';
import { getTokenRates, getGlobalProperties } from '../../store/walletStore/walletActions';
import { hexToRgb } from '../../common/helpers';
import { initialColors } from '../websites/constants/colors';
import { getSwapEnginRates } from '../../store/ratesStore/ratesAction';
import { setLocale } from '../../store/settingsStore/settingsActions';
import { getObject, getObjectsByIds } from '../../waivioApi/ApiClient';
import { parseJSON } from '../../common/helpers/parseJSON';
import { getObjectName } from '../../common/helpers/wObjectHelper';
import { getWebsiteSettings } from '../../store/websiteStore/websiteActions';

const createLink = i => {
  switch (i.object_type) {
    case 'shop':
      return `/object-shop/${i?.author_permlink}`;
    case 'list':
    case 'page':
      return `/checklist/${i?.author_permlink}`;
    case 'business':
    case 'product':
    case 'book':
    case 'newsfeed':
      return `/object/${i?.author_permlink}/newsfeed`;
    case 'map':
      return `/object/${i?.author_permlink}/map`;
    default:
      return i.linkToWeb || i.defaultShowLink;
  }
};

const SocialWrapper = props => {
  const isSocialGifts = useSelector(getIsSocialGifts);
  const dispatch = useDispatch();
  const language = findLanguage(props.usedLocale);
  const antdLocale = getAntdLocale(language);
  const signInPage = props?.location.pathname?.includes('sign-in');
  const createWebsiteMenu = configuration => {
    if (!isEmpty(configuration?.shopSettings)) {
      if (configuration.shopSettings?.type === 'object') {
        getObject(configuration.shopSettings?.value, props.username, props.locale).then(
          async wobject => {
            const menuItemLinks = wobject.menuItem?.reduce((acc, item) => {
              const body = parseJSON(item.body);

              if (body?.linkToObject) {
                return [...acc, body?.linkToObject];
              }

              return acc;
            }, []);

            const customSort = get(wobject, 'sortCustom.include', []);

            if (isEmpty(wobject.menuItem)) {
              dispatch(
                setItemsForNavigation([
                  {
                    link: createLink(wobject),
                    name: 'Home',
                    permlink: wobject?.author_permlink,
                    object_type: wobject?.object_type,
                  },
                  {
                    name: 'Legal',
                    link: '/checklist/ljc-legal',
                    permlink: 'ljc-legal',
                    object_type: 'list',
                  },
                ]),
              );

              props.setLoadingStatus(true);
            } else {
              const listItems = isEmpty(menuItemLinks)
                ? []
                : await getObjectsByIds({ authorPermlinks: menuItemLinks, locale: props.locale });

              const compareList = wobject?.menuItem?.map(wobjItem => {
                const body = parseJSON(wobjItem.body);
                const currItem = body?.linkToObject
                  ? listItems?.wobjects?.find(wobj => wobj.author_permlink === body?.linkToObject)
                  : body;

                return {
                  ...wobjItem,
                  ...currItem,
                  body,
                };
              });
              const sortingButton = customSort.reduce((acc, curr) => {
                const findObj = compareList.find(wobj => wobj.permlink === curr);

                return findObj ? [...acc, findObj] : acc;
              }, []);
              const buttonList = [
                ...sortingButton,
                ...compareList?.filter(i => !customSort?.includes(i.permlink)),
              ].map(i => ({
                link: createLink(i),
                name: i?.body?.title || getObjectName(i),
                type: i.body.linkToObject ? 'nav' : 'blank',
                permlink: i.body.linkToObject,
                object_type: i?.object_type,
              }));

              dispatch(
                setItemsForNavigation([
                  ...buttonList,
                  {
                    name: 'Legal',
                    link: '/checklist/ljc-legal',
                    permlink: 'ljc-legal',
                    object_type: 'list',
                  },
                ]),
              );
              props.setLoadingStatus(true);
            }
          },
        );
      }
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(props?.location.search);
    const token = query.get('access_token');
    const provider = query.get('socialProvider');
    const auth = query.get('auth');
    const locale = query.get('usedLocale');

    props.setSocialFlag();
    props.getCurrentAppSettings().then(res => {
      if (!props.username) props.setLocale(locale || props.locale || res.language);
      const mainColor = res.configuration.colors?.mapMarkerBody || initialColors.marker;
      const textColor = res.configuration.colors?.mapMarkerText || initialColors.text;

      if (typeof document !== 'undefined') {
        document.body.style.setProperty('--website-color', mainColor);
        document.body.style.setProperty('--website-hover-color', hexToRgb(mainColor, 6));
        document.body.style.setProperty('--website-text-color', textColor);
        document.body.style.setProperty('--website-light-color', hexToRgb(mainColor, 1));
      }

      if (signInPage || isSocialGifts) {
        clearGuestAuthData();
        Cookie.remove('auth');
      } else {
        props.login(token, provider, auth).then(() => {
          batch(() => {
            props.getNotifications();
            props.busyLogin();
            props.dispatchGetAuthGuestBalance();
            // props.getCoordinates();
          });
          if ((token && provider) || (auth && provider)) {
            props.history.push('/');
          }
        });
      }
      createWebsiteMenu(res.configuration);
    });
  }, [props.locale]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (props.nightmode) document.body.classList.add('nightmode');
      else document.body.classList.remove('nightmode');
    }
  }, [props.nightmode]);

  return (
    <IntlProvider
      key={language.id}
      locale={language.localeData}
      defaultLocale="en"
      messages={props.translations}
    >
      <ConfigProvider locale={antdLocale}>
        <Layout data-dir={language && language.rtl ? 'rtl' : 'ltr'}>
          {!signInPage && !isSocialGifts && <Header />}
          <div className={'ShopWebsiteWrapper'}>
            {renderRoutes(props.route.routes, { isSocial: true })}
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
  getNotifications: PropTypes.func,
  busyLogin: PropTypes.func,
  getCurrentAppSettings: PropTypes.func,
  nightmode: PropTypes.bool,
  isOpenModal: PropTypes.bool,
  dispatchGetAuthGuestBalance: PropTypes.func,
  setSocialFlag: PropTypes.func,
  setLoadingStatus: PropTypes.func,
  isOpenWalletTable: PropTypes.bool,
  // loadingFetching: PropTypes.bool,
  location: PropTypes.shape({
    search: PropTypes.string,
    pathname: PropTypes.string,
  }).isRequired,
  config: PropTypes.shape({}).isRequired,
  colors: PropTypes.shape({
    mapMarkerBody: PropTypes.string,
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  setLocale: PropTypes.func.isRequired,
};

SocialWrapper.defaultProps = {
  usedLocale: null,
  translations: {},
  username: '',
  login: () => {},
  getCurrentAppSettings: () => {},
  getNotifications: () => {},
  busyLogin: () => {},
  nightmode: false,
  dispatchGetAuthGuestBalance: () => {},
  isOpenWalletTable: false,
  isOpenModal: false,
  loadingFetching: true,
  location: {},
};

SocialWrapper.fetchData = async ({ store, req, url }) => {
  const state = store.getState();
  let activeLocale = getLocale(state);
  const username = getAuthenticatedUserName(state);

  if (activeLocale === 'auto') {
    activeLocale = req.cookies.language || getRequestLocale(req.get('Accept-Language'));
  }

  return Promise.allSettled([
    store.dispatch(getWebsiteConfigForSSR(req.headers.host)).then(res => {
      const configuration = res.value;

      const promises = [store.dispatch(setMainObj(configuration.shopSettings))];

      if (!isEmpty(configuration?.shopSettings)) {
        if (configuration.shopSettings?.type === 'object') {
          return getObject(configuration.shopSettings?.value, username, activeLocale).then(
            async wobject => {
              const menuItemLinks = wobject.menuItem?.reduce((acc, item) => {
                const body = parseJSON(item.body);

                if (body?.linkToObject) {
                  return [...acc, body?.linkToObject];
                }

                return acc;
              }, []);
              const customSort = get(wobject, 'sortCustom.include', []);

              if (isEmpty(wobject.menuItem)) {
                promises.push(
                  store.dispatch(
                    setItemsForNavigation([
                      {
                        link: createLink(wobject),
                        name: 'Home',
                        permlink: wobject?.author_permlink,
                        object_type: wobject?.object_type,
                      },
                      {
                        name: 'Legal',
                        link: '/checklist/ljc-legal',
                        permlink: 'ljc-legal',
                        object_type: 'list',
                      },
                    ]),
                  ),
                );

                if (url === '/') {
                  if (wobject.object_type === 'newsfeed') {
                    promises.push(
                      store.dispatch(
                        getObjectPosts({
                          object: wobject.author_permlink,
                          username: wobject.author_permlink,
                          limit: 20,
                          newsPermlink: wobject.newsfeed,
                        }),
                      ),
                    );
                    promises.push(store.dispatch(setFirstLoading(false)));
                  }
                  if (wobject.object_type === 'shop') {
                    promises.push(store.dispatch(getWobjectDepartments(wobject.author_permlink)));
                    promises.push(store.dispatch(getWobjectsShopList(wobject.author_permlink)));
                  }
                  if (
                    ['page', 'widget', 'newsfeed', 'list', 'map']?.includes(wobject.object_type)
                  ) {
                    promises.push(store.dispatch(getObjectAction(wobject.author_permlink)));
                  }
                }

                return Promise.allSettled(promises);
              }
              const listItems = isEmpty(menuItemLinks)
                ? []
                : await getObjectsByIds({
                    authorPermlinks: menuItemLinks,
                    locale: activeLocale,
                    authUserName: username,
                  });

              const compareList = wobject?.menuItem?.map(wobjItem => {
                const body = parseJSON(wobjItem.body);
                const currItem = body?.linkToObject
                  ? listItems?.wobjects?.find(wobj => wobj.author_permlink === body?.linkToObject)
                  : body;

                return {
                  ...wobjItem,
                  ...currItem,
                  body,
                };
              });
              const sortingButton = customSort.reduce((acc, curr) => {
                const findObj = compareList.find(wobj => wobj.permlink === curr);

                return findObj ? [...acc, findObj] : acc;
              }, []);
              const buttonList = [
                ...sortingButton,
                ...compareList?.filter(i => !customSort?.includes(i.permlink)),
              ].map(i => ({
                link: createLink(i),
                name: i?.body?.title || getObjectName(i),
                type: i.body.linkToObject ? 'nav' : 'blank',
                permlink: i.body.linkToObject,
                object_type: i?.object_type,
                newsfeed: i.newsFeed?.permlink,
              }));

              if (url === '/') {
                if (buttonList[0]?.object_type === 'newsfeed') {
                  promises.push(
                    store.dispatch(
                      getObjectPosts({
                        object: buttonList[0]?.permlink,
                        username: buttonList[0]?.permlink,
                        limit: 20,
                        newsPermlink: buttonList[0].newsfeed,
                      }),
                    ),
                  );
                  promises.push(store.dispatch(setFirstLoading(false)));
                }
                if (buttonList[0]?.object_type === 'shop') {
                  promises.push(store.dispatch(getWobjectDepartments(buttonList[0]?.permlink)));
                  promises.push(store.dispatch(getWobjectsShopList(buttonList[0]?.permlink)));
                }
                if (
                  ['page', 'widget', 'newsfeed', 'list', 'map']?.includes(
                    buttonList[0]?.object_type,
                  )
                ) {
                  // eslint-disable-next-line no-console
                  console.log(buttonList[0]?.permlink, 'buttonList-[0]-permlink');
                  promises.push(store.dispatch(getObjectAction(buttonList[0]?.permlink)));
                }
              }

              return Promise.allSettled([
                ...promises,
                store.dispatch(
                  setItemsForNavigation([
                    ...buttonList,
                    {
                      name: 'Legal',
                      link: '/checklist/ljc-legal',
                      permlink: 'ljc-legal',
                      object_type: 'list',
                    },
                  ]),
                ),
              ]);
            },
          );
        }

        return Promise.allSettled([
          store.dispatch(getUserDepartments(configuration.shopSettings?.value)),
          store.dispatch(getUserShopList(configuration.shopSettings?.value)),
        ]);
      }

      return res;
    }),
    store.dispatch(setAppUrl(`https://${req.headers.host}`)),
    store.dispatch(getWebsiteSettings(req.headers.host)),
    store.dispatch(getRate()),
    store.dispatch(getRewardFund()),
    store.dispatch(getTokenRates('WAIV')),
    store.dispatch(getCryptoPriceHistory()),
    store.dispatch(getGlobalProperties()),
    store.dispatch(getSwapEnginRates()),
    store.dispatch(getGlobalProperties()),
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
        config: getWebsiteConfiguration(state),
      }),
      {
        login,
        getNotifications,
        busyLogin,
        setUsedLocale,
        dispatchGetAuthGuestBalance,
        getCurrentAppSettings,
        setLocale,
        setSocialFlag,
        setLoadingStatus,
        getCoordinates,
      },
    )(SocialWrapper),
  ),
);

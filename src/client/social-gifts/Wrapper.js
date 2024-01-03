import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect, batch, useSelector } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { get, isEmpty } from 'lodash';
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
import { getObjectPosts } from '../../store/feedStore/feedActions';
import { getObject as getObjectAction } from '../../store/wObjectStore/wobjectsActions';
import {
  getUserDepartments,
  getUserShopList,
  getWobjectDepartments,
  getWobjectsShopList,
} from '../../store/shopStore/shopActions';
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
  setItemsForNavigation,
  setLoadingStatus,
  setMainObj,
} from '../../store/appStore/appActions';
import Header from './Header/Header';
import NotificationPopup from './../notifications/NotificationPopup';
import BBackTop from './../components/BBackTop';
import ErrorBoundary from './../widgets/ErrorBoundary';
import Loading from './../components/Icon/Loading';
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
import { getTokenRates } from '../../store/walletStore/walletActions';
import { hexToRgb } from '../../common/helpers';
import { initialColors } from '../websites/constants/colors';
import { getSwapEnginRates } from '../../store/ratesStore/ratesAction';
import { setLocale } from '../../store/settingsStore/settingsActions';
import { getObject, getObjectsByIds } from '../../waivioApi/ApiClient';
import { parseJSON } from '../../common/helpers/parseJSON';
import { getObjectName } from '../../common/helpers/wObjectHelper';

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
      return `/object/${i?.author_permlink}`;
    default:
      return i.linkToWeb || i.defaultShowLink;
  }
};

const SocialWrapper = props => {
  const isSocialGifts = useSelector(getIsSocialGifts);
  // const dispatch = useDispatch();
  const language = findLanguage(props.usedLocale);
  const antdLocale = getAntdLocale(language);
  const signInPage = props.location.pathname.includes('sign-in');
  const loadLocale = async locale => {
    const lang = await loadLanguage(locale);

    props.setUsedLocale(lang);
  };
  // const createWebsiteMenu = configuration => {
  //   if (!isEmpty(configuration?.shopSettings)) {
  //     if (configuration.shopSettings?.type === 'object') {
  //       getObject(configuration.shopSettings?.value).then(async wobject => {
  //         const menuItemLinks = wobject.menuItem?.reduce((acc, item) => {
  //           const body = parseJSON(item.body);
  //
  //           if (body?.linkToObject) {
  //             return [...acc, body?.linkToObject];
  //           }
  //
  //           return acc;
  //         }, []);
  //
  //         const customSort = get(wobject, 'sortCustom.include', []);
  //
  //         if (isEmpty(wobject.menuItem)) {
  //           dispatch(
  //             setItemsForNavigation([
  //               {
  //                 link: createLink(wobject),
  //                 name: getObjectName(wobject),
  //                 permlink: wobject?.author_permlink,
  //                 object_type: wobject?.object_type,
  //               },
  //               {
  //                 name: 'Legal',
  //                 link: '/checklist/ljc-legal',
  //                 permlink: 'ljc-legal',
  //                 object_type: 'list',
  //               },
  //             ]),
  //           );
  //
  //           props.setLoadingStatus(true);
  //         } else {
  //           const listItems = isEmpty(menuItemLinks)
  //             ? []
  //             : await getObjectsByIds({ authorPermlinks: menuItemLinks, locale: props.locale });
  //
  //           const compareList = wobject?.menuItem?.map(wobjItem => {
  //             const body = parseJSON(wobjItem.body);
  //             const currItem = body?.linkToObject
  //               ? listItems.wobjects.find(wobj => wobj.author_permlink === body?.linkToObject)
  //               : body;
  //
  //             return {
  //               ...wobjItem,
  //               ...currItem,
  //               body,
  //             };
  //           });
  //           const sortingButton = customSort.reduce((acc, curr) => {
  //             const findObj = compareList.find(wobj => wobj.permlink === curr);
  //
  //             return findObj ? [...acc, findObj] : acc;
  //           }, []);
  //           const buttonList = [
  //             ...sortingButton,
  //             ...compareList?.filter(i => !customSort.includes(i.permlink)),
  //           ].map(i => ({
  //             link: createLink(i),
  //             name: i?.body?.title || getObjectName(i),
  //             type: i.body.linkToObject ? 'nav' : 'blank',
  //             permlink: i.body.linkToObject,
  //             object_type: i?.object_type,
  //           }));
  //
  //           dispatch(
  //             setItemsForNavigation([
  //               ...buttonList,
  //               {
  //                 name: 'Legal',
  //                 link: '/checklist/ljc-legal',
  //                 permlink: 'ljc-legal',
  //                 object_type: 'list',
  //               },
  //             ]),
  //           );
  //           props.setLoadingStatus(true);
  //         }
  //       });
  //     }
  //   }
  // };

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

      const mainColor = res.configuration.colors?.mapMarkerBody || initialColors.marker;
      const textColor = res.configuration.colors?.mapMarkerText || initialColors.text;

      document.body.style.setProperty('--website-color', mainColor);
      document.body.style.setProperty('--website-hover-color', hexToRgb(mainColor, 6));
      document.body.style.setProperty('--website-text-color', textColor);
      document.body.style.setProperty('--website-light-color', hexToRgb(mainColor, 1));

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
      loadLocale(props.locale);
      // createWebsiteMenu(res.configuration);
    });
  }, [props.locale]);

  useEffect(() => {
    if (props.nightmode) document.body.classList.add('nightmode');
    else document.body.classList.remove('nightmode');
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
  // setLoadingStatus: PropTypes.func,
  getTokenRates: PropTypes.func.isRequired,
  isOpenWalletTable: PropTypes.bool,
  loadingFetching: PropTypes.bool,
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

SocialWrapper.fetchData = async ({ store, req, url }) => {
  const state = store.getState();
  let activeLocale = getLocale(state);

  if (activeLocale === 'auto') {
    activeLocale = req.cookies.language || getRequestLocale(req.get('Accept-Language'));
  }
  const lang = loadLanguage(activeLocale);

  return Promise.allSettled([
    store.dispatch(getWebsiteConfigForSSR(req.headers.host)).then(res => {
      const configuration = res.value;
      const promises = [store.dispatch(setMainObj(configuration.shopSettings))];

      if (!isEmpty(configuration?.shopSettings)) {
        if (configuration.shopSettings?.type === 'object') {
          return getObject(configuration.shopSettings?.value).then(async wobject => {
            const menuItemLinks = wobject.menuItem?.reduce((acc, item) => {
              const body = parseJSON(item.body);

              if (body?.linkToObject) {
                return [...acc, body?.linkToObject];
              }

              return acc;
            }, []);
            const customSort = get(wobject, 'sortCustom.include', []);

            if (isEmpty(wobject.menuItem)) {
              return store.dispatch(
                setItemsForNavigation([
                  {
                    link: createLink(wobject),
                    name: getObjectName(wobject),
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
            }
            const listItems = isEmpty(menuItemLinks)
              ? []
              : await getObjectsByIds({ authorPermlinks: menuItemLinks, locale: activeLocale });

            const compareList = wobject?.menuItem?.map(wobjItem => {
              const body = parseJSON(wobjItem.body);
              const currItem = body?.linkToObject
                ? listItems.wobjects.find(wobj => wobj.author_permlink === body?.linkToObject)
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
              ...compareList?.filter(i => !customSort.includes(i.permlink)),
            ].map(i => ({
              link: createLink(i),
              name: i?.body?.title || getObjectName(i),
              type: i.body.linkToObject ? 'nav' : 'blank',
              permlink: i.body.linkToObject,
              object_type: i?.object_type,
              newsfeed: i.newsFeed?.permlink,
            }));

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
            }

            if (buttonList[0]?.object_type === 'shop') {
              promises.push(store.dispatch(getWobjectDepartments(buttonList[0]?.permlink)));
              promises.push(store.dispatch(getWobjectsShopList(buttonList[0]?.permlink)));
            }
            if (url === '/')
              promises.push(store.dispatch(getObjectAction(buttonList[0]?.permlink)));

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
          });
        }

        return Promise.allSettled([
          store.dispatch(getUserDepartments(configuration.shopSettings?.value)),
          store.dispatch(getUserShopList(configuration.shopSettings?.value)),
        ]);
      }

      return res;
    }),
    store.dispatch(setAppUrl(`https://${req.headers.host}`)),
    store.dispatch(setUsedLocale(lang)),
    store.dispatch(login()),
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
        setLoadingStatus,
      },
    )(SocialWrapper),
  ),
);

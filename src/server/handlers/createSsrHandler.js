import Cookie from 'js-cookie';
import { setTimeout } from 'timers';
import React from 'react';
import { Provider } from 'react-redux';
import { get } from 'lodash';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { matchRoutes, renderRoutes } from 'react-router-config';
import hivesigner from 'hivesigner';
import { isbot } from 'isbot';
import { getRequestLocale, loadLanguage } from '../../common/translations';
import {
  setAppHost,
  setIsDiningGifts,
  setIsSocialGifts,
  setParentHost,
  setUsedLocale,
} from '../../store/appStore/appActions';
import { loginFromServer } from '../../store/authStore/authActions';
import { setLocale } from '../../store/settingsStore/settingsActions';

import { getSettingsAdsense, getSettingsWebsite, waivioAPI } from '../../waivioApi/ApiClient';
import getStore from '../../store/store';
import renderSsrPage from '../renderers/ssrRenderer';
import switchRoutes from '../../routes/switchRoutes';
import { getCachedPage, setCachedPage, updateBotCount } from './cachePageHandler';
import { REDIS_KEYS } from '../../common/constants/ssrData';
import { sismember } from '../redis/redisClient';
import { checkAppStatus, isInheritedHost } from '../../common/helpers/redirectHelper';
import { listOfWebsiteWithMainPage } from '../../common/constants/listOfWebsite';
import { listOfSocialWebsites } from '../../client/social-gifts/listOfSocialWebsites';

// eslint-disable-next-line import/no-dynamic-require
const assets = require(process.env.MANIFEST_PATH);

const ssrTimeout = 5000;

function createTimeout(timeout, promise) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(`Request has timed out. It should take no longer than ${timeout}ms.`));
    }, timeout);
    promise.then(resolve, reject);
  });
}

const removeQueryParams = url => url.split('?')[0];

const isPageExistSitemap = async ({ url = '', host }) => {
  if (url === '/') return true;

  const searchPage = url.startsWith('/discover-objects') || url.startsWith('/discover-departments');
  if (searchPage) return true;

  const pathOnly = removeQueryParams(url);
  const key = `${REDIS_KEYS.SSR_SITEMAP_SET}:${host}`;
  const member = `https://${host}${pathOnly}`;
  return sismember({ key, member });
};

export default function createSsrHandler(template) {
  return async function serverSideResponse(req, res) {
    const hostname = req.hostname;
    const isWaivio = req.hostname.includes('waivio');
    const userAgent = req.get('User-Agent');
    const inheritedHost = isInheritedHost(hostname);

    if (inheritedHost) {
      const { redirect, redirectPath } = await checkAppStatus(hostname);
      if (redirect) return res.redirect(302, redirectPath);
    }

    if (req.url.includes('/checklist/'))
      return res.redirect(301, req.url.replace('/checklist/', '/object/'));

    const isUser = !isbot(userAgent);
    const sc2Api = new hivesigner.Client({
      app: process.env.STEEMCONNECT_CLIENT_ID,
      baseURL: process.env.STEEMCONNECT_HOST || 'https://hivesigner.com',
      callbackURL: process.env.STEEMCONNECT_REDIRECT_URL,
    });
    const store = getStore(sc2Api, waivioAPI, req.url);

    store.dispatch(setAppHost(hostname));
    // store.dispatch(setAppAgent(hostname));

    let settings = {};
    let adsenseSettings = {};
    let parentHost = '';

    if (!isWaivio) {
      if (listOfWebsiteWithMainPage.some(site => site === hostname))
        store.dispatch(setIsDiningGifts(true));
      if (listOfSocialWebsites.some(site => site === hostname))
        store.dispatch(setIsSocialGifts(true));

      try {
        settings = await getSettingsWebsite(hostname);
        adsenseSettings = await getSettingsAdsense(hostname);
        parentHost = (await store.dispatch(setParentHost(hostname))).value;
      } catch (e) {
        console.error('fall settings requests str 70');
      }
    }

    const splittedUrl = req.url.split('?');
    const query = splittedUrl[1] ? new URLSearchParams(`?${splittedUrl[1]}`) : null;
    const access_token =
      query && query.get('access_token') ? query.get('access_token') : req?.cookies?.access_token;
    const socialProvider = query ? query.get('socialProvider') : undefined;

    if (req.cookies && !req.url?.includes('sign-in')) {
      sc2Api.setAccessToken(access_token);
      const data = { access_token, socialProvider, ...req?.cookies };
      try {
        await store.dispatch(loginFromServer(data)).then(async res => {
          try {
            const language = res?.value?.userMetaData?.settings.locale;
            store.dispatch(setLocale(language));
            store.dispatch(setUsedLocale(await loadLanguage(language)));
          } catch (e) {
            console.log(e, 'e');
          }
        });
      } catch (e) {
        console.log(`login error ${e}`);
      }
    }

    const promises = [];
    const loc =
      query?.get('usedLocale') ||
      settings?.language ||
      req.cookies.language ||
      getRequestLocale(req.get('Accept-Language'));
    if (!isWaivio && !req.cookies.access_token) {
      store.dispatch(setLocale(loc));
      store.dispatch(setUsedLocale(await loadLanguage(loc)));
    }
    const routes = switchRoutes(hostname, parentHost);
    const branch = matchRoutes(routes, splittedUrl[0]);
    if (isUser) {
      return res.send(
        renderSsrPage(
          store,
          null,
          assets,
          template,
          isWaivio,
          get(settings, 'googleAnalyticsTag', ''),
          get(settings, 'googleGSCTag', ''),
          get(settings, 'googleEventSnippet', ''),
          get(settings, 'googleAdsConfig', ''),
          get(adsenseSettings, 'code', ''),
        ),
      );
    }

    try {
      const searchBot = isbot(req.get('User-Agent'));
      if (inheritedHost && searchBot) {
        const pageExist = await isPageExistSitemap({ host: hostname, url: req.url });
        if (!pageExist) return res.redirect(302, `https://www.waivio.com${req.url}`);
      }

      if (searchBot) {
        await updateBotCount(req);
        const cachedPage = await getCachedPage(req);
        if (cachedPage) {
          return res.send(cachedPage);
        }
      }

      branch.forEach(({ route, match }) => {
        const fetchData = route?.component?.fetchData;
        if (fetchData instanceof Function) {
          promises.push(fetchData({ store, match, req, res, query, url: req.url }));
        }
      });

      await createTimeout(ssrTimeout, Promise.all(promises));

      if (res.headersSent) return null;

      const context = {};

      const content = renderToString(
        <Provider store={store}>
          <StaticRouter location={req.url} context={context}>
            {renderRoutes(routes)}
          </StaticRouter>
        </Provider>,
      );

      if (context.status) res.status(context.status);

      const page = renderSsrPage(
        store,
        content,
        assets,
        template,
        isWaivio,
        get(settings, 'googleAnalyticsTag', ''),
        get(settings, 'googleGSCTag', ''),
        get(settings, 'googleEventSnippet', ''),
        get(settings, 'googleAdsConfig', ''),
        get(adsenseSettings, 'code', ''),
      );

      if (searchBot) await setCachedPage({ page, req });

      console.log('from ssr');

      return res.send(page);
    } catch (err) {
      console.error(
        `SSR error occured, falling back to bundled application instead ${req.url}`,
        err,
      );

      return res.send(
        renderSsrPage(
          store,
          null,
          assets,
          template,
          isWaivio,
          get(settings, 'googleAnalyticsTag', ''),
          get(settings, 'googleGSCTag', ''),
          get(settings, 'googleEventSnippet', ''),
          get(settings, 'googleAdsConfig', ''),
          get(adsenseSettings, 'code', ''),
        ),
      );
    }
  };
}

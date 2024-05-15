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
import { setAppHost, setParentHost, setUsedLocale } from '../../store/appStore/appActions';
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

const isPageExistSitemap = async ({ url, host }) => {
  if (url === '/') return true;
  const key = `${REDIS_KEYS.SSR_SITEMAP_SET}:${host}`;
  const member = `https://${host}${url}`;
  return sismember({ key, member });
};

export default function createSsrHandler(template) {
  return async function serverSideResponse(req, res) {
    try {
      const hostname = req.hostname;
      const searchBot = isbot(req.get('User-Agent'));
      const inheritedHost = isInheritedHost(hostname);
      if (inheritedHost) {
        const { redirect, redirectPath } = await checkAppStatus(hostname);
        if (redirect) return res.redirect(302, redirectPath);
      }
      if (inheritedHost && searchBot) {
        const pageExist = await isPageExistSitemap({ host: hostname, url: req.url });
        if (!pageExist) return res.redirect(302, `https://www.waivio.com${req.url}`);
      }

      if (searchBot) {
        await updateBotCount(req);
        const cachedPage = await getCachedPage(req);
        if (cachedPage) {
          console.log('SEND CACHED PAGE');
          return res.send(cachedPage);
        }
      }

      const sc2Api = new hivesigner.Client({
        app: process.env.STEEMCONNECT_CLIENT_ID,
        baseURL: process.env.STEEMCONNECT_HOST || 'https://hivesigner.com',
        callbackURL: process.env.STEEMCONNECT_REDIRECT_URL,
      });

      const isWaivio = hostname.includes('waivio');
      let settings = {};
      let parentHost = '';
      let adsenseSettings = {};
      const store = getStore(sc2Api, waivioAPI, req.url);

      store.dispatch(setAppHost(req.hostname));

      if (!isWaivio) {
        settings = await getSettingsWebsite(hostname);
        adsenseSettings = await getSettingsAdsense(hostname);
        parentHost = (await store.dispatch(setParentHost(hostname))).value;
      }

      const splittedUrl = req.url.split('?');
      const query = splittedUrl[1] ? new URLSearchParams(`?${splittedUrl[1]}`) : null;
      const access_token = query ? query.get('access_token') : req?.cookies?.access_token;
      const socialProvider = query ? query.get('socialProvider') : undefined;

      if (req.cookies && !req.url?.includes('sign-in')) {
        sc2Api.setAccessToken(access_token);
        const data = { access_token, socialProvider, ...req?.cookies };
        await store.dispatch(loginFromServer(data)).then(async res => {
          try {
            const language = res?.value?.userMetaData?.settings.locale;
            store.dispatch(setLocale(language));
            store.dispatch(setUsedLocale(await loadLanguage(language)));
          } catch (e) {
            console.log(e, 'e');
          }
        });
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

      return res.send(page);
    } catch (err) {
      console.error('SSR error occured, falling back to bundled application instead', err);
      let settings = {};
      let adsenseSettings = {};
      const isWaivio = req.hostname.includes('waivio');

      if (!isWaivio) {
        settings = await getSettingsWebsite(req.hostname);
        adsenseSettings = await getSettingsAdsense(req.hostname);
      }
      return res.send(
        renderSsrPage(
          null,
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

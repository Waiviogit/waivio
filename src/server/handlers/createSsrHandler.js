import { setTimeout } from 'timers';
import React from 'react';
import { Provider } from 'react-redux';
import { get, isNil } from 'lodash';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { matchRoutes, renderRoutes } from 'react-router-config';
import hivesigner from 'hivesigner';
import { isbot } from 'isbot';

import {
  getParentHost,
  getSettingsAdsense,
  getSettingsWebsite,
  waivioAPI,
} from '../../waivioApi/ApiClient';
import getStore from '../../store/store';
import renderSsrPage from '../renderers/ssrRenderer';
import switchRoutes from '../../routes/switchRoutes';
import { getCachedPage, isSearchBot, setCachedPage, updateBotCount } from './cachePageHandler';
import { isCustomDomain } from '../../client/social-gifts/listOfSocialWebsites';
import { REDIS_KEYS } from '../../common/constants/ssrData';
import { sismember } from '../redis/redisClient';
import NOT_FOUND_PAGE from '../pages/notFoundPage';

// eslint-disable-next-line import/no-dynamic-require
const assets = require(process.env.MANIFEST_PATH);

const ssrTimeout = 5000;

const isInheritedHost = host =>
  !['waivio.com', 'www.waivio.com', 'waiviodev.com', 'social.gifts', 'dining.gifts'].includes(host);

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

      if (inheritedHost && searchBot) {
        const pageExist = await isPageExistSitemap({ host: hostname, url: req.url });
        if (!pageExist) return res.status(404).send(NOT_FOUND_PAGE);
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
      // const hostname = req.headers.host;

      const isWaivio = hostname.includes('waivio');
      let settings = {};
      let parentHost = '';
      let adsenseSettings = {};

      if (!isWaivio) {
        settings = await getSettingsWebsite(hostname);
        adsenseSettings = await getSettingsAdsense(hostname);

        if (isCustomDomain(hostname)) {
          parentHost = await getParentHost(hostname);
        }
      }

      if (req.cookies.access_token) sc2Api.setAccessToken(req.cookies.access_token);

      const store = getStore(sc2Api, waivioAPI, req.url);
      const routes = switchRoutes(hostname, parentHost);
      const splittedUrl = req.url.split('?');
      const branch = matchRoutes(routes, splittedUrl[0]);
      const query = splittedUrl[1] ? new URLSearchParams(`?${splittedUrl[1]}`) : null;
      const promises = branch.map(({ route, match }) => {
        const fetchData = route?.component?.fetchData;

        if (fetchData instanceof Function) {
          return fetchData({ store, match, req, res, query, url: req.url });
        }

        return Promise.resolve(null);
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

import { setTimeout } from 'timers';
import React from 'react';
import { Provider } from 'react-redux';
import { get } from 'lodash';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { matchRoutes, renderRoutes } from 'react-router-config';
import hivesigner from 'hivesigner';

import {
  getCurrentAppSettings,
  getSettingsWebsite,
  getWebsitesConfiguration,
  waivioAPI,
} from '../../waivioApi/ApiClient';
import getStore from '../../store/store';
import renderSsrPage from '../renderers/ssrRenderer';
import switchRoutes from '../../routes/switchRoutes';
import { initialColors } from '../../client/websites/constants/colors';
import { hexToRgb } from '../../common/helpers';
import { getWebsiteColors } from '../../store/appStore/appSelectors';

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

export default function createSsrHandler(template) {
  return async function serverSideResponse(req, res) {
    try {
      const sc2Api = new hivesigner.Client({
        app: process.env.STEEMCONNECT_CLIENT_ID,
        baseURL: process.env.STEEMCONNECT_HOST || 'https://hivesigner.com',
        callbackURL: process.env.STEEMCONNECT_REDIRECT_URL,
      });
      const hostname = req.hostname;
      const isWaivio = hostname.includes('waivio');
      let settings = {};
      let config = {};

      if (!isWaivio) {
        settings = await getSettingsWebsite(hostname);
        config = await getCurrentAppSettings(hostname);
      }

      if (req.cookies.access_token) sc2Api.setAccessToken(req.cookies.access_token);

      const store = getStore(sc2Api, waivioAPI, req.url);
      const routes = switchRoutes(hostname, get(settings, 'configuration.header.startup'));
      const branch = matchRoutes(routes, req.url.split('?')[0]);

      const promises = branch.map(({ route, match }) => {
        const fetchData = route?.component?.fetchData;

        if (fetchData instanceof Function) {
          return fetchData({ store, match, req, res });
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
      const mainColor = config?.configuration?.colors?.mapMarkerBody || initialColors.marker;
      const secondaryColor = config?.configuration?.colors?.mapMarkerText || initialColors.text;
      console.log(mainColor);
      console.log(secondaryColor);
      return res.send(
        renderSsrPage(
          store,
          content,
          assets,
          template,
          isWaivio,
          get(settings, 'googleAnalyticsTag', ''),
          mainColor,
          hexToRgb(mainColor, 1),
          secondaryColor,
        ),
      );
    } catch (err) {
      console.error('SSR error occured, falling back to bundled application instead', err);

      return res.send(
        renderSsrPage(null, null, assets, template, req.hostname === 'waivio.com', ''),
      );
    }
  };
}

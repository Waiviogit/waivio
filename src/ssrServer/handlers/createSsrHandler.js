const renderSsrPage = require('../renderers/ssrRenderer') ;
// const { Provider } = require('react-redux') ;
const { get } = require('lodash') ;
// const { renderToString } = require('react-dom/server');
// const { StaticRouter } = require ('react-router');
// const { matchRoutes, renderRoutes } = require('react-router-config');
// const  hivesigner  =require('hivesigner');
// const {
//   // getParentHost,
//   // getSettingsAdsense,
//   getSettingsWebsite,
//   // waivioAPI,
// } = require('../../waivioApi/ApiClient') ;
// const getStore = require('../../store/store') ;
// const switchRoutes = require('../../routes/switchRoutes');
// const { isCustomDomain } = require('../../client/social-gifts/listOfSocialWebsites');
const React = require ('react');

const paths = require('../../../scripts/paths');
// eslint-disable-next-line import/no-dynamic-require
const assets = require(paths.assets);

const ssrTimeout = 5000;

function createTimeout(timeout, promise) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(`Request has timed out. It should take no longer than ${timeout}ms.`));
    }, timeout);
    promise.then(resolve, reject);
  });
}


const responseBundledApplication = async ({req, res, template}) => {
  const settings = {};
  // const isWaivio = req.hostname.includes('waivio');
  const isWaivio = true

  // if (!isWaivio) {
  //   settings = await getSettingsWebsite(req.hostname);
  // }

  return res.send(
    renderSsrPage(
      null,
      null,
      assets,
      template,
      isWaivio,
      get(settings, 'googleAnalyticsTag', ''),
    ),
  );
}

 function createSsrHandler(template) {
  return async function serverSideResponse(req, res) {
    // try {
    //   // if (await isSearchBot(req)) {
    //   //   await updateBotCount(req);
    //   //   const cachedPage = await getCachedPage(req);
    //   //
    //   //   if (cachedPage) {
    //   //     console.log('SEND CACHED PAGE');
    //   //
    //   //     return res.send(cachedPage);
    //   //   }
    //   // }
    //
    //   const sc2Api = new hivesigner.Client({
    //     app: process.env.STEEMCONNECT_CLIENT_ID,
    //     baseURL: process.env.STEEMCONNECT_HOST || 'https://hivesigner.com',
    //     callbackURL: process.env.STEEMCONNECT_REDIRECT_URL,
    //   });
    //   const hostname = req.headers.host;
    //   const isWaivio = hostname.includes('waivio');
    //   let settings = {};
    //   let parentHost;
    //   let adsenseSettings = {};
    //
    //   if (!isWaivio) {
    //     settings = await getSettingsWebsite(hostname);
    //     adsenseSettings = await getSettingsAdsense(hostname);
    //
    //     // write file here
    //     if (isCustomDomain(hostname)) {
    //       parentHost = await getParentHost(hostname);
    //     }
    //   }
    //
    //   if (req.cookies.access_token) sc2Api.setAccessToken(req.cookies.access_token);
    //
    //   const store = getStore(sc2Api, waivioAPI, req.url);
    //   const routes = switchRoutes(hostname, parentHost);
    //   const splittedUrl = req.url.split('?');
    //   const branch = matchRoutes(routes, splittedUrl[0]);
    //   const query = splittedUrl[1] ? new URLSearchParams(`?${splittedUrl[1]}`) : null;
    //   const promises = branch.map(({ route, match }) => {
    //     const fetchData = route?.component?.fetchData;
    //
    //     if (fetchData instanceof Function) {
    //       return fetchData({ store, match, req, res, query });
    //     }
    //
    //     return Promise.resolve(null);
    //   });
    //
    //   await createTimeout(ssrTimeout, Promise.all(promises));
    //
    //   if (res.headersSent) return null;
    //
    //   const context = {};
    //
    //   const content = renderToString(
    //     <Provider store={store}>
    //       <StaticRouter location={req.url} context={context}>
    //         {renderRoutes(routes)}
    //       </StaticRouter>
    //     </Provider>,
    //   );
    //
    //   if (context.status) res.status(context.status);
    //
    //   const page = renderSsrPage(
    //     store,
    //     content,
    //     assets,
    //     template,
    //     isWaivio,
    //     get(settings, 'googleAnalyticsTag', ''),
    //     get(adsenseSettings, 'code', ''),
    //   );
    //
    //   // await setCachedPage({ page, req });
    //
    //   return res.send(page);
    // } catch (err) {
    console.log()
    return responseBundledApplication({req, res, template})
    // };
  }
}

module.exports = createSsrHandler;

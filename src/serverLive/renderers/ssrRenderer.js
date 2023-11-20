const { Helmet }  = require('react-helmet');

 function renderSsrPage(store, html, assets, template, isWaivio, googleTag, adSense) {
  const preloadedState = store ? store.getState() : {};

  const helmet = Helmet.renderStatic();
  const baseHelmet = helmet.meta.toString() + helmet.title.toString() + helmet.link.toString();

  let header = baseHelmet;

  const scripts = `<script>window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)
    .replace(/\u2028/g, '\\n')
    .replace(/</g, '\\u003c')}</script>`;

  Object.keys(assets).forEach(key => {
    if (key) {
      if (assets[key].css) header += `<link rel="stylesheet" href="${assets[key].css}" />`;
    //  if (assets[key].js) scripts += `<script src="${assets[key].js}" defer></script>`;
    }
  });

  const production = process.env.NODE_ENV === 'production';

  const nightmode = preloadedState && preloadedState.settings && preloadedState.settings.nightmode;
  const tag = isWaivio ? 'G-WRV0RFTWBX' : googleTag;
  let googleAnalytics = '';

  if (tag)
    googleAnalytics = `<script async src="https://www.googletagmanager.com/gtag/js?id=${tag}"></script>
  <script>{
    window.dataLayer = window.dataLayer || [];
    
    function gtag(){
        dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', '${tag}', { 'debug_mode':true });}
  </script>`;

  return template({
    header,
    html,
    scripts,
    production,
    nightmode,
    googleAnalytics,
    adSense,
  });
}

module.exports = renderSsrPage

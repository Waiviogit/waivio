import { Helmet } from 'react-helmet';

export default function renderSsrPage({
  store,
  html,
  assets,
  template,
  isWaivio,
  googleTag,
  googleGSC,
  verifTags,
  googleEventSnippetTag,
  googleAdsConfig,
  adSense,
  analyticsInject,
}) {
  const preloadedState = store ? store.getState() : {};

  const helmet = Helmet.renderStatic();
  const baseHelmet = helmet.meta.toString() + helmet.title.toString() + helmet.link.toString();

  let header = baseHelmet;
  let scripts = '';
  try {
    scripts = `<script>window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)
      .replace(/\u2028/g, '\\n')
      .replace(/</g, '\\u003c')}</script>`;
  } catch (e) {
    console.error('Serialization error', e);
    scripts = `<script>window.__PRELOADED_STATE__ = {}</script>`;
  }

  Object.keys(assets).forEach(key => {
    if (key) {
      if (assets[key].css) header += `<link rel="stylesheet" href="${assets[key].css}" />`;
      if (assets[key].js) scripts += `<script src="${assets[key].js}" defer></script>`;
    }
  });
  if (analyticsInject) scripts += analyticsInject;

  const production = process.env.NODE_ENV === 'production';

  const nightmode = preloadedState && preloadedState.settings && preloadedState.settings.nightmode;
  let googleGSCTag = isWaivio
    ? `<meta name="google-site-verification" content="JVVPBT1TEtH6a-w94_PZ2OcilaYPMOCexi7N1jq0tnk" />`
    : googleGSC;
  const verificationTags = Array.isArray(verifTags) ? verifTags.join('\n') : '';
  let tag = '';

  if (isWaivio && production) tag = 'G-WRV0RFTWBX';
  if (googleTag) tag = googleTag;

  let googleAnalytics = '';
  if (tag)
    googleAnalytics = `<script async src="https://www.googletagmanager.com/gtag/js?id=${tag}"></script>
  <script>{
    window.dataLayer = window.dataLayer || [];
    
    function gtag(){
        dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', '${tag}', { 'debug_mode':false });
    ${googleAdsConfig}
  }
 
  </script>`;

  const googleEventSnippet = googleEventSnippetTag
    ? googleEventSnippetTag?.replace('window.location = url', '')
    : '';

  return template({
    header,
    html,
    scripts,
    production,
    nightmode,
    googleAnalytics,
    googleGSCTag,
    verificationTags,
    googleEventSnippet,
    adSense,
  });
}

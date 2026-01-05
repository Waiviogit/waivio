import { Helmet } from 'react-helmet';

export default function renderSsrPage(
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
) {
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

  const isDev = process.env.NODE_ENV === 'development';
  
  // In dev mode with Vite, inject Vite client for HMR
  if (isDev && assets.viteClient) {
    scripts += `<script type="module" src="${assets.viteClient}"></script>`;
  }

  Object.keys(assets).forEach(key => {
    if (key && key !== 'viteClient') {
      if (assets[key].css) header += `<link rel="stylesheet" href="${assets[key].css}" />`;
      if (assets[key].js) {
        // Use module type for Vite dev server URLs
        const isModule = isDev && assets[key].js.includes('localhost');
        const scriptType = isModule ? 'type="module"' : 'defer';
        scripts += `<script ${scriptType} src="${assets[key].js}"></script>`;
      }
    }
  });

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
    gtag('config', '${tag}', { 'debug_mode':true });
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

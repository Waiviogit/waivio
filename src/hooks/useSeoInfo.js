import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { isNil } from 'lodash';

import { getAppUrl, getMainObj } from '../store/appStore/appSelectors';
import { getLastPermlinksFromHash } from '../common/helpers/wObjectHelper';

const prefereCanonical = (appUrl, isChecklist) => {
  const location = useLocation();
  let url = `${appUrl}${location.pathname}`;

  if (location.search) {
    url = `${appUrl}${location.pathname}${location.search}`;
  }
  if (location.hash) {
    if (isChecklist) {
      const pathArray = location.pathname.split('/');

      pathArray.splice(2, 1, getLastPermlinksFromHash(location.hash));

      url = `${appUrl}${pathArray.join('/')}`;
    } else url += location.hash;
  }

  return url;
};

export const useSeoInfo = isChecklist => {
  const appUrl = useSelector(getAppUrl);
  const descriptionSite = useSelector(getMainObj).description;

  return {
    canonicalUrl: prefereCanonical(appUrl, isChecklist),
    appUrl,
    descriptionSite,
  };
};
export const useSeoInfoWithAppUrl = (appHost, isChecklist) => {
  const loc = useLocation();
  const descriptionSite = useSelector(getMainObj).description;
  const host = loc.pathname === '/' ? location.hostname : appHost;
  const appUrl = `https://${host}`;

  return {
    canonicalUrl: prefereCanonical(appUrl, isChecklist),
    descriptionSite,
  };
};

export const getCanonicalHostForPost = metadataHost => {
  const waivioHosts = ['waivio.com', 'waiviodev.com'];
  const originalWaivioHost = 'www.waivio.com';

  if (isNil(metadataHost) || waivioHosts.includes(metadataHost)) {
    return originalWaivioHost;
  }

  return metadataHost;
};

export const checkAboutCanonicalUrl = link => {
  const pattern = /\/about$/;

  if (pattern.test(link)) {
    return link.replace(pattern, '');
  }

  return link;
};

export default null;

import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router';
import { isNil } from 'lodash';

import { getAppUrl, getMainObj } from '../store/appStore/appSelectors';

const originalWaivioHost = 'www.waivio.com';

const prefereCanonical = (appUrl, isChecklist, objectType) => {
  const location = useLocation();
  const { name } = useParams();
  const isWaivio = appUrl.includes('waivio');
  let url = `${appUrl}${location?.pathname}`;

  if (!isWaivio) {
    url = `${appUrl}/object/${name}`;
  }

  if (['list', 'page'].includes(objectType) && appUrl?.includes(originalWaivioHost)) {
    url = `${appUrl}/object/${name}/${objectType}`;
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
export const useSeoInfoWithAppUrl = (appHost, isChecklist, objectType) => {
  const loc = useLocation();
  const app = useSelector(getAppUrl);
  const descriptionSite = useSelector(getMainObj).description;
  const host = loc.pathname === '/' ? app : `https://${appHost}`;

  return {
    canonicalUrl: prefereCanonical(host, isChecklist, objectType),
    descriptionSite,
  };
};

export const getCanonicalHostForPost = metadataHost => {
  const waivioHosts = ['waivio.com', 'waiviodev.com'];

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

import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import { getAppUrl, getMainObj } from '../store/appStore/appSelectors';

export const useSeoInfo = isChecklist => {
  const location = useLocation();
  const appUrl = useSelector(getAppUrl);
  const descriptionSite = useSelector(getMainObj).description;
  const prefereCanonical = () => {
    let url = `${appUrl}${location.pathname}`;

    if (location.search) {
      url = `${appUrl}${location.pathname}${location.search}`;
    }
    if (location.hash) {
      if (isChecklist) {
        url = `${appUrl}${location.pathname}${location.search}${location.hash}`;
      } else url += location.hash;
    }

    return url;
  };

  return {
    canonicalUrl: prefereCanonical(),
    appUrl,
    descriptionSite,
  };
};

export const checkAboutCanonicalUrl = link => {
  const pattern = /\/about$/;

  if (pattern.test(link)) {
    return link.replace(pattern, '');
  }

  return link;
};

export default null;

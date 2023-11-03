import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import { getAppUrl, getMainObj } from '../store/appStore/appSelectors';
import { getLastPermlinksFromHash } from '../common/helpers/wObjectHelper';

export const useSeoInfo = isChecklist => {
  const location = useLocation();
  const appUrl = useSelector(getAppUrl);
  const descriptionSite = useSelector(getMainObj).description;
  const prefereCanonical = () => {
    let url = `${appUrl}${location.pathname}`;

    if (location.hash) {
      if (isChecklist) {
        const pathArray = location.pathname.split('/');

        pathArray.splice(2, 1, getLastPermlinksFromHash(location.hash));

        url = `${appUrl}${pathArray.join('/')}`;
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
    // If it does, remove "/about" from the link
    return link.replace(pattern, '');
  }

  return link;
};

export default null;

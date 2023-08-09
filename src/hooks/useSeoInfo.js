import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import { getAppUrl } from '../store/appStore/appSelectors';

export const useSeoInfo = () => {
  const location = useLocation();
  const appUrl = useSelector(getAppUrl);

  const prefereCanonical = () => {
    let url = `${appUrl}${location.pathname}`;

    if (location.search) url += location.search;
    if (location.hash) url += location.hash;

    return url;
  };

  return {
    canonicalUrl: prefereCanonical(),
  };
};

export default null;

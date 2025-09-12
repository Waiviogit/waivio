import { baseUrl } from '../../waivioApi/routes';
import { getSiteStatusInfo } from '../../waivioApi/ApiClient';

export const isInheritedHost = host =>
  ![
    'waivio.com',
    'www.waivio.com',
    'waiviodev.com',
    'social.gifts',
    'dining.gifts',
    'socialgifts.pp.ua',
    'dinings.pp.ua',
  ].includes(host);

const redirectMap = {
  'socialgifts.pp.ua': 'https://socialgifts.pp.ua',
  'dinings.pp.ua': 'https://dinings.pp.ua',
  'dining.gifts': 'https://dining.gifts',
  'social.gifts': 'https://social.gifts',
};

const notFoundRedirectPath = (host = '') => {
  const domain = Object.keys(redirectMap).find(key => host?.includes(key));
  const redirectUrl = domain ? redirectMap[domain] : baseUrl;

  return redirectUrl;
};

export const checkAppStatus = async host => {
  if (process.env.NODE_ENV === 'development') return { redirect: false };
  const statusInfo = await getSiteStatusInfo(host);

  if (!statusInfo.status) {
    return { redirect: true, status: 301, redirectPath: notFoundRedirectPath(host) };
  }

  if (statusInfo.status !== 'active') {
    return { redirect: true, status: 307, redirectPath: `https://${statusInfo.parentHost}` };
  }

  return { redirect: false };
};

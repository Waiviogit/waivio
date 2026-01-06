import axios from 'axios';

const IS_DEV = process.env.NODE_ENV === 'development';

// Whitelist of known hosts that don't need validation
const WHITELISTED_HOSTS = [
  'waivio.com',
  'www.waivio.com',
  'waiviodev.com',
  'social.gifts',
  'dining.gifts',
  'socialgifts.pp.ua',
  'dinings.pp.ua',
  'localhost',
];

// Map for redirect URLs based on host patterns
const REDIRECT_MAP = {
  'socialgifts.pp.ua': 'https://socialgifts.pp.ua',
  'dinings.pp.ua': 'https://dinings.pp.ua',
  'dining.gifts': 'https://dining.gifts',
  'social.gifts': 'https://social.gifts',
};

// Default fallback URL
const DEFAULT_REDIRECT = 'https://www.waivio.com';

// API base URL based on environment
const API_BASE_URL = IS_DEV
  ? 'https://waiviodev.com/api'
  : 'https://www.waivio.com/api';

/**
 * Check if host is an inherited (non-whitelisted) host
 */
const isInheritedHost = host => !WHITELISTED_HOSTS.includes(host);

/**
 * Get the redirect path for a not-found host
 */
const getNotFoundRedirectPath = (host = '') => {
  const domain = Object.keys(REDIRECT_MAP).find(key => host?.includes(key));
  return domain ? REDIRECT_MAP[domain] : DEFAULT_REDIRECT;
};

/**
 * Check site status via API
 */
const getSiteStatusInfo = async host => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sites/info`, {
      params: { host },
      timeout: 5000,
    });
    return response.data || {};
  } catch (error) {
    return {};
  }
};

/**
 * Check if the app should redirect based on host status
 */
const checkAppStatus = async host => {
  if (IS_DEV) return { redirect: false };

  const statusInfo = await getSiteStatusInfo(host);

  if (!statusInfo.status) {
    return { redirect: true, status: 301, redirectPath: getNotFoundRedirectPath(host) };
  }

  if (statusInfo.status !== 'active') {
    return { redirect: true, status: 307, redirectPath: `https://${statusInfo.parentHost}` };
  }

  return { redirect: false };
};

/**
 * Middleware to handle host-based redirects for inherited (non-whitelisted) hosts.
 * In development mode, redirects are skipped.
 */
const hostRedirect = async (req, res, next) => {
  const hostname = req.hostname;
  const inheritedHost = isInheritedHost(hostname);

  if (inheritedHost && !IS_DEV) {
    const { redirect, redirectPath, status } = await checkAppStatus(hostname);
    if (redirect) {
      return res.redirect(status, redirectPath);
    }
  }

  next();
};

export default hostRedirect;

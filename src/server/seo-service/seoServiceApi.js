import axios from 'axios';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://www.waivio.com/seo-service'
    : 'https://waiviodev.com/seo-service';

const devEnv = ['production', 'staging'].includes(process.env.NODE_ENV);

const reqTimeout = 5000;

const getPageByUrl = async ({ url }) => {
  if (devEnv) return;
  try {
    const response = await axios.get(`${BASE_URL}/cache-page`, {
      params: { url },
      timeout: reqTimeout,
    });

    return response?.data ?? '';
  } catch (error) {
    return '';
  }
};

const createPage = async ({ url, page }) => {
  if (devEnv) return;
  try {
    const response = await axios.post(
      `${BASE_URL}/cache-page`,
      {
        url,
        page,
      },
      {
        timeout: reqTimeout,
      },
    );

    return response?.data ?? '';
  } catch (error) {
    return '';
  }
};

const userAgentExists = async ({ userAgent }) => {
  if (devEnv) return;
  try {
    const response = await axios.get(`${BASE_URL}/user-agent`, {
      params: { userAgent },
      timeout: reqTimeout,
    });

    return response?.data?.result ?? false;
  } catch (error) {
    return false;
  }
};

const addVisit = async ({ userAgent }) => {
  if (devEnv) return;
  try {
    const response = await axios.post(
      `${BASE_URL}/bot-statistics`,
      {
        userAgent,
      },
      { timeout: reqTimeout },
    );

    return response?.data?.result ?? false;
  } catch (error) {
    return false;
  }
};

const getSitemap = async ({ host, name }) => {
  if (devEnv) return;
  try {
    const response = await axios.get(`${BASE_URL}/sitemap`, {
      params: { host, name },
      timeout: reqTimeout,
    });

    return response?.data ?? '';
  } catch (error) {
    return '';
  }
};

const getAddsByHost = async ({ host }) => {
  if (devEnv) return;
  try {
    const response = await axios.get(`${BASE_URL}/cache-page/ads`, {
      params: { host },
      timeout: reqTimeout,
    });

    return response?.data ?? '';
  } catch (error) {
    return '';
  }
};

export const webPage = {
  getPageByUrl,
  createPage,
  getAddsByHost,
};

export const botStatistics = {
  addVisit,
};

export const botAgent = {
  userAgentExists,
};

export const sitemap = {
  getSitemap,
};

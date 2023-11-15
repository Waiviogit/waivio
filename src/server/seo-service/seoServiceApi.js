import SocketClient from '../../common/services/wsClient';
import { CONNECTION_STRING_SEO, SEO_SERVICE_API_KEY } from '../../common/constants/ssrData';

const socketClient = new SocketClient(CONNECTION_STRING_SEO);
const getPageByUrl = async ({ url }) => {
  const result = await socketClient.sendMessage({
    name: 'webPage',
    method: 'getPageByUrl',
    args: [{ url }],
  });
  if (result?.error) {
    return '';
  }
  return result.data;
};

const createPage = async ({ url, page }) => {
  const result = await socketClient.sendMessage({
    name: 'webPage',
    method: 'createPage',
    args: [{ url, page }],
  });
  if (result?.error) {
    return { error: result.error };
  }
  return result.data;
};

const userAgentExists = async ({ userAgent }) => {
  const result = await socketClient.sendMessage({
    name: 'botAgent',
    method: 'userAgentExists',
    args: [{ userAgent }],
  });
  if (result?.error) {
    return false;
  }
  return result.data;
};

const addVisit = async ({ userAgent }) => {
  const result = await socketClient.sendMessage({
    name: 'botStatistics',
    method: 'addVisit',
    args: [{ userAgent }],
  });
  if (result?.error) {
    return { error: result.error };
  }
  return result.data;
};

const getSitemap = async ({ host, name }) => {
  const result = await socketClient.sendMessage({
    name: 'sitemap',
    method: 'getSitemap',
    args: [{ host, name }],
  });
  if (result?.error) {
    return '';
  }
  return result.data;
};

export const webPage = {
  getPageByUrl,
  createPage,
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

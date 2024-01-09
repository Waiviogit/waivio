import { USER_AGENT } from '../../common/constants/ssrData';
import { webPage, botStatistics, botAgent, sitemap } from '../seo-service/seoServiceApi';
import axios from 'axios';

export const isSearchBot = async req => {
  const userAgent = req.get(USER_AGENT);
  if (!userAgent) return false;
  return botAgent.userAgentExists({ userAgent });
};
const getUrl = req => `${req.hostname}${req.url}`;

export const getCachedPage = async req => {
  try {
    const bucketPath = process.env.CACHE_PAGE_BUCKET;
    if (!bucketPath) return '';

    const urlToFetch = `${bucketPath}${getUrl(req)}`;
    const response = await axios.get(urlToFetch);

    return response?.data ?? '';
  } catch (error) {
    return '';
  }
};

export const setCachedPage = async ({ page, req }) => {
  const url = getUrl(req);

  const exist = await webPage.getPageByUrl({ url });
  if (exist?.length) return;

  await webPage.createPage({ url, page });
};

export const updateBotCount = async req => {
  const userAgent = req.get(USER_AGENT);

  await botStatistics.addVisit({ userAgent });
};
export const getSitemap = async req => {
  const name = req.url.replace('/', '').replace(/\.xml/, '');

  return sitemap.getSitemap({
    host: req.headers.host,
    name,
  });
};

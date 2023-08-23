import { USER_AGENT } from '../../common/constants/ssrData';
import { cachePageRepository, botUserAgentRepository, botStatisticsRepository } from '../mongo';

export const isSearchBot = async req => {
  const userAgent = req.get(USER_AGENT);
  if (!userAgent) return false;
  return botUserAgentRepository.userAgentExists({ userAgent });
};
const getUrlForCache = req => `${req.hostname}${req.url}`;

export const getCachedPage = async req =>
  cachePageRepository.findPageByUrl({ url: getUrlForCache(req) });

export const setCachedPage = async ({ page, req }) => {
  const url = getUrlForCache(req);

  const exist = await cachePageRepository.findPageByUrl({ url });
  if (exist) return;
  await cachePageRepository.createPage({ url, page });
};

export const updateBotCount = async req => {
  const userAgent = req.get(USER_AGENT);
  await botStatisticsRepository.incrementVisit({ userAgent });
};

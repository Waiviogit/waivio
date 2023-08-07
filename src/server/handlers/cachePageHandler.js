import redis from '../redis/operations';
import {
  SSR_CACHE_KEY,
  SSR_CACHE_TTL,
  USER_AGENT,
  USER_AGENTS_COUNT_KEY,
  USER_AGENTS_KEY,
} from '../../common/constants/ssrData';
import USER_AGENTS from '../../common/constants/googleUserAgents';

export const isSearchBot = async req => {
  const userAgent = req.get(USER_AGENT);
  if (!userAgent) return false;
  const { result } = await redis.sismember({ key: USER_AGENTS_KEY, member: userAgent });
  return !!result;
};
const getUrlForRedis = req => `${SSR_CACHE_KEY}${req.hostname}${req.url}`;

export const getCachedPage = async req => {
  const { result } = await redis.get({ key: getUrlForRedis(req) });
  return result;
};

export const setCachedPage = async ({ page, req }) => {
  const key = getUrlForRedis(req);

  const { result: exist } = await redis.keys({ key });
  if (exist?.length) return;

  await redis.set({ key, data: page });
  await redis.expire({ key, time: SSR_CACHE_TTL });
};

export const loadUserAgents = async () => {
  await redis.sadd({ key: USER_AGENTS_KEY, member: USER_AGENTS });
};

export const updateBotCount = async req => {
  const member = req.get(USER_AGENT);
  await redis.zincrby({ key: USER_AGENTS_COUNT_KEY, member, increment: 1 });
};

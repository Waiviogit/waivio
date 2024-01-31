import { isbot, createIsbotFromList } from 'isbot';

import { REDIS_KEYS } from '../../common/constants/ssrData';
import { getAsync, incrExpire } from '../redis/redisClient';
import TOO_MANY_REQ_PAGE from '../pages/tooManyrequestsPage';

const { NODE_ENV } = process.env;

const DAILY_LIMIT = 2500;

const googleList = ['(?<! (?:channel/|google/))google(?!(app|/google| pixel))'];
const isGoogleBot = createIsbotFromList(googleList);

const getIpFromHeaders = req =>
  process.env.NODE_ENV === 'production'
    ? req.headers['x-forwarded-for'] || req.headers['x-real-ip']
    : req.headers['x-real-ip'];

const botRateLimit = async (req, res, next) => {
  const hostname = req.hostname;
  const ttlTime = 60 * 60 * 24;
  const userAgent = req.get('User-Agent');
  const bot = isbot(userAgent);
  const googleBot = isGoogleBot(userAgent);
  const ip = getIpFromHeaders(req);

  const statisticsKey = `${REDIS_KEYS.SSR_RATE_STATISTIC_COUNTER}:${hostname}:${
    bot ? 'bot' : 'user'
  }:${userAgent}:${ip}`;
  await incrExpire({
    key: statisticsKey,
    ttl: ttlTime,
  });

  if (!bot) return next();

  if (bot && NODE_ENV === 'staging') {
    res.set('Retry-After', ttlTime);
    return res.status(429).send(TOO_MANY_REQ_PAGE);
  }

  if (googleBot) return next();

  const key = `${REDIS_KEYS.SSR_RATE_LIMIT_COUNTER}:${hostname}:${userAgent}`;
  let { result: limitCounter } = await getAsync({ key });
  if (!limitCounter) limitCounter = 0;
  let { result: limit } = await getAsync({ key: REDIS_KEYS.SSR_RATE_LIMIT_BOTS });
  if (!limit) limit = DAILY_LIMIT;

  if (+limitCounter >= +limit) {
    res.set('Retry-After', ttlTime);
    return res.status(429).send(TOO_MANY_REQ_PAGE);
  }

  await incrExpire({
    key,
    ttl: ttlTime,
  });

  next();
};

export default botRateLimit;

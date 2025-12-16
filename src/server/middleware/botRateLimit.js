import { isbot, createIsbotFromList } from 'isbot';
import { REDIS_KEYS } from '../../common/constants/ssrData';
import { getAsync, incrExpire } from '../redis/redisClient';
import TOO_MANY_REQ_PAGE from '../pages/tooManyrequestsPage';

const { NODE_ENV } = process.env;

const DAILY_LIMIT = 2500;
const DAILY_LIMIT_SITE = 500;

const botAllowList = [
  '(?<! (?:channel/|google/))google(?!(app|/google| pixel))',
  'OAI-SearchBot',
  'ChatGPT-User',
  'GPTBot',
  'Amazonbot',
  'bingbot',
];
const isAllowedBot = createIsbotFromList(botAllowList);

const dontApplyLimits = userAgent => Boolean(userAgent) && isAllowedBot(userAgent);

const getIpFromHeaders = req => req.headers['x-forwarded-for'] || req.headers['x-real-ip'];

const botRateLimit = async (req, res, next) => {
  const hostname = req.hostname;
  const ttlTime = 60 * 60 * 24;
  const userAgent = req.get('User-Agent');
  const bot = isbot(userAgent);
  const ip = getIpFromHeaders(req);

  const statisticsKey = `${REDIS_KEYS.SSR_RATE_STATISTIC_COUNTER}:${hostname}:${
    bot ? 'bot' : 'user'
  }:${userAgent}:${ip}`;

  await incrExpire({
    key: statisticsKey,
    ttl: 60 * 60,
  });

  if (!bot) return next();

  if (bot && NODE_ENV === 'staging') return res.status(403).send('Forbidden');
  if (dontApplyLimits(userAgent)) return next();

  const siteLimitKey = `${REDIS_KEYS.SSR_RATE_LIMIT_COUNTER}:${userAgent}:${hostname}`;
  const severLimitKey = `${REDIS_KEYS.SSR_RATE_LIMIT_COUNTER}:${userAgent}`;

  let { result: serverLimitCounter } = await getAsync({ key: severLimitKey });
  if (!serverLimitCounter) serverLimitCounter = 0;
  let { result: limitCounter } = await getAsync({ key: siteLimitKey });
  if (!limitCounter) limitCounter = 0;

  if (+serverLimitCounter >= DAILY_LIMIT) {
    res.set('Retry-After', ttlTime);
    return res.status(429).send(TOO_MANY_REQ_PAGE);
  }

  if (+limitCounter >= DAILY_LIMIT_SITE) {
    res.set('Retry-After', ttlTime);
    return res.status(429).send(TOO_MANY_REQ_PAGE);
  }

  await incrExpire({ key: siteLimitKey, ttl: ttlTime });
  await incrExpire({ key: severLimitKey, ttl: ttlTime });

  next();
};

export default botRateLimit;

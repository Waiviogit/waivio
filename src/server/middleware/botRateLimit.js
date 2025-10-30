import { isbot, createIsbotFromList } from 'isbot';

import { REDIS_KEYS } from '../../common/constants/ssrData';
import { getAsync, incrExpire } from '../redis/redisClient';
import TOO_MANY_REQ_PAGE from '../pages/tooManyrequestsPage';
import { isInheritedHost } from '../../common/helpers/redirectHelper';

const { NODE_ENV } = process.env;

const DAILY_LIMIT = 2500;
const DAILY_LIMIT_SITE = 500;

const googleList = ['(?<! (?:channel/|google/))google(?!(app|/google| pixel))'];
const openaiList = ['OAI-SearchBot', 'ChatGPT-User', 'GPTBot'];

const isGoogleBot = createIsbotFromList(googleList);
const isOpenAIBot = createIsbotFromList(openaiList);

const isChatGptBot = userAgent => Boolean(userAgent) && isOpenAIBot(userAgent);

const getIpFromHeaders = req => req.headers['x-forwarded-for'] || req.headers['x-real-ip'];

const botRateLimit = async (req, res, next) => {
  const hostname = req.hostname;
  const ttlTime = 60 * 60 * 24;
  const userAgent = req.get('User-Agent');
  const bot = isbot(userAgent);
  const googleBot = isGoogleBot(userAgent);
  const openAiBot = isChatGptBot(userAgent);
  const ip = getIpFromHeaders(req);

  const statisticsKey = `${REDIS_KEYS.SSR_RATE_STATISTIC_COUNTER}:${hostname}:${
    bot ? 'bot' : 'user'
  }:${userAgent}:${ip}`;

  await incrExpire({
    key: statisticsKey,
    ttl: 60 * 60,
  });

  if (!bot) return next();

  // if (bot && NODE_ENV === 'staging') {
  //   res.set('Retry-After', ttlTime);
  //   return res.status(429).send(TOO_MANY_REQ_PAGE);
  // }

  const socialSites = isInheritedHost(req.hostname);
  if (socialSites) return next();
  if (googleBot) return next();
  if (openAiBot) return next();

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

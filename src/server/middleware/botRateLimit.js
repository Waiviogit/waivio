import { isbot, createIsbotFromList } from 'isbot';

import { REDIS_KEYS } from '../../common/constants/ssrData';
import { getAsync, incrExpire } from '../redis/redisClient';
import TOO_MANY_REQ_PAGE from '../pages/tooManyrequestsPage';

const { NODE_ENV } = process.env;

const DAILY_LIMIT = 2500;

const googleList = ['(?<! (?:channel/|google/))google(?!(app|/google| pixel))'];
const isGoogleBot = createIsbotFromList(googleList);

const botRateLimit = async (req, res, next) => {
  if (NODE_ENV === 'production') return next();

  const userAgent = req.get('User-Agent');
  const bot = isbot(userAgent);
  const googleBot = isGoogleBot(userAgent);

  if (!bot) return next();
  if (googleBot) return next();

  const hostname = req.hostname;

  const key = `${REDIS_KEYS.SSR_RATE_LIMIT_COUNTER}:${hostname}:${userAgent}`;
  let { result: limitCounter } = await getAsync({ key });
  if (!limitCounter) limitCounter = 0;
  let { result: limit } = await getAsync({ key: REDIS_KEYS.SSR_RATE_LIMIT_BOTS });
  if (!limit) limit = DAILY_LIMIT;

  if (+limitCounter >= +limit) {
    return res.status(429).send(TOO_MANY_REQ_PAGE);
  }

  await incrExpire({
    key,
    ttl: 60 * 60 * 24,
  });

  next();
};

export default botRateLimit;

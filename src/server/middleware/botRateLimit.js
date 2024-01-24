import { isbot } from 'isbot';

import { REDIS_KEYS } from '../../common/constants/ssrData';
import { getAsync, incrExpire } from '../redis/redisClient';

const { NODE_ENV } = process.env;

const DAILY_LIMIT = 500;

const TOO_MANY_REQ_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>429 Too Many Requests</title>
</head>
<body>
    <h1>429 Too Many Requests</h1>
    <p>Sorry, you have sent too many requests in a short period of time. Please try again later.</p>
</body>
</html>`;

const botRateLimit = async (req, res, next) => {
  if (NODE_ENV === 'production') return next();

  const userAgent = req.get('User-Agent');
  const bot = isbot(userAgent);

  if (!bot) return next();

  const key = `${REDIS_KEYS.SSR_RATE_LIMIT_COUNTER}:${userAgent}`;
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

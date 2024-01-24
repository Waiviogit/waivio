import { createClient } from 'redis';
import { REDIS_CLIENT_DB } from '../../common/constants/ssrData';

const redisClient = createClient();

export const setupRedisConnections = async () => {
  await redisClient.connect();
  await redisClient.select(REDIS_CLIENT_DB);
};

export const incrExpire = async ({ key, ttl }) => {
  try {
    await redisClient
      .multi()
      .INCR(key)
      .EXPIRE(key, ttl)
      .exec();
  } catch (error) {
    console.log(error.message);
  }
};

export const getAsync = async ({ key }) => {
  try {
    return { result: await redisClient.GET(key) };
  } catch (error) {
    return { error };
  }
};

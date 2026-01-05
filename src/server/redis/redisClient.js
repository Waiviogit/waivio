import { createClient } from 'redis';
import { REDIS_CLIENT_DB } from '../../common/constants/ssrData.js';

const redisClient = createClient();
redisClient.on('error', e => console.log(e));

export const setupRedisConnections = async () => {
  try {
    await redisClient.connect();
    await redisClient.select(REDIS_CLIENT_DB);
  } catch (error) {
    console.log(error.message);
  }
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

export const sismember = async ({ key, member }) => {
  try {
    const result = await redisClient.SISMEMBER(key, member);
    return !!result;
  } catch (error) {
    return false;
  }
};

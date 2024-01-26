import { createClient } from 'redis';
import { REDIS_CLIENT_DB } from '../../common/constants/ssrData';

const redisClient = createClient();

const checkClientState = () => {
  if (!redisClient.connected) throw new Error('not connected');
};

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
    checkClientState();
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
    checkClientState();
    return { result: await redisClient.GET(key) };
  } catch (error) {
    return { error };
  }
};

export const sismember = async ({ key, member }) => {
  try {
    checkClientState();
    const result = await redisClient.SISMEMBER(key, member);
    return !!result;
  } catch (error) {
    return false;
  }
};

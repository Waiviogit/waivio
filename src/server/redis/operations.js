import redisClient from './redis';

const checkClientState = () => {
  if (!redisClient.connected) throw new Error('not connected');
};
const operations = {};

operations.get = async ({ key }) => {
  try {
    checkClientState();
    const result = await redisClient.get(key);
    return { result };
  } catch (error) {
    return { error };
  }
};

operations.set = async ({ key, data }) => {
  try {
    checkClientState();
    const result = await redisClient.set(key, data);
    return { result };
  } catch (error) {
    return { error };
  }
};

operations.expire = async ({ key, time }) => {
  try {
    checkClientState();
    const result = await redisClient.expire(key, time);
    return { result };
  } catch (error) {
    return { error };
  }
};

operations.sadd = async ({ key, member }) => {
  try {
    checkClientState();
    const result = await redisClient.sadd(key, member);
    return { result };
  } catch (error) {
    return { error };
  }
};

operations.sismember = async ({ key, member }) => {
  try {
    checkClientState();
    const result = await redisClient.sismember(key, member);
    return { result };
  } catch (error) {
    return { error };
  }
};

operations.keys = async ({ key }) => {
  try {
    checkClientState();
    const result = await redisClient.keys(key);
    return { result };
  } catch (error) {
    return { error };
  }
};

export default operations;

import * as redis from 'redis';
import util from 'util';
import { REDIS_DB_NUM } from '../../common/constants/ssrData';

const methodsToPromisify = [
  'get',
  'expire',
  'set',
  'sismember',
  'sadd',
  'keys',
  'zincrby'
];
methodsToPromisify.forEach(method => {
  redis.RedisClient.prototype[method] = util.promisify(redis.RedisClient.prototype[method]);
});

const redisClient = redis.createClient();
redisClient.on('error', err => console.log(err.message));
redisClient.select(REDIS_DB_NUM);

export default redisClient;

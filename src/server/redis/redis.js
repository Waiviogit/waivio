import * as redis from 'redis';
import util from 'util';
import { REDIS_DB_NUM } from '../../common/constants/ssrData';

redis.RedisClient.prototype.get = util.promisify(redis.RedisClient.prototype.get);
redis.RedisClient.prototype.expire = util.promisify(redis.RedisClient.prototype.expire);
redis.RedisClient.prototype.set = util.promisify(redis.RedisClient.prototype.set);
redis.RedisClient.prototype.sismember = util.promisify(redis.RedisClient.prototype.sismember);
redis.RedisClient.prototype.sadd = util.promisify(redis.RedisClient.prototype.sadd);
const redisClient = redis.createClient();
redisClient.on('error', err => console.log(err.message));
redisClient.select(REDIS_DB_NUM);

export default redisClient;

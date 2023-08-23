export const USER_AGENT = 'User-Agent';

export const MONGO_URI = process.env.MONGO_URI_CACHE
  ? process.env.MONGO_URI_CACHE
  : 'mongodb://localhost:27017/cache';

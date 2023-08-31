export const USER_AGENT = 'User-Agent';

export const CONNECTION_STRING_SEO =
  process.env.NODE_ENV === 'production'
    ? 'wss://www.waivio.com/seo-service'
    : 'wss://waiviodev.com/seo-service';

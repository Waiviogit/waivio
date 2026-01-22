import crypto from 'crypto';

export const sha256Hex = s =>
  crypto
    .createHash('sha256')
    .update(s)
    .digest('hex');

export const hmacSha256Hex = (secret, s) =>
  crypto
    .createHmac('sha256', secret)
    .update(s)
    .digest('hex');

export const uaHash = userAgent => sha256Hex(userAgent || '').slice(0, 16);

export const getBucket10m = (nowMs = Date.now()) => Math.floor(nowMs / (10 * 60 * 1000));

export const buildTokenPayload = (aid, bucket, uaH) => `${aid}|${bucket}|${uaH}`;

export const signPingToken = (secret, aid, bucket, uaH) => {
  const payload = buildTokenPayload(aid, bucket, uaH);
  return hmacSha256Hex(secret, payload);
};

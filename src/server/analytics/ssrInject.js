import { getBucket10m, signPingToken, uaHash } from './cryptoTools';

const safeJson = v => JSON.stringify(v).replace(/</g, '\\u003c');
export const getAnalyticScript = vars => {
  return `<script>
window.__AID__=${safeJson(vars.aid)};
window.__PING_BUCKET__=${safeJson(vars.bucket)};
window.__PING_TOKEN__=${safeJson(vars.token)};
</script>`;
};

export const buildPingVarsForRequest = (secret, aid, userAgent) => {
  const bucket = getBucket10m();
  const uaH = uaHash(userAgent);
  const token = signPingToken(secret, aid, bucket, uaH);
  return { aid, bucket, token };
};

import { buildPingVarsForRequest } from './ssrInject';
import { getBucket10m, uaHash, timingSafeEqualHex, signPingToken } from './cryptoTools';
import { sadd, setEx } from '../redis/redisClient';

const analyticsSecret = process.env.ANALYTICS_SECRET;
const SITE_USERS_STATISTIC_KEY = 'aid_active';

const markActive = async (hostname, aid) => {
  const key = `${SITE_USERS_STATISTIC_KEY}:${hostname.replace(/^www\./i, '')}`;
  await sadd({ key, member: aid });
  // Per-aid marker
  const markerKey = `${SITE_USERS_STATISTIC_KEY}:${aid}`;
  await setEx({ key: markerKey, seconds: 60 * 60, value: '1' }); // 1 hour TTL
};

export const analyticsToken = (req, res) => {
  const aid = String(req.query.aid || '');
  if (!aid || aid.length > 80) return res.status(400).json({ ok: false });

  const ua = req.get('user-agent') || '';
  const vars = buildPingVarsForRequest(analyticsSecret, aid, ua);
  res.json({ ok: true, ...vars });
};

export const analyticsPing = async (req, res) => {
  try {
    const hostname = req.hostname;
    const { aid, bucket, token } = req.body || {};
    if (!aid || typeof aid !== 'string' || aid.length > 80) return res.status(400).end();
    if (typeof bucket !== 'number' || !Number.isFinite(bucket)) return res.status(400).end();
    if (!token || typeof token !== 'string' || token.length < 32) return res.status(400).end();

    const nowBucket = getBucket10m();
    if (bucket < nowBucket - 1 || bucket > nowBucket + 1) {
      return res.status(204).end();
    }

    const ua = req.get('user-agent') || '';
    const uaH = uaHash(ua);

    const expected = signPingToken(analyticsSecret, aid, bucket, uaH);
    if (!timingSafeEqualHex(token, expected)) {
      return res.status(204).end();
    }
    await markActive(hostname, aid);
    return res.status(204).end();
  } catch {
    return res.status(204).end();
  }
};

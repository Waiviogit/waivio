const getOrCreateAid = () => {
  const KEY = 'anon_id';
  let aid = localStorage.getItem(KEY);

  if (!aid && window.__AID__) {
    aid = String(window.__AID__);
    localStorage.setItem(KEY, aid);
  }
  if (!aid) {
    aid = (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`).toString();
    localStorage.setItem(KEY, aid);
  }
  document.cookie = `aid=${encodeURIComponent(aid)}; Path=/; Max-Age=${365 *
    24 *
    3600}; SameSite=Lax`;

  return aid;
};

let pingToken = window.__PING_TOKEN__ || '';
let pingBucket = window.__PING_BUCKET__ || 0;

const fetchNewToken = async aid => {
  const r = await fetch(`/api/analytics/token?aid=${encodeURIComponent(aid)}`, {
    credentials: 'include',
  });
  const j = await r.json();

  if (j?.ok) {
    pingToken = j.token;
    pingBucket = j.bucket;
  }
};

const sendPing = async () => {
  try {
    const aid = getOrCreateAid();

    if (!pingToken || !pingBucket) await fetchNewToken(aid);

    const payload = {
      aid,
      bucket: pingBucket,
      token: pingToken,
      ts: Date.now(),
      path: location.pathname,
    };

    const body = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });

      navigator.sendBeacon('/api/analytics/ping', blob);
    } else {
      fetch('/api/analytics/ping', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body,
        keepalive: true,
        credentials: 'include',
      }).catch(() => {});
    }
    return null;
  } catch (error) {
    return null;
  }
};

const startActivePinger = () => {
  if (!document) return () => {};
  const pingNow = () => sendPing();

  if (document.readyState === 'complete') pingNow();
  else window.addEventListener('load', pingNow, { once: true });

  const timer = setInterval(() => {
    if (document.visibilityState === 'visible') pingNow();
  }, 60_000);

  const tokenRefresh = setInterval(() => {
    const aid = getOrCreateAid();

    fetchNewToken(aid).catch(() => {});
  }, 9 * 60_000);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') pingNow();
  });

  return () => {
    clearInterval(timer);
    clearInterval(tokenRefresh);
  };
};

export default startActivePinger;

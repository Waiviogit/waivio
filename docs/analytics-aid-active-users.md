# Analytics: AID & Active Users

## Overview

The analytics system tracks **anonymous active users** per site without requiring authentication.  
It is split into three layers: **cookie/ID management**, **SSR injection + client pinger**, and **server-side verification with Redis storage**.

---

## Key Concepts

| Term | Meaning |
|------|---------|
| **AID** (Anonymous ID) | A `crypto.randomUUID()` value assigned to every visitor. Persisted in a cookie (`aid`) for 1 year and mirrored in `localStorage` under `anon_id`. |
| **Bucket** | A 10-minute time window (`Math.floor(Date.now() / 600_000)`). Used to expire ping tokens so replayed requests are rejected. |
| **Ping Token** | HMAC-SHA256 signature of `aid|bucket|uaHash` with a server secret. Proves the ping originated from a page the server rendered. |
| **Active User** | An AID that has sent at least one valid ping within the current window. Stored in a Redis Set keyed per hostname. |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│  BROWSER                                                        │
│                                                                 │
│  1. SSR HTML arrives with injected <script>:                    │
│     window.__AID__, __PING_BUCKET__, __PING_TOKEN__             │
│                                                                 │
│  2. pinger.js (startActivePinger) runs on app bootstrap:        │
│     - reads SSR vars or fetches GET /analytics/token            │
│     - sends POST /analytics/ping immediately + every 60 s       │
│     - refreshes token every 9 min                               │
│     - re-pings on visibilitychange → visible                    │
└──────────────┬──────────────────────────┬───────────────────────┘
               │ GET /analytics/token     │ POST /analytics/ping
               ▼                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  SERVER (Express)                                               │
│                                                                 │
│  analyticsMiddleware (every request)                            │
│    → getOrSetAidCookie()  – set/read `aid` cookie              │
│    → buildPingVarsForRequest() – compute token for SSR inject  │
│    → getAnalyticScript() – produce <script> snippet            │
│                                                                 │
│  GET  /analytics/token  → analyticsToken handler                │
│    → recompute token for a given aid (SPA refreshes)            │
│                                                                 │
│  POST /analytics/ping   → analyticsPing handler                 │
│    → validate aid, bucket (±1 window), token (HMAC)             │
│    → filter bots via isbot(ua)                                  │
│    → markActive(hostname, aid, ua) → Redis                      │
└──────────────────────────────────┬──────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│  REDIS                                                          │
│                                                                 │
│  SET  aid_active:<hostname>   ← SADD aid (unique users/site)   │
│  KEY  aid_active:<aid>        ← SETEX 1h TTL (per-user marker) │
└─────────────────────────────────────────────────────────────────┘
```

---

## File Map

| File | Role |
|------|------|
| `src/server/analytics/aid.js` | `newAid()` — generates UUID. `getOrSetAidCookie()` — reads or creates the `aid` cookie (1-year, `httpOnly: false`, `sameSite: lax`). |
| `src/server/analytics/cryptoTools.js` | Pure crypto helpers: `sha256Hex`, `hmacSha256Hex`, `uaHash` (first 16 hex chars of SHA-256 of UA), `getBucket10m`, `buildTokenPayload`, `signPingToken`, `timingSafeEqualHex`. |
| `src/server/analytics/ssrInject.js` | `buildPingVarsForRequest(secret, aid, ua)` — returns `{ aid, bucket, token }`. `getAnalyticScript(vars)` — returns `<script>` tag setting `window.__AID__`, `__PING_BUCKET__`, `__PING_TOKEN__`. |
| `src/server/analytics/requestHandlers.js` | Express handlers: `analyticsToken` (GET) and `analyticsPing` (POST). Contains `markActive()` which writes to Redis. |
| `src/server/middleware/analyticsMiddleware.js` | `makeAnalyticsInjectMiddleware(secret)` — Express middleware that runs on every request. Calls `getOrSetAidCookie`, builds vars, attaches `<script>` to `req.ssrInject.analytics`. |
| `src/client/services/analytics/pinger.js` | Client-side module. `startActivePinger()` — fires immediately, then every 60 s (if tab visible) + on visibility change. Refreshes token every 9 min. Uses `navigator.sendBeacon` with `fetch` fallback. |
| `src/client/index.js` | Imports and calls `startActivePinger()` at bootstrap. |
| `src/server/app.js` | Registers the middleware and the two route handlers. |

---

## Detailed Flow

### 1. AID Cookie Assignment (Server)

**File:** `src/server/analytics/aid.js`

On every request the middleware checks `req.cookies.aid`.  
- If **missing or invalid** (not a string, or > 80 chars) → generate `crypto.randomUUID()`, set cookie:
  - `maxAge`: 1 year
  - `sameSite`: `lax`
  - `secure`: matches request protocol
  - `httpOnly`: **false** (client needs to read it)
  - `path`: `/`
- Returns the `aid` string.

### 2. SSR Token Injection (Server → HTML)

**Files:** `src/server/middleware/analyticsMiddleware.js`, `src/server/analytics/ssrInject.js`

The middleware calls `buildPingVarsForRequest(secret, aid, ua)`:

1. `getBucket10m()` — current 10-min epoch bucket.
2. `uaHash(ua)` — SHA-256 of User-Agent, truncated to 16 hex chars.
3. `signPingToken(secret, aid, bucket, uaH)` — HMAC-SHA256 of `"<aid>|<bucket>|<uaH>"`.

Returns `{ aid, bucket, token }`.

`getAnalyticScript(vars)` wraps these into a `<script>` tag (with `<` escaped to `\u003c` for XSS safety) and the middleware attaches it to `req.ssrInject.analytics` so the SSR renderer embeds it in the HTML.

### 3. Client-Side Pinger

**File:** `src/client/services/analytics/pinger.js`

`startActivePinger()` is called once at app bootstrap (`src/client/index.js`).

#### AID Resolution (Client)
1. Check `localStorage.anon_id`.
2. Fallback to `window.__AID__` (from SSR) → save to localStorage.
3. Fallback to `crypto.randomUUID()` (or timestamp+random) → save to localStorage.
4. Sync the value to the `aid` cookie (client-write, 1-year, `SameSite=Lax`).

#### Ping Schedule
| Event | Action |
|-------|--------|
| Module init | `sendPing()` immediately |
| Every 60 s | `sendPing()` if tab is **visible** |
| `visibilitychange → visible` | `sendPing()` |
| Every 9 min | `fetchNewToken(aid)` (refresh token before 10-min bucket expires) |

#### sendPing()
1. Resolve AID.
2. If no token/bucket yet → `GET /analytics/token?aid=<aid>` to obtain them.
3. POST `{ aid, bucket, token }` to `/analytics/ping` via `navigator.sendBeacon` (preferred) or `fetch` with `keepalive: true`.

### 4. Server-Side Ping Verification

**File:** `src/server/analytics/requestHandlers.js`

#### `GET /analytics/token`
- Reads `aid` from query string, validates length ≤ 80.
- Calls `buildPingVarsForRequest` with the server secret and returns `{ ok, aid, bucket, token }`.

#### `POST /analytics/ping`
1. **Input validation:** `aid` (string, ≤ 80), `bucket` (finite number), `token` (string, ≥ 32 chars).
2. **Bucket freshness:** `bucket` must be within ±1 of the server's current bucket (≈ ±10 min tolerance).
3. **Token verification:** recompute HMAC from `aid|bucket|uaHash` and compare with `timingSafeEqual` to prevent timing attacks.
4. **Mark active:** on success, call `markActive(hostname, aid, ua)`.
5. Always returns `204 No Content` (even on error — no information leak).

### 5. Redis Storage (`markActive`)

Two writes per valid ping:

| Redis Command | Key Pattern | Purpose |
|---------------|-------------|---------|
| `SADD` | `aid_active:<hostname>` | Adds AID to a **Set** of unique users for the site. Bot UAs (via `isbot`) are excluded. `www.` prefix stripped from hostname. |
| `SETEX` | `aid_active:<aid>` | Per-AID marker with **1-hour TTL**. Can be used to check if a specific AID was recently active. |

---

## Security Properties

| Threat | Mitigation |
|--------|------------|
| Token forgery | HMAC-SHA256 with server-only secret; attacker cannot produce valid tokens without the secret. |
| Token replay | 10-minute bucket window (±1 tolerance). Stale tokens are silently dropped. |
| UA spoofing | UA hash is part of the token payload; changing UA invalidates the token. |
| Timing attacks | `timingSafeEqual` used for token comparison. |
| Bot inflation | `isbot(ua)` filter before `SADD` to the per-site set. |
| XSS via SSR inject | `<` escaped to `\u003c` in injected JSON values. |
| Information leakage | Ping endpoint always returns `204`; no error details exposed. |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ANALYTICS_SECRET` | `'change_me'` | Shared secret for HMAC token signing. **Must be set in production.** |

---

## Redis Key Reference

| Key | Type | TTL | Description |
|-----|------|-----|-------------|
| `aid_active:<hostname>` | Set | None (persistent) | Set of all AIDs that pinged for a given hostname. Needs external cleanup/rotation if counting over a time window is desired. |
| `aid_active:<aid>` | String | 1 hour | Marker indicating this AID was recently active. Value is `"1"`. |

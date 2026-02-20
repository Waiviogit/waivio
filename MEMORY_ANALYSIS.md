# Memory Issue Analysis - SSR Production Build

## Critical Memory Issues Identified

### 🔴 CRITICAL ISSUE #1: Large Locale Files Serialized in Every SSR Request

**Location:** `src/server/renderers/ssrRenderer.js:25` and `src/store/appStore/appReducer.js:126-131`

**Problem:**
- Locale JSON files range from **17KB to 290KB** (hi-IN.json is 290KB, ru-RU.json is 245KB, uk-UA.json is 234KB)
- Translations are stored in Redux state (`state.app.translations`) 
- **Every SSR request** serializes the entire Redux state to `window.__PRELOADED_STATE__` including the full translations object
- With 1-2GB RAM, serializing 100-300KB of translations per request causes memory exhaustion

**Code Evidence:**
```javascript
// src/server/renderers/ssrRenderer.js:25
scripts = `<script>window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)
  .replace(/\u2028/g, '\\n')
  .replace(/</g, '\\u003c')}</script>`;

// src/store/appStore/appReducer.js:126-131
case appTypes.SET_USED_LOCALE:
  return {
    ...state,
    usedLocale: action.payload.id,
    translations: action.payload.translations, // ← Entire locale file stored here
  };
```

**Impact:** 
- Each SSR request loads a locale file (up to 290KB)
- Stores it in Redux state
- Serializes entire state (including translations) to JSON string
- With concurrent requests, memory usage multiplies rapidly

---

### 🔴 CRITICAL ISSUE #2: Locale Loading in SSR Handler

**Location:** `src/server/handlers/createSsrHandler.js:128, 212`

**Problem:**
- Locales are loaded dynamically via `loadLanguage()` which imports the entire JSON file
- This happens for **every SSR request** (including bots)
- The loaded translations are stored in Redux state and serialized

**Code Evidence:**
```javascript
// Line 128 - For authenticated users
store.dispatch(setUsedLocale(await loadLanguage(language)));

// Line 212 - For non-authenticated users  
store.dispatch(setUsedLocale(await loadLanguage(loc)));
```

**Impact:** Even bot requests load and serialize large locale files unnecessarily.

---

### 🟡 ISSUE #3: Multiple Parallel fetchData Calls Loading Large Data

**Location:** `src/server/handlers/createSsrHandler.js:230-237`

**Problem:**
- Multiple route components execute `fetchData` methods in parallel
- Each can load significant data into Redux state
- Example: `WobjectContainer.fetchData` makes 8+ parallel API calls loading posts, authors, followers, etc.

**Code Evidence:**
```javascript
branch.forEach(({ route, match }) => {
  const fetchData = route?.component?.fetchData;
  if (fetchData instanceof Function) {
    promises.push(fetchData({ store, match, req, res, query, url: req.url }));
  }
});

await createTimeout(ssrTimeout, Promise.allSettled(promises));
```

**Impact:** Large API responses stored in Redux state increase serialization size.

---

### 🟡 ISSUE #4: No State Cleanup Between Requests

**Location:** `src/server/handlers/createSsrHandler.js:95`

**Problem:**
- New Redux store created per request (good)
- But no explicit cleanup or memory management
- Large serialized state strings may not be garbage collected immediately

---

## Recommended Fixes

### Fix #1: Exclude Translations from SSR State Serialization (HIGHEST PRIORITY)

**File:** `src/server/renderers/ssrRenderer.js`

**Change:** Remove translations from serialized state, load them client-side only:

```javascript
export default function renderSsrPage({
  store,
  html,
  assets,
  template,
  isWaivio,
  googleTag,
  googleGSC,
  verifTags,
  googleEventSnippetTag,
  googleAdsConfig,
  adSense,
  analyticsInject,
}) {
  const preloadedState = store ? store.getState() : {};
  
  // Remove translations from serialized state to reduce memory usage
  const stateWithoutTranslations = {
    ...preloadedState,
    app: {
      ...preloadedState.app,
      translations: {}, // Don't serialize translations
      usedLocale: preloadedState.app?.usedLocale || null, // Keep locale ID only
    },
  };

  const helmet = Helmet.renderStatic();
  const baseHelmet = helmet.meta.toString() + helmet.title.toString() + helmet.link.toString();

  let header = baseHelmet;
  let scripts = '';
  try {
    scripts = `<script>window.__PRELOADED_STATE__ = ${JSON.stringify(stateWithoutTranslations)
      .replace(/\u2028/g, '\\n')
      .replace(/</g, '\\u003c')}</script>`;
  } catch (e) {
    console.error('Serialization error', e);
    scripts = `<script>window.__PRELOADED_STATE__ = {}</script>`;
  }
  
  // ... rest of function
}
```

**Impact:** Reduces serialized state size by 100-300KB per request.

---

### Fix #2: Skip Locale Loading for Bot Requests

**File:** `src/server/handlers/createSsrHandler.js`

**Change:** Don't load translations for search bots:

```javascript
// Around line 210-213
if (!isWaivio && !req.cookies.access_token && !searchBot) {
  store.dispatch(setLocale(loc));
  store.dispatch(setUsedLocale(await loadLanguage(loc)));
} else if (!isWaivio && !req.cookies.access_token) {
  // For bots, just set locale ID without loading translations
  store.dispatch(setLocale(loc));
  store.dispatch(setUsedLocale({ id: loc, translations: {} }));
}
```

**Impact:** Saves 100-300KB per bot request.

---

### Fix #3: Lazy Load Translations Client-Side Only

**File:** `src/client/index.js` and `src/client/Wrapper.js`

**Change:** Ensure translations are loaded client-side after hydration:

```javascript
// In src/client/index.js, after store hydration
const render = async Component => {
  const state = store.getState();
  let activeLocale = getLocale(state);

  if (activeLocale === 'auto') {
    activeLocale = Cookie.get('language') || getBrowserLocale() || 'en-US';
  }

  // Load translations client-side (not in SSR)
  const lang = await loadLanguage(activeLocale);
  store.dispatch(setUsedLocale(lang));
  
  // ... rest of render
};
```

**Impact:** Translations loaded once client-side instead of every SSR request.

---

### Fix #4: Limit Redux State Size in SSR

**File:** `src/server/renderers/ssrRenderer.js`

**Change:** Strip unnecessary data from serialized state:

```javascript
export default function renderSsrPage({ store, ... }) {
  const preloadedState = store ? store.getState() : {};
  
  // Create minimal state for SSR - exclude large objects
  const minimalState = {
    ...preloadedState,
    app: {
      ...preloadedState.app,
      translations: {}, // Exclude translations
      cryptosPriceHistory: {}, // Exclude price history if large
    },
    // Consider excluding other large reducers if not needed for initial render
    wallet: preloadedState.wallet ? {
      ...preloadedState.wallet,
      usersAccountHistory: {}, // Exclude large history objects
      transactionsHistory: {},
    } : undefined,
  };
  
  // ... serialize minimalState instead of full state
}
```

---

### Fix #5: Add Memory Monitoring

**File:** `src/server/handlers/createSsrHandler.js`

**Change:** Add memory logging to identify problematic routes:

```javascript
export default function createSsrHandler(template) {
  return async function serverSideResponse(req, res) {
    const memBefore = process.memoryUsage();
    
    // ... existing SSR logic ...
    
    const memAfter = process.memoryUsage();
    const memUsed = (memAfter.heapUsed - memBefore.heapUsed) / 1024 / 1024; // MB
    
    if (memUsed > 50) { // Log if request uses >50MB
      console.warn(`High memory usage for ${req.url}: ${memUsed.toFixed(2)}MB`);
    }
    
    return res.send(page);
  };
}
```

---

## Additional Recommendations

1. **Review fetchData methods** - Ensure they don't load excessive data for SSR
2. **Implement request queuing** - Limit concurrent SSR requests if memory is constrained
3. **Add memory limits** - Use `--max-old-space-size` Node flag to prevent OOM
4. **Monitor bundle size** - Check if webpack bundles are growing unexpectedly
5. **Consider streaming SSR** - Use React's streaming SSR to reduce memory pressure

---

## Priority Order

1. **Fix #1** - Exclude translations from SSR serialization (immediate impact)
2. **Fix #2** - Skip locale loading for bots (quick win)
3. **Fix #3** - Lazy load translations client-side (architectural improvement)
4. **Fix #4** - Limit Redux state size (further optimization)
5. **Fix #5** - Add monitoring (observability)

---

## Expected Impact

- **Fix #1 alone**: Reduces memory per request by 100-300KB
- **With all fixes**: Reduces memory per request by 200-400KB+
- **For 100 concurrent requests**: Saves 20-40MB+ of memory
- **For bot traffic**: Eliminates unnecessary locale loading entirely

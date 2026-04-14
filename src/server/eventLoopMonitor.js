import { monitorEventLoopDelay } from 'perf_hooks';

/**
 * Event loop delay (ELD) monitor for SSR Node process.
 *
 * Env (all optional unless noted):
 * - ELD_ENABLED / ELD_MONITOR: set to "false" to disable (caller still skips in development).
 * - ELD_RESOLUTION_NS: histogram bucket width in nanoseconds (Node API). Default 10.
 * - ELD_RESOLUTION_MS: if set (and ELD_RESOLUTION_NS unset), bucket width = value * 1e6 ns.
 * - ELD_WINDOW_MS: aggregation window (default 10000).
 * - ELD_WARN_THRESHOLD_MS, ELD_CRITICAL_THRESHOLD_MS, ELD_CRITICAL_WINDOW_COUNT
 * - ELD_LOG_COOLDOWN_MS
 * - ELD_AUTO_EXIT: "false" disables exit on sustained critical (default: exit enabled).
 * - ELD_EXIT_GRACE_WINDOWS: extra windows after degraded before exit (default 2).
 */

const parseResolutionNs = () => {
  const fromNs = parseInt(process.env.ELD_RESOLUTION_NS, 10);
  if (!Number.isNaN(fromNs) && fromNs > 0) {
    return fromNs;
  }
  const fromMs = parseInt(process.env.ELD_RESOLUTION_MS, 10);
  if (!Number.isNaN(fromMs) && fromMs > 0) {
    return Math.round(fromMs * 1e6);
  }
  return 10;
};

/** Read tunables from process.env (call after dotenv so .env values apply). */
const readConfig = () => ({
  resolutionNs: parseResolutionNs(),
  windowMs: parseInt(process.env.ELD_WINDOW_MS, 10) || 10000,
  warnThresholdMs: parseInt(process.env.ELD_WARN_THRESHOLD_MS, 10) || 100,
  criticalThresholdMs: parseInt(process.env.ELD_CRITICAL_THRESHOLD_MS, 10) || 500,
  criticalWindowCount: parseInt(process.env.ELD_CRITICAL_WINDOW_COUNT, 10) || 3,
  logCooldownMs: parseInt(process.env.ELD_LOG_COOLDOWN_MS, 10) || 60000,
  autoExitOnCritical: process.env.ELD_AUTO_EXIT !== 'false',
  exitGraceWindows: parseInt(process.env.ELD_EXIT_GRACE_WINDOWS, 10) || 2,
});

/** Set in start(); used by interval. Cleared in stop(). */
let runtimeConfig = null;

let histogram = null;
let windowInterval = null;
let consecutiveCriticalWindows = 0;
let isDegraded = false;
let lastLogTime = 0;
let currentMetrics = null;
let windowsAfterDegraded = 0;
let exitScheduled = false;

const nsToMs = ns => ns / 1e6;

const isEnvEnabled = () =>
  process.env.ELD_ENABLED !== 'false' && process.env.ELD_MONITOR !== 'false';

export const getMetrics = () => {
  if (!histogram) {
    return null;
  }

  return {
    min: nsToMs(histogram.min),
    max: nsToMs(histogram.max),
    mean: nsToMs(histogram.mean),
    stddev: nsToMs(histogram.stddev),
    p50: nsToMs(histogram.percentile(50)),
    p90: nsToMs(histogram.percentile(90)),
    p99: nsToMs(histogram.percentile(99)),
    exceeds: histogram.exceeds,
  };
};

const logMetrics = (level, message, metrics) => {
  const cfg = runtimeConfig;
  if (!cfg) return;
  const now = Date.now();
  if (now - lastLogTime < cfg.logCooldownMs) {
    return;
  }
  lastLogTime = now;

  const logData = {
    message,
    metrics: {
      p50: `${metrics.p50.toFixed(2)}ms`,
      p90: `${metrics.p90.toFixed(2)}ms`,
      p99: `${metrics.p99.toFixed(2)}ms`,
      max: `${metrics.max.toFixed(2)}ms`,
      mean: `${metrics.mean.toFixed(2)}ms`,
    },
    thresholds: {
      warn: `${cfg.warnThresholdMs}ms`,
      critical: `${cfg.criticalThresholdMs}ms`,
    },
    state: {
      consecutiveCriticalWindows,
      isDegraded,
    },
  };

  if (level === 'warn') {
    console.warn('[ELD Monitor]', JSON.stringify(logData));
  } else if (level === 'error') {
    console.error('[ELD Monitor]', JSON.stringify(logData));
  }
};

const scheduleExit = () => {
  if (exitScheduled) return;
  exitScheduled = true;

  console.error('[ELD Monitor] Initiating graceful shutdown due to sustained critical ELD');

  setTimeout(() => {
    console.error('[ELD Monitor] Exiting process (exit code 1) for container restart');
    process.exit(1);
  }, 5000);
};

const processWindow = () => {
  const metrics = getMetrics();
  if (!metrics) return;

  currentMetrics = { ...metrics, timestamp: Date.now() };

  const cfg = runtimeConfig;
  if (!cfg) return;

  const { p99 } = metrics;

  if (p99 >= cfg.criticalThresholdMs) {
    consecutiveCriticalWindows++;
    logMetrics('error', 'Event loop delay CRITICAL', metrics);

    if (consecutiveCriticalWindows >= cfg.criticalWindowCount && !isDegraded) {
      isDegraded = true;
      windowsAfterDegraded = 0;
      console.error(
        '[ELD Monitor] Service marked as DEGRADED after',
        consecutiveCriticalWindows,
        'consecutive critical windows',
      );
    }

    if (isDegraded) {
      windowsAfterDegraded++;
      if (cfg.autoExitOnCritical && windowsAfterDegraded >= cfg.exitGraceWindows) {
        scheduleExit();
      }
    }
  } else if (p99 >= cfg.warnThresholdMs) {
    consecutiveCriticalWindows = 0;
    windowsAfterDegraded = 0;
    logMetrics('warn', 'Event loop delay elevated', metrics);

    if (isDegraded) {
      isDegraded = false;
      console.info('[ELD Monitor] Service recovered from degraded state');
    }
  } else {
    if (consecutiveCriticalWindows > 0 || isDegraded) {
      console.info('[ELD Monitor] Event loop delay returned to normal');
    }
    consecutiveCriticalWindows = 0;
    windowsAfterDegraded = 0;
    if (isDegraded) {
      isDegraded = false;
      console.info('[ELD Monitor] Service recovered from degraded state');
    }
  }

  histogram.reset();
};

export const start = () => {
  if (!isEnvEnabled()) {
    return;
  }

  if (histogram) {
    console.warn('[ELD Monitor] Already running');
    return;
  }

  runtimeConfig = readConfig();
  const cfg = runtimeConfig;

  histogram = monitorEventLoopDelay({ resolution: cfg.resolutionNs });
  histogram.enable();

  windowInterval = setInterval(processWindow, cfg.windowMs);
  windowInterval.unref();

  console.info('[ELD Monitor] Started with config:', {
    resolutionNs: cfg.resolutionNs,
    resolutionApproxMs: `${(cfg.resolutionNs / 1e6).toFixed(6)}ms`,
    window: `${cfg.windowMs}ms`,
    warnThreshold: `${cfg.warnThresholdMs}ms`,
    criticalThreshold: `${cfg.criticalThresholdMs}ms`,
    criticalWindowCount: cfg.criticalWindowCount,
    logCooldown: `${cfg.logCooldownMs}ms`,
    autoExitOnCritical: cfg.autoExitOnCritical,
    exitGraceWindows: cfg.exitGraceWindows,
  });
};

export const stop = () => {
  const wasActive = histogram !== null || windowInterval !== null;
  if (windowInterval) {
    clearInterval(windowInterval);
    windowInterval = null;
  }
  if (histogram) {
    histogram.disable();
    histogram = null;
  }
  consecutiveCriticalWindows = 0;
  isDegraded = false;
  currentMetrics = null;
  windowsAfterDegraded = 0;
  exitScheduled = false;
  runtimeConfig = null;
  if (wasActive) {
    console.info('[ELD Monitor] Stopped');
  }
};

export const getHealthStatus = () => {
  const cfg = runtimeConfig || readConfig();
  return {
    healthy: !isDegraded,
    degraded: isDegraded,
    consecutiveCriticalWindows,
    requiredCriticalWindows: cfg.criticalWindowCount,
    metrics: currentMetrics,
    thresholds: {
      warnMs: cfg.warnThresholdMs,
      criticalMs: cfg.criticalThresholdMs,
    },
  };
};

export const isReady = () => !isDegraded;

export const isActive = () => histogram !== null;

/** Effective config: frozen snapshot while running, else read from env. */
export const getConfig = () => runtimeConfig || readConfig();

export { isEnvEnabled };

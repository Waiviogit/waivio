import { getOrSetAidCookie } from '../analytics/aid';
import { buildPingVarsForRequest, getAnalyticScript } from '../analytics/ssrInject';

export const makeAnalyticsInjectMiddleware = secret => {
  return (req, res, next) => {
    try {
      const aid = getOrSetAidCookie(req, res);
      const ua = req.get('user-agent') || '';
      const vars = buildPingVarsForRequest(secret, aid, ua);
      const inject = getAnalyticScript(vars);

      req.ssrInject = req.ssrInject || {};
      req.ssrInject.analytics = inject;
      next();
    } catch (e) {
      next();
    }
  };
};

import websitesRoutes from './configs/websitesRoutes';
import routes from './configs/routes';
import socialRoutes from '../client/social-gifts/routes';
import { socialDomens } from '../client/social-gifts/listOfSocialWebsites';

const switchRoutes = (host, parentHost) => {
  const hostForCheck = parentHost || host || '';

  if (socialDomens.some(item => hostForCheck?.includes(item))) return socialRoutes(host);
  if (!hostForCheck?.includes('dining')) return websitesRoutes(host);

  return routes;
};

export default switchRoutes;

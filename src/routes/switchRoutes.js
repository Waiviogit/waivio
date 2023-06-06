import websitesRoutes from './configs/websitesRoutes';
import routes from './configs/routes';
import socialRoutes from '../client/social-gifts/routes';
import { socialDomens } from '../client/social-gifts/listOfSocialWebsites';

const switchRoutes = (host, page) => {
  if (socialDomens.some(item => host.includes(item))) return socialRoutes(host, page);
  if (host.includes('dining')) return websitesRoutes(host, page);

  return routes;
};

export default switchRoutes;

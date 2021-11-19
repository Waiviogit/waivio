import websitesRoutes from './configs/websitesRoutes';
import routes from './configs/routes';

const switchRoutes = host => {
  if (host.includes('dining')) return websitesRoutes(host);

  return routes;
};

export default switchRoutes;

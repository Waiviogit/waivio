import websitesRoutes from './configs/websitesRoutes';
import routes from './configs/routes';

const switchRoutes = host => {
  if (host.includes('host')) return websitesRoutes(host);

  return routes;
};

export default switchRoutes;

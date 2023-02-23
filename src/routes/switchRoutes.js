import websitesRoutes from './configs/websitesRoutes';
import routes from './configs/routes';

const switchRoutes = (host, page) => {
  if (host.includes('dining')) return websitesRoutes(host, page);

  return routes;
};

export default switchRoutes;

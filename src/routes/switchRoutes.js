import websitesRoutes from './configs/websitesRoutes';
import routes from './configs/routes';
import socialRoutes from '../client/social-gifts/routes';

const switchRoutes = (
  // host,
  page,
) => {
  const host = 'https://socialgifts.pp.ua/';

  if (host.includes('socialgifts')) return socialRoutes(host, page);
  if (host.includes('dining')) return websitesRoutes(host, page);

  return routes;
};

export default switchRoutes;

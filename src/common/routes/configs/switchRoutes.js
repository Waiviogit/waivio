import websitesRoutes from "./websitesRoutes";
import routes from "./routes";

 const switchRoutes = host => {
  if(host.includes('localhost')) return websitesRoutes;

  return routes;
}

export default switchRoutes;

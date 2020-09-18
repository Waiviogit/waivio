const createNestedRouts = ({ pathScope, ...route }, path = '') => {
  let routePath;
  const mappedRoute = { ...route };

  if (pathScope && !route.path) mappedRoute.path = pathScope;
  else if (Array.isArray(route.path)) {
    routePath = route.path.map(rPath => path + rPath);
  } else {
    routePath = (path || '') + (route.path || '');
  }

  if (routePath) mappedRoute.path = routePath;

  if (route.routes) {
    mappedRoute.routes = route.routes.map(a => createNestedRouts(a, pathScope || mappedRoute.path));
  }
  return mappedRoute;
};

export default createNestedRouts;

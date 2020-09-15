const createNestedRouts = ({ pathScope, ...route }, path = '') => {
  let routePath;
  const mappedRoute = { ...route };

  if (Array.isArray(route.path)) {
    routePath = route.path.map(rPath => path + rPath);
  } else {
    routePath = route.path || path ? path + route.path : '';
  }

  mappedRoute.path = routePath;

  if (pathScope && !route.path) mappedRoute.path = pathScope;

  if (route.routes) {
    mappedRoute.routes = route.routes.map(a => createNestedRouts(a, pathScope || mappedRoute.path));
  }
  return mappedRoute;
};

export default createNestedRouts;

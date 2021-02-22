import { isString } from 'lodash';

const createNestedRouts = ({ pathScope, ...route }, path = '') => {
  let routePath;
  const mappedRoute = { ...route };

  if (isString(pathScope) && !route.path) mappedRoute.path = pathScope;
  else if (Array.isArray(route.path)) {
    routePath = route.path.map(rPath => path + rPath);
  } else {
    routePath = (path || '') + (route.path || '');
  }

  if (routePath) mappedRoute.path = routePath;

  const currentPath = isString(pathScope) ? pathScope : mappedRoute.path;

  if (route.routes) mappedRoute.routes = route.routes.map(a => createNestedRouts(a, currentPath));

  return mappedRoute;
};

export default null;

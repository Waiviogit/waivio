import React from 'react';

import { Switch } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import switchRoutes from '../routes/switchRoutes';

export default page => (
  <Switch onUpdate={() => window.scrollTo(0, 0)}>
    {renderRoutes(switchRoutes(location.hostname, page))}
  </Switch>
);

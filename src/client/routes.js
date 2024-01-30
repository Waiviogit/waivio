import React from 'react';

import { Switch } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import switchRoutes from '../routes/switchRoutes';

export default (page, host, parentHost) => (
  <Switch
    onUpdate={() => {
      if (typeof window !== 'undefined') window.scrollTo(0, 0);
    }}
  >
    {renderRoutes(switchRoutes(host, parentHost))}
  </Switch>
);

import React from 'react';
import { useRouteMatch } from 'react-router';
import ShopWebsiteConfigurations from './ConfigPages/ShopWebsiteConfigurations';
import WebsitesConfigurations from './ConfigPages/WebsitesConfigurations';

const SwitchConfigPage = () => {
  const match = useRouteMatch();

  if (match.params.site.includes('.socialgifts.')) return <ShopWebsiteConfigurations />;

  return <WebsitesConfigurations />;
};

export default SwitchConfigPage;

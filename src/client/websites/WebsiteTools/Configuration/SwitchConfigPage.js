import React from 'react';
import { useRouteMatch } from 'react-router';
import ShopWebsiteConfigurations from './ConfigPages/ShopWebsiteConfigurations';
import WebsitesConfigurations from './ConfigPages/WebsitesConfigurations';
import { socialDomens } from '../../../social-gifts/listOfSocialWebsites';

const SwitchConfigPage = () => {
  const match = useRouteMatch();

  if (socialDomens.some(item => match.params.site.includes(item)))
    return <ShopWebsiteConfigurations />;

  return <WebsitesConfigurations />;
};

export default SwitchConfigPage;

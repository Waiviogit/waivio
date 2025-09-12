import React, { useLayoutEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';
import ShopWebsiteConfigurations from './ConfigPages/ShopWebsiteConfigurations';
import WebsitesConfigurations from './ConfigPages/WebsitesConfigurations';
import { isCustomDomain, socialDomens } from '../../../social-gifts/listOfSocialWebsites';
import { getParentHost } from '../../../../waivioApi/ApiClient';

const SwitchConfigPage = () => {
  const match = useRouteMatch();
  const [host, setHost] = useState(match.params.site);

  useLayoutEffect(() => {
    if (isCustomDomain(match.params.site)) {
      getParentHost(match.params.site).then(res => {
        setHost(res);
      });
    }
  }, []);

  if (host && socialDomens.some(item => host.includes(item))) return <ShopWebsiteConfigurations />;

  return <WebsitesConfigurations />;
};

export default SwitchConfigPage;

import React from 'react';
import Sidenav from '../../components/Navigation/Sidenav';

const DealsList = () => {
  const menu = [
    {
      name: 'Open deals',
      linkTo: '/deals/open',
      intl: { id: 'sidebarWidget.tabTitle.openDeals', defaultMessage: 'Open deals' },
      badge: null,
      isHidden: false,
    },
    {
      name: 'Closed deals',
      linkTo: '/deals/closed',
      intl: { id: 'sidebarWidget.tabTitle.closedDeals', defaultMessage: 'Closed deals' },
      badge: null,
      isHidden: false,
    },
  ];
  return (
    <div>
      <Sidenav navigationMenu={menu} />
    </div>
  );
};

export default DealsList;

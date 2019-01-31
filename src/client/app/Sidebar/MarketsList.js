import React from 'react';
import { marketNames } from '../../../investarena/constants/objectsInvestarena';
import Sidenav from '../../components/Navigation/Sidenav';

const MarketsList = () => {
  const menu = [
    {
      name: 'Favorites',
      linkTo: '/markets/favorites',
      intl: { id: 'sidebarWidget.tabTitle.favorites', defaultMessage: 'Favorites' },
    },
    ...marketNames.map(market => ({
      ...market,
      linkTo: `/markets/${market.name}`,
    })),
  ];
  return (
    <div>
      <Sidenav navigationMenu={menu} />
    </div>
  );
};

export default MarketsList;

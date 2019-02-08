import React from 'react';
import PropTypes from 'prop-types';
import { marketNames } from '../../../investarena/constants/objectsInvestarena';
import Sidenav from '../../components/Navigation/Sidenav';

const MarketsList = ({ quoteSettingsSorted }) => {
  const menu = [
    {
      name: 'Favorites',
      linkTo: '/markets/favorites',
      intl: { id: 'sidebarWidget.tabTitle.favorites', defaultMessage: 'Favorites' },
      badge: false,
      isHidden: true,
    },
    ...marketNames.map(market => {
      const count = market.names.reduce(
        (acc, marketName) => acc + (quoteSettingsSorted[marketName] ? quoteSettingsSorted[marketName].length : 0),
        0,
      );
      return {
        ...market,
        linkTo: `/markets/${market.name}`,
        badge: count,
        isHidden: !count,
      };
    }),
  ];
  return <Sidenav navigationMenu={menu} />;
};

MarketsList.propTypes = {
  quoteSettingsSorted: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};


export default MarketsList;

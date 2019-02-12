import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { marketNames } from '../../../investarena/constants/objectsInvestarena';
import Sidenav from '../../components/Navigation/Sidenav';
import MarketsListLoading from './MarketsListLoadivg';

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
        (acc, marketName) =>
          acc + (quoteSettingsSorted[marketName] ? quoteSettingsSorted[marketName].length : 0),
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
  return _.isEmpty(quoteSettingsSorted) ? (
    <MarketsListLoading />
  ) : (
    <Sidenav navigationMenu={menu} />
  );
};

MarketsList.propTypes = {
  quoteSettingsSorted: PropTypes.shape().isRequired,
};

export default MarketsList;

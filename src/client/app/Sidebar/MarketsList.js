import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { marketNames } from '../../../investarena/constants/objectsInvestarena';
import Sidenav from '../../components/Navigation/Sidenav';
import { getQuotesSettingsState } from '../../../investarena/redux/selectors/quotesSettingsSelectors';

const MarketsList = ({ quoteSettings }) => {
  const instrumentsCount = Object.values(quoteSettings).reduce((acc, quote) => {
    return { ...acc, [quote.market]: acc[quote.market] ? acc[quote.market] + 1 : 1 };
  }, {});
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
        (acc, marketName) => acc + (instrumentsCount[marketName] || 0),
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
  quoteSettings: PropTypes.shape().isRequired,
};

MarketsList.defaultProps = {
  quoteFavorites: [],
};

export default connect(state => ({
  quoteSettings: getQuotesSettingsState(state),
  quoteFavorites: [],
}))(MarketsList);

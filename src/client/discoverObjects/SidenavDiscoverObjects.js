import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getObjectTypesLoading } from '../reducers';
import SkeletonCustom from '../components/Skeleton/SkeletonCustom';
import SidebarMenu from '../components/Sidebar/SidebarMenu/SidebarMenu';
import { BROKER } from '../../investarena/constants/platform';

const menuSections = {
  ALL: 'All',
  ASSETS: 'Assets',
  BROKERS: 'Brokers',
  HASHTAGS: 'Hashtags',
};
const menuConfig = {
  [menuSections.ALL]: {
    name: menuSections.ALL,
    intlId: 'all',
    isCollapsible: false,
    linkTo: '/discover-objects/show_all',
    items: [],
  },
  [menuSections.ASSETS]: {
    name: menuSections.ASSETS,
    intlId: 'sidebar.nav.assets',
    isCollapsible: true,
    isCollapsed: false,
    items: [
      {
        name: 'Commodities',
        intlId: 'wia.commodities',
        linkTo: '/discover-objects/commodity',
      },
      {
        name: 'Cryptocurrencies',
        intlId: 'modalAssets.cryptocurrencies',
        linkTo: '/discover-objects/crypto',
      },
      {
        name: 'Currencies',
        intlId: 'wia.currencies',
        linkTo: '/discover-objects/currencies',
      },
      {
        name: 'Indices',
        intlId: 'modalAssets.indices',
        linkTo: '/discover-objects/indices',
      },
      {
        name: 'Stocks',
        intlId: 'modalAssets.stocks',
        linkTo: '/discover-objects/stocks',
      },
    ],
  },
  [menuSections.BROKERS]: {
    name: menuSections.BROKERS,
    intlId: 'brokers',
    isCollapsible: true,
    isCollapsed: true,
    items: [
      {
        name: '770Capital',
        intlId: BROKER['770CAPITAL'],
        linkTo: '/object/gkm-770capital',
      },
      {
        name: 'DowMarkets',
        intlId: BROKER.DOWMARKETS,
        linkTo: '/object/mrp-dowmarkets',
      },
      {
        name: 'LimeFx',
        intlId: BROKER.LIMEFX,
        linkTo: '/object/xfx-limefx',
      },
      {
        name: 'Maximarkets',
        intlId: BROKER.MAXIMARKETS,
        linkTo: '/object/wsp-maximarkets',
      },
      {
        name: 'Maxitrade',
        intlId: BROKER.MAXITRADE,
        linkTo: '/object/lir-maxitrade',
      },
      {
        name: 'TradeAllCrypto',
        intlId: BROKER.TRADEALLCRYPTO,
        linkTo: '/object/ftt-tradeallcrypto',
      },
      {
        name: 'Tradiva',
        intlId: BROKER.TRADIVA,
        linkTo: '/object/wqt-tradiva',
      },
      {
        name: 'Umarkets',
        intlId: BROKER.UMARKETS,
        linkTo: '/object/prj-4e4ges-umarkets',
      },
    ],
  },
  [menuSections.HASHTAGS]: {
    name: menuSections.HASHTAGS,
    intlId: 'hashtags',
    isCollapsible: false,
    linkTo: '/discover-objects/hashtag',
    items: [],
  },
};

const SidenavDiscoverObjects = ({ withTitle }) => {
  // redux-store
  const isLoading = useSelector(getObjectTypesLoading);
  return (
    <div className="sidenav-discover-objects Sidenav">
      {withTitle && (
        <div className="Sidenav__section-title">
          <FormattedMessage id="objects" defaultMessage="Objects" />:
        </div>
      )}
      {isLoading ? (
        <SkeletonCustom
          className="sidenav-discover-objects__loading"
          isLoading={isLoading}
          randomWidth
          rows={10}
          width={170}
        />
      ) : (
        <SidebarMenu menuConfig={menuConfig} />
      )}
    </div>
  );
};

SidenavDiscoverObjects.propTypes = {
  withTitle: PropTypes.bool,
};
SidenavDiscoverObjects.defaultProps = {
  withTitle: true,
};

export default SidenavDiscoverObjects;

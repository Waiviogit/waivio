import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getObjectTypesLoading } from '../reducers';
import SkeletonCustom from '../components/Skeleton/SkeletonCustom';
import SidebarMenu from '../components/Sidebar/SidebarMenu/SidebarMenu';

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
    isCollapsible: false,
    linkTo: '/discover-objects/brokers',
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

import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getObjectTypesLoading } from '../reducers';
import SkeletonCustom from '../components/Skeleton/SkeletonCustom';
import SidebarMenu from '../components/Sidebar/SidebarMenu/SidebarMenu';

const objectsMenuSections = {
  HASHTAGS: 'Hashtags',
  CRYPTOPAIRS: 'Crypto pairs',
  CRYPTOCURRENCIES: 'Cryptocurrencies',
};
const objectMenuConfig = {
  [objectsMenuSections.HASHTAGS]: {
    name: objectsMenuSections.HASHTAGS,
    intlId: 'hashtags',
    isCollapsible: false,
    linkTo: '/discover-objects/hashtag',
    items: [],
  },
  [objectsMenuSections.CRYPTOPAIRS]: {
    name: objectsMenuSections.CRYPTOPAIRS,
    intlId: 'modalAssets.cryptopairs',
    isCollapsible: false,
    linkTo: '/discover-objects/cryptopairs',
    items: [],
  },
  [objectsMenuSections.CRYPTOCURRENCIES]: {
    name: objectsMenuSections.CRYPTOCURRENCIES,
    intlId: 'modalAssets.cryptocurrencies',
    isCollapsible: false,
    linkTo: '/discover-objects/crypto',
    items: [],
  },
};
const usersMenuConfig = {
  All: {
    name: 'All',
    intlId: 'all',
    isCollapsible: false,
    linkTo: '/discover',
    items: [],
  },
};

const SidenavDiscoverObjects = ({ withTitle, toggleMobileNavigation }) => (
    <div className="sidenav-discover-objects Sidenav">
      {withTitle && (
        <div className="Sidenav__section-title">
          <FormattedMessage id="objects" defaultMessage="Objects" />:
        </div>
      )}
      <SidebarMenu
        menuConfig={objectMenuConfig}
        toggleMobileNavigation={toggleMobileNavigation}
        users
      />
      {withTitle && (
        <div className="Sidenav__section-title">
          <FormattedMessage id="users" defaultMessage="users" />:
        </div>
      )}
      <SidebarMenu
        menuConfig={usersMenuConfig}
        toggleMobileNavigation={toggleMobileNavigation}
        users
      />
    </div>
  );

SidenavDiscoverObjects.propTypes = {
  toggleMobileNavigation: PropTypes.func,
  withTitle: PropTypes.bool,
};
SidenavDiscoverObjects.defaultProps = {
  toggleMobileNavigation: () => {},
  withTitle: true,
};

export default SidenavDiscoverObjects;

import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getObjectTypesLoading } from '../reducers';
import SidebarMenu from '../components/Sidebar/SidebarMenu/SidebarMenu';
import SidenavDiscoverObjectsLoading from './SidenavDiscoverObjectsLoading';

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

const SidenavDiscoverObjects = ({ withTitle, toggleMobileNavigation, isMobile }) => {
  const isLoading = useSelector(getObjectTypesLoading);

  return (
    <div className="sidenav-discover-objects Sidenav">
      {withTitle && (
        <div className="Sidenav__section-title">
          <FormattedMessage id="objects" defaultMessage="Objects" />:
        </div>
      )}
      {isLoading ? (
        <SidenavDiscoverObjectsLoading />
      ) : (
        <SidebarMenu
          menuConfig={objectMenuConfig}
          toggleMobileNavigation={toggleMobileNavigation}
          isMobile={isMobile}
          users
        />
      )}
      {withTitle && (
        <div className="Sidenav__section-title">
          <FormattedMessage id="users" defaultMessage="users" />:
        </div>
      )}
      {isLoading ? (
        <SidenavDiscoverObjectsLoading />
      ) : (
        <SidebarMenu
          menuConfig={usersMenuConfig}
          toggleMobileNavigation={toggleMobileNavigation}
          isMobile={isMobile}
          users
        />
      )}
    </div>
  );
};

SidenavDiscoverObjects.propTypes = {
  toggleMobileNavigation: PropTypes.func,
  withTitle: PropTypes.bool,
  isMobile: PropTypes.bool,
};
SidenavDiscoverObjects.defaultProps = {
  toggleMobileNavigation: () => {},
  withTitle: true,
  isMobile: false,
};

export default SidenavDiscoverObjects;

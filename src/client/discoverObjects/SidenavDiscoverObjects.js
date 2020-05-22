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
        <SkeletonCustom
          className="sidenav-discover-objects__loading"
          isLoading={isLoading}
          randomWidth
          rows={10}
          width={170}
        />
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
        <SkeletonCustom
          className="sidenav-discover-objects__loading"
          isLoading={isLoading}
          randomWidth
          rows={10}
          width={170}
        />
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

import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getObjectTypesLoading } from '../reducers';
import SkeletonCustom from '../components/Skeleton/SkeletonCustom';
import SidebarMenu from '../components/Sidebar/SidebarMenu/SidebarMenu';

const menuSections = {
  HASHTAGS: 'Hashtags',
  CRYPTOPAIRS: 'Crypto pairs',
  CRYPTOCURRENCIES: 'Cryptocurrencies',
};
const menuConfig = {
  [menuSections.HASHTAGS]: {
    name: menuSections.HASHTAGS,
    intlId: 'hashtags',
    isCollapsible: false,
    linkTo: '/discover-objects/hashtag',
    items: [],
  },
  [menuSections.CRYPTOPAIRS]: {
    name: menuSections.CRYPTOPAIRS,
    intlId: 'modalAssets.cryptopairs',
    isCollapsible: false,
    linkTo: '/discover-objects/cryptopairs',
    items: [],
  },
  [menuSections.CRYPTOCURRENCIES]: {
    name: menuSections.CRYPTOCURRENCIES,
    intlId: 'modalAssets.cryptocurrencies',
    isCollapsible: false,
    linkTo: '/discover-objects/crypto',
    items: [],
  },
};

const SidenavDiscoverObjects = ({ withTitle, toggleMobileNavigation, isMobile }) => {
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
        <SidebarMenu
          menuConfig={menuConfig}
          toggleMobileNavigation={toggleMobileNavigation}
          isMobile={isMobile}
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

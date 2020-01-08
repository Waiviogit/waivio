import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import SidebarMenu from './SidebarMenu';
import FollowingUpdates from '../FollowingUpdates/FollowingUpdates';
import { getIsAuthenticated } from '../../../reducers';
import ModalSignIn from '../../Navigation/ModlaSignIn/ModalSignIn';

const menuSections = {
  STEEM: 'Steem',
  PERSONAL: 'Personal',
};
const getMenuConfig = ({ isAuthenticated }) => ({
  [menuSections.STEEM]: {
    name: menuSections.STEEM,
    intlId: 'steem',
    isCollapsible: true,
    isCollapsed: isAuthenticated,
    items: [
      {
        name: 'Trending',
        intlId: 'sort_trending',
        linkTo: '/trending', // linkTo: '/' - for unauthenticated
        unauthLink: '/',
      },
      {
        name: 'Hot',
        intlId: 'sort_hot',
        linkTo: '/hot',
      },
      {
        name: 'New',
        intlId: 'sort_created',
        linkTo: '/created',
      },
    ],
  },
  [menuSections.PERSONAL]: {
    name: menuSections.PERSONAL,
    intlId: 'personal',
    isCollapsible: true,
    isCollapsed: false,
    requireAuth: true,
    items: [
      {
        name: 'My feed',
        intlId: 'my_feed',
        linkTo: '/',
      },
      {
        name: 'Notifications',
        intlId: 'notifications',
        linkTo: '/notifications-list',
      },
      {
        name: 'Updates',
        intlId: 'updates',
        linkTo: '/updates',
        disabled: true,
      },
    ],
  },
});

const SidebarMenuContainer = props => {
  const isAuthenticated = useSelector(getIsAuthenticated);
  return (
    <React.Fragment>
      <SidebarMenu menuConfig={getMenuConfig({ isAuthenticated })} {...props} />
      {isAuthenticated ? (
        <FollowingUpdates />
      ) : (
        <div className="pt3">
          <ModalSignIn isButton={false} />
          &nbsp;
          <FormattedMessage id="more_options" defaultMessage="for more options" />
        </div>
      )}
    </React.Fragment>
  );
};

SidebarMenuContainer.propTypes = {
  location: PropTypes.shape().isRequired,
};

export default SidebarMenuContainer;

import React from 'react';
import SidebarMenu from './SidebarMenu';

// todo: sync with dev branch

const menuSections = {
  HIVE: 'Steem',
  PERSONAL: 'Personal',
};
const menuConfig = {
  [menuSections.HIVE]: {
    name: menuSections.HIVE,
    intlId: 'steem',
    isCollapsible: true,
    isCollapsed: false,
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
        linkTo: '/notifications',
      },
      {
        name: 'Updates',
        intlId: 'updates',
        linkTo: '/updates',
        disabled: true,
      },
    ],
  },
};

const SidebarMenuContainer = props => <SidebarMenu menuConfig={menuConfig} {...props} />;

export default SidebarMenuContainer;

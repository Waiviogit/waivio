export const personalSettings = {
  tab: {
    name: 'personal',
    id: 'sidenav_user_personal',
    defaultMessage: 'Personal:',
  },
  settings: [
    {
      to: '/drafts',
      id: 'drafts',
      defaultMessage: 'Drafts',
    },
    {
      to: '/bookmarks',
      id: 'bookmarks',
      defaultMessage: 'Bookmarks',
    },
    {
      to: '/edit-profile',
      id: 'edit_profile',
      defaultMessage: 'Edit profile',
    },
    {
      to: '/settings',
      id: 'settings',
      defaultMessage: 'Settings',
    },
    {
      to: '/guests-settings',
      id: 'guest_settings',
      defaultMessage: 'Guests Settings',
      forGuest: true,
    },
    {
      to: '/notification-settings',
      id: 'notifications',
      defaultMessage: 'Notifications',
    },
    {
      to: '/invite',
      id: 'invite',
      defaultMessage: 'Invite',
    },
  ],
};
export const websiteSettings = {
  tab: {
    name: 'websites',
    id: 'sidenav_user_websites',
    defaultMessage: 'Websites:',
  },
  settings: [
    {
      to: '/create',
      id: 'sidenav_user_create',
      defaultMessage: 'Create',
    },
    {
      to: '/manage',
      id: 'sidenav_user_manage',
      defaultMessage: 'Manage',
    },
    {
      to: '/payments',
      id: 'sidenav_user_payments',
      defaultMessage: 'Payments',
    },
  ],
};
export const currentWebsiteSettings = site => [
  {
    to: `/${site}/configuration`,
    id: 'sidenav_user_configuration',
    defaultMessage: 'Configuration',
  },
  {
    to: `/${site}/settings`,
    id: 'sidenav_user_settings',
    defaultMessage: 'Settings',
  },
  {
    to: `/${site}/administrations`,
    id: 'sidenav_user_administrations',
    defaultMessage: 'Administrations',
  },
  {
    to: `/${site}/moderators`,
    id: 'moderators',
    defaultMessage: 'Moderators',
  },
  {
    to: `/${site}/authorities`,
    id: 'authorities',
    defaultMessage: 'Authorities',
  },
  {
    to: `/${site}/objects`,
    id: 'areas',
    defaultMessage: 'Areas',
  },
  {
    to: `/${site}/objects-filters`,
    id: 'objects_filters',
    defaultMessage: 'Objects filters',
  },
  {
    to: `/${site}/muted-users`,
    id: 'muted_users',
    defaultMessage: 'Muted users',
  },
];

export default null;

export const personalSettings = {
  tab: {
    name: 'personal',
    id: 'sidenav_user_personal',
    defaultMessage: 'Personal:',
  },
  settings: [
    {
      to: '/notification-settings',
      id: 'notifications',
      defaultMessage: 'Notifications',
    },
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
      to: '/new-accounts',
      id: 'new_accounts',
      defaultMessage: 'New accounts',
    },
    {
      to: '/invite',
      id: 'invite',
      defaultMessage: 'Invite',
    },
  ],
};
export const dataManagementSettings = {
  tab: {
    name: 'dataManagement',
    id: 'sidenav_user_data_management',
    defaultMessage: 'Data management:',
  },
  settings: [
    {
      to: '/data-import',
      id: 'data_import',
      defaultMessage: 'Data import',
    },
    {
      to: '/chrome-extension',
      id: 'chrome-extension',
      defaultMessage: 'Chrome extension',
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
export const currentWebsiteSettings = site => {
  const items = [
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
      to: `/${site}/muted-users`,
      id: 'muted_users',
      defaultMessage: 'Muted users',
    },
  ];

  if (site.includes('socialgifts.')) {
    items.splice(2, 0, {
      to: `/${site}/affiliate`,
      id: 'affiliate_codes',
      defaultMessage: 'Affiliate codes',
    });
  }

  if (site.includes('dining')) {
    items.splice(4, 0, {
      to: `/${site}/objects`,
      id: 'areas',
      defaultMessage: 'Areas',
    });
    items.splice(6, 0, {
      to: `/${site}/objects-filters`,
      id: 'objects_filters',
      defaultMessage: 'Objects filters',
    });
  }

  return items;
};

export default null;

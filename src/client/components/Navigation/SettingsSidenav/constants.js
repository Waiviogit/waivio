import { socialDomens } from '../../../social-gifts/listOfSocialWebsites';

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
      to: '/user-affiliate-codes',
      id: 'user_affiliate_codes',
      defaultMessage: 'Affiliate codes',
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
      to: '/claim-authority',
      id: 'claim_authority',
      defaultMessage: 'Claim authority',
    },
    {
      to: '/departments-bot',
      id: 'departments_bot',
      defaultMessage: 'Departments bot',
    },
    {
      to: '/descriptions-bot',
      id: 'descriptions_bot',
      defaultMessage: 'Descriptions bot',
    },
    {
      to: '/list-duplication',
      id: 'list_duplication',
      defaultMessage: 'List duplication',
    },
    {
      to: '/message-bot',
      id: 'message_bot',
      defaultMessage: 'Message bot',
      forUser: true,
    },
    {
      to: '/reposting-bot',
      id: 'reposting_bot',
      defaultMessage: 'Reposting bot',
    },
    {
      to: '/tags-bot',
      id: 'tag_bot',
      defaultMessage: 'Tags bot',
    },
    {
      to: '/chrome-extension',
      id: 'chrome-extension',
      defaultMessage: 'Chrome extension',
    },
  ],
};
export const sitesDataManagementSettings = {
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
export const currentWebsiteSettings = (site, parentHost) => {
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
    {
      to: `/${site}/adsense`,
      id: 'adsense',
      defaultMessage: 'AdSense ads',
    },
  ];

  if (socialDomens.some(item => parentHost?.includes(item))) {
    items.splice(2, 0, {
      to: `/${site}/affiliate-codes`,
      id: 'affiliate_codes',
      defaultMessage: 'Affiliate codes',
    });
  }

  if (parentHost?.includes('dining')) {
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

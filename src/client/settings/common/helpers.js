import { get } from 'lodash';

export const getSettingsTitle = match => {
  const param = get(match, ['params', '0'], '');

  switch (param) {
    case 'configuration':
      return { id: 'sidenav_user_configuration', defaultMessage: 'Configuration' };
    case 'settings':
      return { id: 'sidenav_user_settings', defaultMessage: 'Settings' };
    case 'administrations':
      return { id: 'sidenav_user_administrations', defaultMessage: 'Administrations' };
    case 'moderators':
      return { id: 'moderators', defaultMessage: 'Moderators' };
    case 'objects':
      return { id: 'objects', defaultMessage: 'objects' };
    case 'authorities':
      return { id: 'authorities', defaultMessage: 'Authorities' };
    case 'objects-filters':
      return { id: 'objects_filters', defaultMessage: 'Objects filters' };
    case 'muted-users':
      return { id: 'muted_users', defaultMessage: 'Muted users' };
    case 'drafts':
      return { id: 'drafts', defaultMessage: 'Drafts' };
    case 'bookmarks':
      return { id: 'bookmarks', defaultMessage: 'Bookmarks' };
    case 'edit-profile':
      return { id: 'edit-profile', defaultMessage: 'Edit profile' };
    case 'notification-settings':
      return { id: 'notification-settings', defaultMessage: 'Notification Settings' };
    case 'guests-settings':
      return { id: 'guests_account_settings', defaultMessage: 'Guests Account Settings' };
    case 'invite':
      return { id: 'invite', defaultMessage: 'Invite' };

    default:
      return { id: 'websites', defaultMessage: 'Websites' };
  }
};

export default null;

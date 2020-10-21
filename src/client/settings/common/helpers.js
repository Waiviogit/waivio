import { get } from 'lodash';

export const getWebsiteSettingsTitle = match => {
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
    default:
      return { id: 'websites', defaultMessage: 'Websites' };
  }
};

export default null;

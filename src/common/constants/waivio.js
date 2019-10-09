import * as apiConfig from '../../waivioApi/config.json';

export const WAIVIO_META_FIELD_NAME = 'wobj';
export const INVESTARENA_META_FIELD_NAME = 'wia';
export const WAIVIO_PARENT_PERMLINK = apiConfig[process.env.NODE_ENV].appName || 'waiviodev';;

export const MAX_NEW_OBJECTS_NUMBER = 5;

export const WAIVIO_POST_TYPE = {
  CREATE_POST: 'CREATE_POST',
  APPEND_OBJECT: 'APPEND_OBJECT',
};

export const PRIMARY_COLOR = '#f87007';

export const DEFAULT_OBJECT_AVATAR_URL =
  'https://cdn.steemitimages.com/DQmWxwUb1hpd3X2bSL9VrWbJvNxKXDS2kANWoGTkwi4RdwV/unknown.png';

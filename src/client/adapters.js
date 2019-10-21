import { isEmpty } from 'lodash';
import { objectFields } from '../common/constants/listOfFields';
import { getFieldsWithMaxWeight } from './object/wObjectHelper';
import DEFAULTS from './object/const/defaultValues';
import { APP_NAME } from '../common/constants/waivio';

export const getClientWObj = (serverWObj, usedLocale = 'en-US') => {
  /* eslint-disable no-underscore-dangle */
  /* eslint-disable camelcase */
  const {
    author_permlink,
    followers_names,
    weight,
    created_at,
    updated_at,
    user_count,
    object_type,
  } = serverWObj;

  if (!serverWObj || isEmpty(serverWObj)) return {};
  const result = {
    id: author_permlink,
    avatar: DEFAULTS.AVATAR,
    weight: weight || '',
    createdAt: created_at || Date.now(),
    updatedAt: updated_at || Date.now(),
    userCount: user_count || 0,
    followersNames: followers_names,
    type: (object_type && object_type.toLowerCase()) || 'item',
    ...getFieldsWithMaxWeight(serverWObj, usedLocale),
    ...serverWObj,
  };

  if (serverWObj.parent) {
    if (result.avatar === DEFAULTS.AVATAR) {
      const parentFieldMaxWeight = getFieldsWithMaxWeight(serverWObj.parent);
      if (parentFieldMaxWeight && parentFieldMaxWeight.avatar) {
        result.avatar = parentFieldMaxWeight.avatar;
      }
    }
  }

  return result;
};

export const getServerWObj = clientWObj => {
  const serverCalculatedFields = [
    'parent',
    'map',
    'listItems',
    'menuItems',
    'sortCustom',
    'preview_gallery',
    'album_count',
    'photos_count',
  ];
  const {
    id,
    author,
    creator,
    name,
    type,
    createdAt,
    updatedAt,
    parents,
    children,
    weight,
    app,
    avatar,
    title,
    background,
    is_posting_open,
    is_extending_open,
  } = clientWObj;
  const fields = [
    {
      name: 'name',
      body: name,
    },
  ];
  if (avatar) {
    fields.push({ name: objectFields.avatar, body: avatar });
  }
  if (title) {
    fields.push({ name: objectFields.title, body: title });
  }
  if (background) {
    fields.push({ name: objectFields.background, body: background });
  }
  const serverObject = {
    app: app || APP_NAME,
    author_permlink: id,
    author,
    creator,
    default_name: name,
    object_type: type,
    weight: weight || '',
    parents: parents && parents.length ? parents : [],
    children: children && children.length ? children : [],
    community: '',
    created_at: createdAt || Date.now(),
    updated_at: updatedAt || Date.now(),
    fields: [...clientWObj.fields, ...fields],
    is_posting_open,
    is_extending_open,
  };

  serverCalculatedFields.forEach(f => {
    if (typeof f === 'string' && clientWObj[f]) {
      serverObject[f] = clientWObj[f];
    }
  });

  return serverObject;
};

/* eslint-enable no-underscore-dangle */
/* eslint-enable camelcase */

export default null;

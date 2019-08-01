import { objectFields } from '../common/constants/listOfFields';
import { getFieldsWithMaxWeight } from './object/wObjectHelper';
import DEFAULTS from './object/const/defaultValues';

export const getClientWObj = (serverWObj, fieldsToInclude = []) => {
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

  const result = {
    id: author_permlink,
    avatar: DEFAULTS.AVATAR,
    weight: weight || '',
    createdAt: created_at || Date.now(),
    updatedAt: updated_at || Date.now(),
    userCount: user_count || 0,
    followersNames: followers_names,
    type: (object_type && object_type.toLowerCase()) || 'item',
    ...getFieldsWithMaxWeight(serverWObj),
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

  if (fieldsToInclude && fieldsToInclude.length) {
    fieldsToInclude.forEach(f => {
      if (typeof f === 'string' && serverWObj[f]) {
        result[f] = serverWObj[f];
      }
    });
  }

  return result;
};

/* eslint-enable no-underscore-dangle */
/* eslint-enable camelcase */

export const getServerWObj = clientWObj => {
  const {
    id,
    author,
    creator,
    name,
    type,
    rank,
    createdAt,
    updatedAt,
    parents,
    children,
    weight,
    app,
    avatar,
    title,
    background,
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
  return {
    author_permlink: id,
    author,
    creator,
    default_name: name,
    object_type: type,
    rank: rank || 1,
    weight: weight || '',
    parents: parents && parents.length ? parents : [],
    children: children && children.length ? children : [],
    app: app || 'waiviodev/1.0.0',
    community: '',
    createdAt: createdAt || Date.now(),
    updatedAt: updatedAt || Date.now(),
    fields: [...clientWObj.fields, ...fields],
  };
};

export default null;

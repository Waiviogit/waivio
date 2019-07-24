import _ from 'lodash';
import { objectFields } from '../common/constants/listOfFields';
import { getFieldWithMaxWeight, getFieldsWithMaxWeight } from './object/wObjectHelper';
import DEFAULTS from './object/const/defaultValues';

export const getClientWObj = (serverWObj, fieldsToInclude = [], defaultsFromParent = []) => {
  /* eslint-disable no-underscore-dangle */
  /* eslint-disable camelcase */
  const {
    parent,
    author_permlink,
    followers_names,
    weight,
    created_at,
    updated_at,
    __v,
    users,
    children,
    user_count,
    isNew,
    rank,
    object_type,
  } = serverWObj;

  const defaultValues = {
    [objectFields.avatar]: DEFAULTS.AVATAR,
  };
  if (defaultsFromParent && defaultsFromParent.length && parent && parent.fields) {
    defaultsFromParent.forEach(f => {
      const parentField = getFieldWithMaxWeight(parent, f);
      if (parentField) {
        defaultValues[f] = parentField;
      }
    });
  }

  const result = {
    id: author_permlink,
    avatar: DEFAULTS.AVATAR,
    parent: parent || '',
    weight: weight || '',
    createdAt: created_at || Date.now(),
    updatedAt: updated_at || Date.now(),
    children: children || [],
    users: users || [],
    userCount: user_count || 0,
    fields: serverWObj.fields,
    version: __v || 0,
    followersNames: followers_names,
    isNew: Boolean(isNew),
    rank: rank || 1,
    type: (object_type && object_type.toLowerCase()) || 'item',
    ...getFieldsWithMaxWeight(serverWObj),
  };

  const getParentAvatar = wObj => {
    if (wObj && wObj.parent && wObj.parent.fields) {
      const avatar = _.find(wObj.parent.fields, ['name', 'avatar']);
      return avatar.body;
    }
    return '';
  };

  if (result.avatar === DEFAULTS.AVATAR) {
    const avatar = getParentAvatar(serverWObj);
    if (avatar) {
      result.avatar = avatar;
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
    version,
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
    __v: version,
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

export default getClientWObj;

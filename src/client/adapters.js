import { objectFields } from '../common/constants/listOfFields';

export const getClientWObj = serverWObj => {
  /* eslint-disable no-underscore-dangle */
  /* eslint-disable camelcase */
  const {
    parents,
    author_permlink,
    followers_names,
    weight,
    fields,
    created_at,
    updated_at,
    __v,
    users,
    children,
    user_count,
    isNew,
  } = serverWObj;
  const avatarField = fields && fields.find(f => f.name === objectFields.avatarImage);
  const nameField = fields && fields.find(f => f.name === objectFields.name);
  const descriptionShort = fields && fields.find(f => f.name === objectFields.descriptionShort);
  return {
    id: author_permlink,
    avatar: avatarField ? avatarField.body : '/images/logo-brand.png',
    name: (nameField && nameField.body) || '',
    descriptionShort: descriptionShort || '',
    parents: parents || [],
    weight: weight || '',
    createdAt: created_at || Date.now(),
    updatedAt: updated_at || Date.now(),
    children: children || [],
    users: users || [],
    userCount: user_count || 0,
    version: __v || 0,
    followersNames: followers_names,
    isNew: Boolean(isNew),
  };
};

/* eslint-enable no-underscore-dangle */
/* eslint-enable camelcase */

export default getClientWObj;

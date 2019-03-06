import { objectFields } from '../common/constants/listOfFields';
import { getFieldWithMaxWeight } from './object/wObjectHelper';

export const getClientWObj = serverWObj => {
  /* eslint-disable no-underscore-dangle */
  /* eslint-disable camelcase */
  const {
    parents,
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

  return {
    id: author_permlink,
    avatar: getFieldWithMaxWeight(serverWObj, objectFields.avatar) || '/images/logo-brand.png',
    name: getFieldWithMaxWeight(serverWObj, objectFields.name),
    title: getFieldWithMaxWeight(serverWObj, objectFields.title),
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
    rank: rank || 0,
    type: object_type || 'item',
    background: getFieldWithMaxWeight(serverWObj, objectFields.background),
  };
};

/* eslint-enable no-underscore-dangle */
/* eslint-enable camelcase */

export default getClientWObj;

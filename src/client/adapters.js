export const getClientWObj = serverWObj => {
  /* eslint-disable no-underscore-dangle */
  const avatarField = serverWObj.fields && serverWObj.fields.find(f => f.name === 'avatarImage');
  const nameField = serverWObj.fields && serverWObj.fields.find(f => f.name === 'name');
  return {
    id:
      serverWObj._id ||
      `${serverWObj.tag}-${Math.random()
        .toString(32)
        .substring(2)}`,
    tag: serverWObj.tag,
    avatar: avatarField ? avatarField.body : '/images/logo-brand.png',
    name: (nameField && nameField.body) || '',
    version: serverWObj.__v || '',
    parents: serverWObj.parents || [],
    weight: serverWObj.weight || '',
    fields: serverWObj.fields || [],
    createdAt: serverWObj.createdAt || Date.now(),
    updatedAt: serverWObj.updatedAt || '',
    children: serverWObj.children || [],
    users: serverWObj.users || [],
    userCount: serverWObj.user_count || '',
    isNew: Boolean(serverWObj.isNew),
  };
};
/* eslint-enable no-underscore-dangle */

export const getServerWObj = clientWObj =>
  /* eslint-disable no-underscore-dangle */
  ({
    _id: clientWObj.id,
    parents: clientWObj.parents,
    tag: clientWObj.tag,
    weight: clientWObj.weight,
    fields: [...clientWObj.fields],
    createdAt: clientWObj.createdAt,
    updatedAt: clientWObj.updatedAt,
    __v: clientWObj.version,
    children: [...clientWObj.children],
    users: [...clientWObj.users],
    user_count: clientWObj.userCount,
  });
/* eslint-enable no-underscore-dangle */

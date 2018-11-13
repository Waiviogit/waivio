export const getClientWObj = serverWObj => {
  /* eslint-disable no-underscore-dangle */
  const avatarField = serverWObj.fields.find(f => f.name === 'avatarImage');
  const nameField = serverWObj.fields.find(f => f.name === 'name');
  return {
    ...serverWObj,
    id: serverWObj._id,
    avatar: avatarField ? avatarField.body : '/images/logo-brand.png',
    name: nameField ? nameField.body : 'name not found',
    version: serverWObj.__v,
  };
  /* eslint-enable no-underscore-dangle */
};

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
    user_count: clientWObj.user_count,
  });
/* eslint-enable no-underscore-dangle */

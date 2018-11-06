export const getClientWObj = serverWObj => {
  /* eslint-disable no-underscore-dangle */
  const nameFields = serverWObj.fields.filter(f => f.name === 'name').map(f => ({
    id: f._id,
    value: f.body,
    locale: f.locale,
    weight: f.weight,
  }));
  return {
    id: serverWObj._id,
    tag: serverWObj.tag,
    weight: serverWObj.weight,
    parents: serverWObj.parents,
    createdAt: serverWObj.createdAt,
    updatedAt: serverWObj.updatedAt,
    version: serverWObj.__v,
    names: nameFields,
    name: nameFields.reduce((acc, curr) => (acc.weight > curr.weight ? acc : curr)),
  };
  /* eslint-enable no-underscore-dangle */
};

export const getSomething = 'anotherOne';

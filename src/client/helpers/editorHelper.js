import { last, find, has, uniqWith, isEqual } from 'lodash';

import { Entity } from '../components/EditorExtended';

export const getNewLinkedObjectsCards = (prohibitObjects, objectIds, rowContent) => {
  const lastContentAdd = last(rowContent);

  if (
    lastContentAdd &&
    (lastContentAdd.type === Entity.OBJECT || lastContentAdd.type === Entity.LINK)
  ) {
    const addedObjectId = last(objectIds);

    if (find(prohibitObjects, object => object.author_permlink === addedObjectId)) {
      return prohibitObjects.filter(object => object.author_permlink !== addedObjectId);
    }

    return prohibitObjects;
  }

  return prohibitObjects;
};

export const getLinkedObjects = contentStateRaw => {
  const objEntities = Object.values(contentStateRaw.entityMap).filter(
    entity =>
      (entity.type === Entity.OBJECT && has(entity, 'data.object.type')) ||
      has(entity, 'data.object.object_type'),
  );

  return uniqWith(
    objEntities.map(entity => entity.data.object),
    isEqual,
  );
};

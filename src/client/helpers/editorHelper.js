import uuidv4 from 'uuid/v4';
import {
  differenceWith,
  find,
  get,
  has,
  head,
  isEqual,
  keyBy,
  last,
  uniqWith,
  reduce,
  size,
  differenceBy,
  isEmpty,
} from 'lodash';
import { convertToRaw, genKey } from 'draft-js';

import { Block, createEditorState, Entity } from '../components/EditorExtended';

const mockPhoto = '📷';

export const getNewLinkedObjectsCards = (
  prohibitObjects,
  objectIds,
  rowContent,
  prevRowContent = [],
) => {
  const lastContentAdd = head(differenceWith(rowContent, prevRowContent, isEqual));

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

export const getReviewTitle = (campaignData, linkedObjects, body, altTitle) => {
  const firstTitle = get(campaignData, 'requiredObject.name', '');
  const secondTitle = get(campaignData, 'secondaryObject.name', '');
  const requiredObj = get(linkedObjects, '[0]', {});
  const secondObj = get(linkedObjects, '[1]', {});
  const reviewTitle = `Review: ${firstTitle}, ${secondTitle}`;

  const topics = [];

  if (requiredObj.object_type === 'hashtag' || secondObj.object_type === 'hashtag') {
    topics.push(requiredObj.author_permlink || secondObj.author_permlink);
  }

  return {
    draftContent: {
      body,
      title: altTitle || reviewTitle,
    },
    topics,
  };
};

export const getCurrentDraftId = (draftId, draftIdEditor) =>
  !draftIdEditor && !draftId ? uuidv4() : draftId || draftIdEditor;

export const getCurrentDraftContent = (nextState, rawContent, currentRawContent) => {
  const prevValue = Object.values(get(currentRawContent, 'entityMap', {}));
  const nextValue = Object.values(get(rawContent, 'entityMap', {}));

  if (!isEqual(prevValue, nextValue)) {
    return {
      draftContent: {
        body: nextState.content,
        title: nextState.titleValue,
      },
      currentRawContent: rawContent,
    };
  }

  return {};
};

export const getCurrentLinkPermlink = value => {
  const data = get(value, 'data.url', '');
  const currentSeparator = data.split('/');

  return get(currentSeparator, '[4]', []);
};

export const getCurrentLoadObjects = (response, value) => {
  const loadObjects = keyBy(response.wobjects, 'author_permlink');

  if (value.type === Entity.OBJECT) {
    return loadObjects[get(value, 'data.object.id')];
  } else if (value.type === Entity.LINK) {
    return loadObjects[getCurrentLinkPermlink(value)];
  }

  return loadObjects;
};

export const filterEditorObjects = objects =>
  objects.filter(object => object.type === Entity.OBJECT);

export const getObjPercentsHideObject = (linkedObjects, hideObject, objPercentage) => {
  const actualObjPercentage = reduce(
    objPercentage,
    (result, value, key) => {
      const updatedObjPercentage = { ...result };

      if (value.percent) {
        updatedObjPercentage[key] = value;
      }

      return updatedObjPercentage;
    },
    {},
  );

  actualObjPercentage[hideObject._id] = { percent: 0 };

  return reduce(
    actualObjPercentage,
    (result, value, key) => {
      const updateObjPercentage = { ...result };

      updateObjPercentage[key] = { percent: 100 / size(actualObjPercentage) };

      return updateObjPercentage;
    },
    {},
  );
};

export const getFilteredLinkedObjects = (linkedObjects, hiddenObjects) => {
  if (isEmpty(hiddenObjects)) {
    return linkedObjects;
  }

  return linkedObjects.filter(object => hiddenObjects.every(item => !isEqual(item, object)));
};

export const updatedHideObjectsPaste = (hideLinkedObjects, pastedObjects) => {
  const updatedHideLinkedObjects = hideLinkedObjects.filter(hideObject =>
    pastedObjects.some(object => object._id === hideObject._id),
  );

  return differenceBy(hideLinkedObjects, updatedHideLinkedObjects, '_id');
};

const getPartsOfSentence = string => {
  const parts = string
    .trim()
    .split(mockPhoto)
    .reduce((acc, part) => [...acc, part, mockPhoto], []);

  parts.pop();

  return parts;
};

export const parseImagesFromBlocks = editorState => {
  const { blocks, entityMap } = convertToRaw(editorState.getCurrentContent());

  const entities = Object.values(entityMap);
  const images = entities.filter(entity => entity.type === Entity.IMAGE);
  const newBlocks = {
    blocks: [],
    entityMap,
  };

  blocks.forEach((item, index) => {
    if (item.text.includes(mockPhoto)) {
      const correctText = item.text.trim().replace(/\r?\n/g, '');

      if (correctText.length === 1 || correctText === mockPhoto) {
        const block = {
          ...item,
          type: Block.IMAGE,
          data: get(images, '[0].data', false) || get(item, 'data', {}),
        };

        images.shift();
        newBlocks.blocks = [...newBlocks.blocks, block];
      } else {
        const parts = getPartsOfSentence(item.text);

        parts.forEach(part => {
          const newBlockKey = genKey();

          if (part.trim().replace(/\r?\n/g, '') === mockPhoto) {
            const newBlock = {
              key: newBlockKey,
              type: Block.IMAGE,
              text: mockPhoto,
              depth: 0,
              data: get(images, '[0].data', {}),
            };

            images.shift();
            newBlocks.blocks = [...newBlocks.blocks, newBlock];
          } else {
            const newBlock = {
              key: newBlockKey,
              type: Block.TODO,
              text: part,
              depth: 0,
              data: {},
            };

            newBlocks.blocks = [...newBlocks.blocks, newBlock];
          }
        });
      }
    } else {
      newBlocks.blocks = [...newBlocks.blocks, item];
    }
  });

  return createEditorState(newBlocks);
};

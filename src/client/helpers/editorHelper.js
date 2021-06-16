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
  without,
} from 'lodash';
import { convertToRaw, EditorState, genKey, SelectionState } from 'draft-js';

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

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

export const parseImagesFromBlocks = (editorState, isFocus) => {
  const selectionState = editorState.getSelection();
  const anchorKey = selectionState.getAnchorKey();
  const currentContent = editorState.getCurrentContent();
  const currentContentBlock = currentContent.getBlockForKey(anchorKey);
  const start = selectionState.getStartOffset();
  const end = selectionState.getEndOffset();

  const blocksEditor = convertToRaw(editorState.getCurrentContent());

  const entityMapArray = Object.values(blocksEditor.entityMap);
  const newBlocks = {
    blocks: [],
    entityMap: blocksEditor.entityMap,
  };

  blocksEditor.blocks.forEach(block => {
    if (!block.entityRanges.length) {
      newBlocks.blocks = [...newBlocks.blocks, block];
    } else {
      let blockText = block.text;
      let blocksUpdated = [];
      const blockEntities = [];

      block.entityRanges.forEach(entityRange => {
        const blockEntity = block.text.substring(
          entityRange.offset,
          entityRange.offset + entityRange.length,
        );

        blockEntities.push(blockEntity.trim().replace(/\r?\n/g, ''));
        const firstText = blockText
          .substring(0, entityRange.offset)
          .trim()
          .replace(/\r?\n/g, '');
        const secondText = blockText
          .substring(entityRange.offset, entityRange.offset + entityRange.length)
          .trim()
          .replace(/\r?\n/g, '');

        blockText = blockText.substring(entityRange.offset + entityRange.length, blockText.length);
        blocksUpdated = [...blocksUpdated, firstText, secondText];
      });
      const newBlocksParsed = without(blocksUpdated, '').map(blockUpdated => {
        const isCustomBlock = blockEntities.some(
          entityBlock =>
            entityBlock.trim().replace(/\r?\n/g, '') === blockUpdated.trim().replace(/\r?\n/g, ''),
        );

        if (isCustomBlock) {
          const returnBlock = {
            text: blockUpdated,
            entity: entityMapArray[0],
          };

          entityMapArray.shift();

          return returnBlock;
        }

        return blockUpdated;
      });

      const blockObjects = newBlocksParsed.map(blockParsed => {
        if (has(blockParsed, 'text')) {
          switch (blockParsed.entity.type) {
            case Entity.LINK:
              return {
                key: genKey(),
                type: Block.UNSTYLED,
                text: blockParsed.text,
                depth: 0,
                data: {},
                entityRanges: [
                  {
                    offset: 0,
                    length: blockParsed.text.length,
                    key: getKeyByValue(blocksEditor.entityMap, blockParsed.entity),
                  },
                ],
              };
            case Entity.IMAGE:
              return {
                key: genKey(),
                type: Block.IMAGE,
                text: '',
                depth: 0,
                data: blockParsed.entity.data,
              };
            default:
              return {
                key: genKey(),
                type: Block.TODO,
                text: blockParsed.text,
                depth: 0,
                data: {},
              };
          }
        } else {
          return {
            key: genKey(),
            type: Block.TODO,
            text: blockParsed,
            depth: 0,
            data: {},
          };
        }
      });

      newBlocks.blocks = [...newBlocks.blocks, ...blockObjects];
    }
  });
  const correctBlocks =
    size(newBlocks.blocks) === size(blocksEditor.blocks) ? blocksEditor : newBlocks;
  let newEditorState = createEditorState(correctBlocks);
  const isExistBlock = correctBlocks.blocks.find(item => item.key === anchorKey);

  if (isExistBlock && isFocus) {
    const updateSelection = new SelectionState({
      anchorKey,
      anchorOffset: start,
      focusKey: anchorKey,
      focusOffset: start,
      isBackward: false,
    });

    newEditorState = EditorState.acceptSelection(newEditorState, updateSelection);
    newEditorState = EditorState.forceSelection(newEditorState, updateSelection);

    return newEditorState;
  }

  return createEditorState(correctBlocks);
};

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
  isString,
} from 'lodash';
import { convertToRaw, EditorState, genKey, Modifier, SelectionState } from 'draft-js';

import { Block, createEditorState, Entity } from '../components/EditorExtended';
import { CURSOR_ACTIONS } from "../components/EditorExtended/util/constants";

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

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

export const parseImagesFromBlocks = editorState => {
  const selectionState = editorState.getSelection();
  const anchorKey = selectionState.getAnchorKey();
  const start = selectionState.getStartOffset();

  const blocksEditor = convertToRaw(editorState.getCurrentContent());

  const newBlocks = {
    blocks: [],
    entityMap: blocksEditor.entityMap,
  };

  const needParse = [];

  blocksEditor.blocks.forEach(block => {
    const isSameTypeRanges = block.entityRanges
      .map(entity => blocksEditor.entityMap[entity.key].type)
      .every((element, index, array) => array[0] === element);

    if (!isSameTypeRanges) {
      needParse.push(block);
    } else {
      const key = get(block.entityRanges, '[0].key', false);

      if (
        (key || key === 0) &&
        blocksEditor.entityMap[key].type === Entity.IMAGE &&
        block.type !== Block.IMAGE
      ) {
        needParse.push(block);
      }
    }
  });
  if (!size(needParse)) {
    return editorState;
  }
  blocksEditor.blocks.forEach(block => {
    if (!needParse.find(needParseBlock => needParseBlock.key === block.key)) {
      newBlocks.blocks = [...newBlocks.blocks, { ...block, text: block.text.trim() }];
    } else {
      let blocksUpdated = [];
      const blockEntities = [];
      let prevOffset = 0;

      block.entityRanges.forEach((entityRange, index) => {
        const mockPhotoLength = block.text.trim() === mockPhoto ? 1 : 0;

        prevOffset = entityRange.offset + entityRange.length + mockPhotoLength;
        const blockEntity = block.text.substring(entityRange.offset, prevOffset);

        blockEntities.push(blockEntity.trim().replace(/\r?\n/g, ''));
        const firstText = block.text
          .substring(prevOffset, entityRange.offset)
          .trim()
          .replace(/\r?\n/g, '');
        const secondText = block.text
          .substring(entityRange.offset, prevOffset)
          .trim()
          .replace(/\r?\n/g, '');

        blocksUpdated = [
          ...blocksUpdated,
          firstText,
          { text: secondText, entityKey: entityRange.key },
        ];
        if (index === block.entityRanges.length - 1 && prevOffset < block.text.length) {
          blocksUpdated = [
            ...blocksUpdated,
            block.text
              .substring(prevOffset, block.text.length)
              .trim()
              .replace(/\r?\n/g, ''),
          ];
        }
      });
      const newBlocksParsed = without(blocksUpdated, '').map(blockUpdated => {
        const text = isString(blockUpdated.text) ? blockUpdated.text : blockUpdated;
        const isCustomBlock = blockEntities.some(
          entityBlock =>
            entityBlock.trim().replace(/\r?\n/g, '') === text.trim().replace(/\r?\n/g, ''),
        );

        const isExistEntityMap = blocksEditor.entityMap[blockUpdated.entityKey];

        if (isCustomBlock && isExistEntityMap) {
          return {
            text: text.replace(mockPhoto, ''),
            entity: isExistEntityMap,
          };
        }

        return blockUpdated.replace(mockPhoto, '');
      });

      const blockObjects = newBlocksParsed.map(blockParsed => {
        const text = blockParsed.text ? blockParsed.text : blockParsed;

        if (has(blockParsed, 'text')) {
          switch (get(blockParsed, 'entity.type', false)) {
            case Entity.LINK:
              return {
                key: genKey(),
                type: Block.UNSTYLED,
                text: text.trim().replace(/\r?\n/g, ''),
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
                text: text.trim().replace(/\r?\n/g, ''),
                depth: 0,
                data: {},
              };
          }
        } else {
          return {
            key: genKey(),
            type: Block.TODO,
            text,
            depth: 0,
            data: {},
          };
        }
      });

      newBlocks.blocks = [...newBlocks.blocks, ...blockObjects];
    }
  });
  let newEditorState = createEditorState(newBlocks);
  const isExistBlock = newBlocks.blocks.find(item => item.key === anchorKey);

  if (isExistBlock && size(needParse)) {
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

  return EditorState.moveFocusToEnd(newEditorState);
};

export const addTextToCursor = (editorState, text) => {
  const content = Modifier.insertText(
    editorState.getCurrentContent(),
    editorState.getSelection(),
    text,
    null,
  );

  return EditorState.push(editorState, content, 'insert-characters');
};

export const getIsNodeInPath = (className, event) => {
  const path = [];
  let node = event.target;

  while(node !== document.body) {
    path.push(node.className);
    node = node.parentNode;
  }

  return path.includes(className);
};

export const setCursorPosition = (es, actionType, oldSelectionState, value) => {
  switch (actionType) {
    case CURSOR_ACTIONS.BACKSPACE:
      return EditorState.forceSelection(es, oldSelectionState);
    case CURSOR_ACTIONS.NO_RESULT: {
      const newSelection = new SelectionState({
        anchorKey: oldSelectionState.getAnchorKey(),
        focusKey: oldSelectionState.getFocusKey(),
        anchorOffset: oldSelectionState.getAnchorOffset() + value.length,
        focusOffset: oldSelectionState.getFocusOffset() + value.length,
      });

      return EditorState.forceSelection(es, newSelection);
    }
    default:
      return es;
  }
};

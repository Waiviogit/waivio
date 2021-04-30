import uuidv4 from 'uuid/v4';
import { differenceWith, find, get, has, head, isEqual, keyBy, last, uniqWith } from 'lodash';
import { Entity } from '../components/EditorExtended';

export const EDITOR_ACTION_ADD = 'add';
export const EDITOR_ACTION_REMOVE = 'remove';

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

export const getReviewTitle = (campaignData, linkedObjects) => {
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
      title: reviewTitle,
      body: this.state.draftContent.body,
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

const getDifferOfContents = (iteratedRowContent, rowContent) => {
  let rowContentForUpdate = [...rowContent];

  return iteratedRowContent.filter((object) => {

    return rowContentForUpdate.every((item) => {
      const returnValue = get(item, 'data.object.author_permlink', '') !== get(object, 'data.object.author_permlink', false);

      if (returnValue) {
        rowContentForUpdate = rowContentForUpdate.filter(rowContentItem => !isEqual(rowContentItem, item));

        return returnValue;
      }

      return returnValue;
    })
  })
}

export const getLastContentAction = (updatedRowContent, prevRowContent) => {
  console.log('update and curr', updatedRowContent, prevRowContent);
  if (prevRowContent.length > updatedRowContent.length) {
    return {
      actionType: EDITOR_ACTION_REMOVE,
      actionValue: head(getDifferOfContents(prevRowContent, updatedRowContent)),
    };
  } else if(prevRowContent.length < updatedRowContent.length) {
    return {
      actionType: EDITOR_ACTION_ADD,
      actionValue: head(getDifferOfContents(updatedRowContent, prevRowContent)),
    };
  }

  return {
    actionType: '',
    actionValue: {},
  };
};

export const filterEditorObjects = objects =>
  objects.filter(object => object.type === Entity.OBJECT);

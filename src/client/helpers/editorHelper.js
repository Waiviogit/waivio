import uuidv4 from "uuid/v4";
import { last, find, has, uniqWith, isEqual, differenceWith, head, get, keyBy, filter } from 'lodash';

import { CompositeDecorator } from "draft-js";
import { Entity, findLinkEntities } from '../components/EditorExtended';
import ObjectLink, { findObjEntities } from "../components/EditorExtended/components/entities/objectlink";
import Link from "../components/EditorExtended/components/entities/link";
import ImageSideButton from "../components/EditorExtended/components/sides/ImageSideButton";
import VideoSideButton from "../components/EditorExtended/components/sides/VideoSideButton";
import ObjectSideButton from "../components/EditorExtended/components/sides/ObjectSideButton";
import SeparatorButton from "../components/EditorExtended/components/sides/SeparatorSideButton";

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
  const requiredObj = get(linkedObjects, '[0]', '');
  const secondObj = get(linkedObjects, '[1]', '');
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

export const getCurrentDraftId = (draftId, draftIdEditor) => (!draftIdEditor && !draftId) ? uuidv4() : (draftId || draftIdEditor);

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
    }
  }

  return {};
}

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

export const defaultDecorators = new CompositeDecorator([
  {
    strategy: findObjEntities,
    component: ObjectLink,
  },
  {
    strategy: findLinkEntities,
    component: Link,
  },
]);

export const SIDE_BUTTONS = [
  {
    title: 'Image',
    component: ImageSideButton,
  },
  {
    title: 'Video',
    component: VideoSideButton,
  },
  {
    title: 'Object',
    component: ObjectSideButton,
  },
  {
    title: 'Separator',
    component: SeparatorButton,
  },
];

const getDifferOfContents = (iteratedRowContent, rowContent) => {
  const newElement = filter(iteratedRowContent, object => {
      const someArray = rowContent.some(rowContentItem => !isEqual(rowContentItem, object));

      console.log('someArray', someArray);

      return someArray;
    }
  );

  console.log('newElement', newElement);

  return newElement
};

export const getLastContentAction = (updatedRowContent, prevRowContent) => {
  if (prevRowContent.length > updatedRowContent.length) {
    console.log('if', prevRowContent, updatedRowContent);

    return {
      actionType: EDITOR_ACTION_REMOVE,
      actionValue: getDifferOfContents(prevRowContent, updatedRowContent)
    };
  }
  console.log('else', updatedRowContent, prevRowContent);

  return {
    actionType: EDITOR_ACTION_ADD,
    actionValue: getDifferOfContents(updatedRowContent, prevRowContent),
  };
};

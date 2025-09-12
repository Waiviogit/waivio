import uuidv4 from 'uuid/v4';
import { differenceWith, find, get, has, head, isEqual, keyBy, last, uniqWith } from 'lodash';
import { EditorState, Modifier, SelectionState } from 'draft-js';
import { Editor, Range } from 'slate';

import { Entity } from '../../client/components/EditorExtended';
import { list_types } from '../../client/components/EditorExtended/util/SlateEditor/utils/SlateUtilityFunctions';
import { isAndroidDevice } from './apiHelpers';
import { getObjectName } from './wObjectHelper';

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

export const getReviewTitleNew = (campaignData, linkedObjects, body, altTitle) => {
  const firstTitle = getObjectName(campaignData.requiredObject);
  const secondTitle = getObjectName(campaignData.secondaryObject);
  const requiredObj = get(linkedObjects, '[0]', {});
  const secondObj = get(linkedObjects, '[1]', {});
  const reviewTitle =
    firstTitle === secondTitle ? `Review: ${firstTitle}` : `Review: ${firstTitle}, ${secondTitle}`;
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

const findHashtag = (editor, start, word, showSearch) => {
  const wordBefore = Editor.before(editor, start, { unit: 'word' });
  const wordBeforeWithCharacter = Editor.before(editor, wordBefore, { unit: 'character' });
  const range = wordBefore && Editor.range(editor, wordBeforeWithCharacter, start);
  const searchString = range && Editor.string(editor, range);

  if (!searchString) return false;

  if (searchString && searchString[0] === '#') {
    return {
      searchString: showSearch ? searchString : searchString.split(' ')[0],
      range,
    };
  } else if (searchString && /^s{2}/.test(searchString)) {
    return false;
  }

  return findHashtag(editor, range, searchString + word, showSearch);
};

const findHashtagInChildren = (children, startOffset) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const child of children) {
    if (child.text && child.text?.lastIndexOf('#', startOffset) !== -1) {
      return child;
    }
    if (child.children) {
      const result = findHashtagInChildren(child.children, startOffset);

      if (result) return result;
    }
  }

  return null;
};

export const checkCursorInSearchSlate = (editor, showSearch, onlyRange, lastSelection) => {
  const rawSelection = editor.selection || lastSelection;

  if (!rawSelection || !Range.isRange(rawSelection)) {
    return { isNeedOpenSearch: false };
  }

  const sel = isAndroidDevice() ? lastSelection || rawSelection : rawSelection;

  try {
    const [start] = Range.edges(sel);
    const currBlock = editor.children[start.path[0]];

    let currItem = null;

    if (list_types?.includes(currBlock?.type) || currBlock?.type === 'table') {
      currItem = findHashtagInChildren(currBlock.children, start.offset);
    } else {
      currItem = currBlock?.children?.find(
        child => child.text && child.text?.lastIndexOf('#', start.offset) !== -1,
      );
    }

    const blockText = currItem?.text;

    if (!blockText) {
      return { isNeedOpenSearch: false };
    }

    const startPositionOfWord = blockText?.lastIndexOf('#', start.offset);
    const { searchString, range } = findHashtag(editor, start, '', showSearch) ?? {};

    if (searchString && onlyRange) {
      const beforeRange = range && Editor.range(editor, range.anchor, start);

      return {
        beforeRange,
      };
    }

    if (
      searchString &&
      blockText?.includes(searchString) &&
      startPositionOfWord + searchString.length === start.offset
    ) {
      const wordStartPoint = Editor.before(editor, start, { unit: 'word' });
      const characterStart = Editor.before(editor, wordStartPoint, { unit: 'character' });

      return {
        searchString: searchString.slice(1),
        selection: {
          anchor: characterStart,
          focus: {
            ...characterStart,
            offset: characterStart.offset + searchString.length,
          },
        },
        startPositionOfWord,
        isNeedOpenSearch: true,
        afterRange: range,
      };
    }

    return { isNeedOpenSearch: false };
  } catch (e) {
    return { isNeedOpenSearch: false };
  }
};

export const replaceTextOnChange = (editorState, text, selectionState) => {
  const anchorKey = selectionState.getAnchorKey();
  const currentContent = editorState.getCurrentContent();
  const currentContentBlock = currentContent.getBlockForKey(anchorKey);
  const start = selectionState.getStartOffset();
  const blockText = currentContentBlock.getText();

  const startPositionOfWord = blockText?.lastIndexOf('#', start);
  let endPositionOfWord = blockText?.indexOf(' ', start);

  if (endPositionOfWord === -1) endPositionOfWord = blockText.length;

  const contentWithoutDash = Modifier.replaceText(
    editorState.getCurrentContent(),
    new SelectionState({
      anchorKey,
      anchorOffset: startPositionOfWord + 1,
      focusKey: anchorKey,
      focusOffset: endPositionOfWord,
    }),
    text,
  );

  return EditorState.push(editorState, contentWithoutDash, 'replace-text');
};

/** Swap white-spaces with &nbsp; for editor */
export const addSpaces = string => {
  let isCodeBlock = false;

  return string.split('\n').reduce((acc, current) => {
    const isCodeRegex = /^```/g;

    isCodeBlock = isCodeRegex.test(current) ? !isCodeBlock : isCodeBlock;
    const _current = isCodeBlock
      ? `\n${current.replace(/&nbsp;/g, '')}`
      : current.replace(/^([\s])*/g, m => `\n${'&nbsp;'.repeat(m.length)}`);

    return acc + _current;
  }, '');
};
/** Add empty lines */

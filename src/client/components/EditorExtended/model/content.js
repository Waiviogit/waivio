import { EditorState, convertFromRaw, CompositeDecorator, ContentState } from 'draft-js';

import Link, { findLinkEntities } from '../components/entities/link';
import ObjectLink, { findObjEntities } from '../components/entities/objectlink';

const defaultDecorators = new CompositeDecorator([
  {
    strategy: findObjEntities,
    component: ObjectLink,
  },
  {
    strategy: findLinkEntities,
    component: Link,
  },
]);

const createEditorState = (content = null, decorators = defaultDecorators) => {
  let initialEditorState = {};
  if (content === null) {
    initialEditorState = EditorState.createEmpty(decorators);
  }
  let contentState = null;
  if (typeof content === 'string') {
    contentState = ContentState.createFromText(content);
  } else {
    contentState = convertFromRaw(content);
  }
  initialEditorState = EditorState.createWithContent(contentState, decorators);
  // return EditorState.moveSelectionToEnd(initialEditorState);
  return initialEditorState;
};

export default createEditorState;

export const getSelectionRange = () => {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return null;
  return selection.getRangeAt(0);
};

export const getSelectionCoords = selectionRange => {
  const editorBounds = document.getElementById('editor-container').getBoundingClientRect();
  const rangeBounds = selectionRange.getBoundingClientRect();
  const rangeWidth = rangeBounds.right - rangeBounds.left;
  const offsetLeft =
    rangeBounds.left -
    editorBounds.left +
    rangeWidth / 2 -
    /* 107px is width of inline toolbar */
    142 / 2;
  // 42px is height of inline toolbar (35px) + 5px center triangle and 2px for spacing
  const offsetTop = rangeBounds.top - editorBounds.top - 42;

  return { offsetLeft, offsetTop };
};

export const encodeImageFileAsURL = (file, callback) => {
  const formData = new FormData();
  formData.append('file', file);

  return fetch(`https://www.waivio.com/api/image`, {
    method: 'POST',
    body: formData,
  })
    .then(res => res.json())
    .then(res => {
      callback(res.image, file.name);
    })
    .catch(err => {
      console.log(err);
    });
};

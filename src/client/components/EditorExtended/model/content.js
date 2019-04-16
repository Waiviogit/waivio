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
  if (content === null) {
    return EditorState.createEmpty(decorators);
  }
  let contentState = null;
  if (typeof content === 'string') {
    contentState = ContentState.createFromText(content);
  } else {
    contentState = convertFromRaw(content);
  }
  return EditorState.createWithContent(contentState, decorators);
};

export default createEditorState;

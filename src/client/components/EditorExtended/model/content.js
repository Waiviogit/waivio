import { CompositeDecorator, ContentState, convertFromRaw, EditorState } from 'draft-js';
import ObjectLink, { findObjEntities } from '../components/entities/objectlink';
import Link, { findLinkEntities } from '../components/entities/link';
import ImageSideButton from '../components/sides/ImageSideButton';
import VideoSideButton from '../components/sides/VideoSideButton';
import ObjectSideButton from '../components/sides/ObjectSideButton';
import SeparatorButton from '../components/sides/SeparatorSideButton';

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

  return initialEditorState;
};

export default createEditorState;

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
      console.error(err);
    });
};

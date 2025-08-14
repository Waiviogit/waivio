import { CompositeDecorator, ContentState, convertFromRaw, EditorState } from 'draft-js';
import ImageSideButton from '../components/sides/ImageSideButton';
import VideoSideButton from '../components/sides/VideoSideButton';
import ObjectSideButton from '../components/sides/ObjectSideButton';
import SeparatorButton from '../components/sides/SeparatorSideButton';
import CodeSideButton from '../components/sides/CodeSideButton';
import ImageButtonSlate from '../components/sides/ImageButtonSlate';
import VideoButtonSlate from '../components/sides/VideoButtonSlate';
import TableSideButton from '../components/sides/TableSideButton';
import EmojiSideButton from '../components/sides/EmojiButton';
import NearbyButton from '../components/sides/NearbyButton';

export const defaultDecorators = new CompositeDecorator([]);

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
  {
    title: 'Code',
    component: CodeSideButton,
  },
];

export const SIDE_BUTTONS_SLATE = [
  {
    title: 'Image',
    component: ImageButtonSlate,
  },
  {
    title: 'Video',
    component: VideoButtonSlate,
  },
  {
    title: 'Object',
    component: ObjectSideButton,
  },
  {
    title: 'Separator',
    component: SeparatorButton,
  },
  {
    title: 'Code',
    component: CodeSideButton,
  },
  {
    title: 'Table',
    component: TableSideButton,
  },
  {
    title: 'Emoji',
    component: EmojiSideButton,
  },
  {
    title: 'Nearby',
    component: NearbyButton,
  },
];
export const SIDE_BUTTONS_AI_CHAT = [
  {
    title: 'Image',
    component: ImageButtonSlate,
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

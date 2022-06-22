import { Transforms } from 'slate';

import createParagraph from './paragraph';

export const createImageNode = (alt, { url, width = 200, height = 200 }) => ({
  type: 'image',
  alt,
  url,
  width,
  height,
  children: [{ text: '' }],
});
export const createVideoNode = ({ url, width = 200, height = 200 }) => ({
  type: 'video',
  url,
  width,
  height,
  children: [{ text: '' }],
});

export const createObjectNode = (url, text) => ({
  type: 'object',
  url,
  hashtag: text,
  children: [{ text: '' }],
});

export const createEmptyNode = () => ({
  type: 'paragraph',
  children: [{ text: '' }],
});

export const createLine = () => ({
  type: 'thematicBreak',
  children: [{ text: '' }],
});

export const createCodeBlock = () => ({
  type: 'code',
  children: [{ text: '' }],
  lang: 'javascript',
});

export const insertEmbed = (editor, embedData, format) => {
  const { url, width, height } = embedData;

  if (!url) return;

  /* eslint-disable no-param-reassign */
  embedData.width = width ? `${width}px` : '100%';
  embedData.height = height ? `${height}px` : 'auto';

  const embed =
    format === 'image' ? createImageNode('EditorImage', embedData) : createVideoNode(embedData);

  Transforms.insertNodes(editor, embed, { select: true });
  Transforms.insertNodes(editor, createParagraph(''), { mode: 'highest' });
};

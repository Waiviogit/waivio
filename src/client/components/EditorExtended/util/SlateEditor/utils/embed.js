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
  children: [{ text: ' ' }],
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

export const insertImageReplaceParagraph = (editor, imageNode) => [
  createEmptyNode(),
  imageNode,
  createEmptyNode(),
];

export const insertImageForImageSetter = (editor, imageNode) => [
  createEmptyNode(),
  imageNode,
  createEmptyNode(),
];

export const createImageInParagraph = imageNode => ({
  type: 'paragraph',
  children: [imageNode],
});

import { wrapWithParagraph } from './paragraph';

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

// Функція для вставки картинки без створення параграфу попереду
export const insertImageWithoutParagraph = (editor, imageNode) =>
  // Вставляємо тільки картинку без додаткових параграфів
  [imageNode];

// Функція для вставки картинки з параграфом попереду (оригінальна поведінка)
export const insertImageWithParagraph = (editor, imageNode) =>
  // Вставляємо картинку з параграфом попереду
  [wrapWithParagraph([imageNode]), createEmptyNode()];

import { jsx } from 'slate-hyperscript';
import { Element } from 'slate';

export const Block = {
  UNSTYLED: 'unstyled',
  PARAGRAPH: 'unstyled',
  OL: 'ordered-list-item',
  UL: 'unordered-list-item',
  H1: 'header-one',
  H2: 'header-two',
  H3: 'header-three',
  H4: 'header-four',
  H5: 'header-five',
  H6: 'header-six',
  CODE: 'code-block',
  BLOCKQUOTE: 'blockquote',
  PULLQUOTE: 'pullquote',
  ATOMIC: 'atomic',
  BLOCKQUOTE_CAPTION: 'block-quote-caption',
  CAPTION: 'caption',
  TODO: 'todo',
  IMAGE: 'atomic:image',
  BREAK: 'atomic:break',
  STORY_TITLE: 'story-title',
};

export const Inline = {
  BOLD: 'BOLD',
  CODE: 'CODE',
  ITALIC: 'ITALIC',
  STRIKETHROUGH: 'STRIKETHROUGH',
  UNDERLINE: 'UNDERLINE',
  HIGHLIGHT: 'HIGHLIGHT',
};

export const Entity = {
  LINK: 'LINK',
  OBJECT: 'OBJECT',
  IMAGE: 'IMAGE',
};

export const HYPERLINK = 'hyperlink';
export const HANDLED = 'handled';
export const NOT_HANDLED = 'not_handled';

export const KEY_COMMANDS = {
  addNewBlock: () => 'add-new-block',
  changeType: (type = '') => `changetype:${type}`,
  showLinkInput: () => 'showlinkinput',
  showSearchBlock: 'showSearchBlock',
  space: 'space',
  unlink: () => 'unlink',
  toggleInline: (type = '') => `toggleinline:${type}`,
  deleteBlock: () => 'delete-block',
  backspace: 'backspace',
  enter: 'split-block',
  delete: () => 'delete',
};

export const ATOMIC_TYPES = {
  SEPARATOR: 'separator',
  IMAGE: 'image',
  VIDEO: 'video',
  CODE: 'code-block',
};

export default {
  Block,
  Inline,
  Entity,
};

export const ELEMENT_TAGS = {
  A: el => ({ type: 'link', url: el.getAttribute('href') }),
  BLOCKQUOTE: () => ({ type: 'blockquote' }),
  H1: () => ({ type: 'headingOne' }),
  H2: () => ({ type: 'headingTwo' }),
  H3: () => ({ type: 'headingThree' }),
  H4: () => ({ type: 'headingFour' }),
  H5: () => ({ type: 'headingFive' }),
  H6: () => ({ type: 'headingSix' }),
  IMG: el => ({ type: 'image', url: el.getAttribute('src'), alt: el.getAttribute('alt') }),
  LI: () => ({ type: 'listItem' }),
  OL: () => ({ type: 'numberedList' }),
  P: () => ({ type: 'paragraph' }),
  PRE: () => ({ type: 'code' }),
  UL: () => ({ type: 'bulletedList' }),
  IFRAME: el => ({ type: 'video', url: el.getAttribute('src'), children: [] }),
  HR: () => ({ type: 'thematicBreak', children: [{ text: '' }] }),
};

export const TEXT_TAGS = {
  CODE: () => ({ code: true }),
  DEL: () => ({ strikethrough: true }),
  EM: () => ({ italic: true }),
  I: () => ({ italic: true }),
  S: () => ({ strikethrough: true }),
  STRONG: () => ({ bold: true }),
  U: () => ({ underline: true }),
};

export const deserializeHtmlToSlate = el => {
  if (el.nodeType === 3) {
    return el.textContent;
  } else if (el.nodeType !== 1) {
    return null;
  } else if (el.nodeName === 'BR') {
    return '\n';
  }

  const { nodeName } = el;
  let parent = el;

  if (nodeName === 'PRE' && el.childNodes[0] && el.childNodes[0].nodeName === 'CODE') {
    parent = el.childNodes[0];
  }
  let children = Array.from(parent.childNodes)
    .map(deserializeHtmlToSlate)
    .flat();

  if (children.length === 0) {
    children = [{ text: '' }];
  }

  if (el.nodeName === 'BODY') {
    return jsx('fragment', {}, children);
  }

  if (ELEMENT_TAGS[nodeName]) {
    const attrs = ELEMENT_TAGS[nodeName](el);

    return jsx('element', attrs, children);
  }

  if (TEXT_TAGS[nodeName]) {
    const attrs = TEXT_TAGS[nodeName](el);

    return children.map(child => {
      if (Element.isElement(child)) {
        return jsx('element', child);
      }

      return jsx('text', attrs, child);
    });
  }

  return children;
};

// eslint-disable-next-line import/prefer-default-export
export const REMOVE_FORMAT = 'remove';
export const INLINE_CODE = 'inlineCode';
export const CODE_BLOCK = 'code';
export const TABLE_BLOCK = 'table';
export const PARAGRAPH_BLOCK = 'paragraph';
export const ORDERED_LIST = 'orderedList';
export const UNORDERED_LIST = 'unorderedList';
export const HEADING_ONE = 'headingOne';
export const HEADING_TWO = 'headingTwo';
export const HEADING_THREE = 'headingThree';
export const HEADING_FOUR = 'headingFour';
export const BLOCKQUOTE = 'blockquote';

export const HEADING_BLOCKS = [HEADING_ONE, HEADING_TWO, HEADING_THREE, HEADING_FOUR];
export const HOTKEYS = {
  'mod+b': 'strong',
  'mod+i': 'emphasis',
  'mod+u': 'underline',

  'mod+opt+1': 'headingOne', // Mac
  'mod+opt+2': 'headingTwo', // Mac
  'mod+opt+3': HEADING_THREE, // Mac
  'mod+opt+4': 'headingFour', // Mac
  'mod+opt+b': 'blockquote',
  'mod+opt+t': 'table',
  'mod+opt+c': CODE_BLOCK,

  'mod+shift+l': 'orderedList',
  'mod+shift+u': 'unorderedList',

  'mod+shift+1': 'headingOne',
  'mod+shift+2': 'headingTwo',
  'mod+shift+3': 'headingThree',
  'mod+shift+4': 'headingFour',

  'mod+shift+t': 'table',
  'mod+shift+c': CODE_BLOCK,
};

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
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+shift+7': 'orderedList',
  'mod+shift+8': 'unorderedList',
  'mod+opt+1': 'headingOne', // Mac
  'mod+opt+2': 'headingTwo', // Mac
  'mod+opt+3': 'headingTree', // Mac
  'mod+opt+4': 'headingFour', // Mac
  'mod+alt+1': 'headingOne', // Windows  'mod+opt+1': 'heading-one', // Mac
  'mod+alt+2': 'headingTwo', // Windows  'mod+opt+1': 'heading-one', // Mac
  'mod+alt+3': 'headingTree', // Windows  'mod+opt+1': 'heading-one', // Mac
  'mod+alt+4': 'headingFour', // Windows  'mod+opt+1': 'heading-one', // Mac
  'mod+opt+b': 'blockquote',
  'mod+opt+t': 'table',
  'mod+alt+t': 'table',
  'mod+alt+c': CODE_BLOCK,
  'mod+opt+c': CODE_BLOCK,

  // doesn`t work
  //   'mod+k': 'link', //
};

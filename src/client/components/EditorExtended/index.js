import Editor from './editor';

import beforeInput, { StringToTypeMap } from './util/beforeinput';
import RenderMap from './util/rendermap';
import Link, { findLinkEntities } from './components/entities/link';
import keyBindingFn from './util/keybinding';
import rendererFn from './components/customrenderer';
import customStyleMap from './util/customstylemap';
import toMarkdown from './util/editorStateToMarkdown';
import fromMarkdown from './util/markdownToEditorState';
import createEditorState from './model/content';

import QuoteCaptionBlock from './components/blocks/blockquotecaption';
import CaptionBlock from './components/blocks/caption';
import AtomicBlock from './components/blocks/atomic';
import ImageBlock from './components/blocks/image';
import BreakBlock from './components/blocks/break';

import ImageSideButton from './components/sides/ImageSideButton';
import BreakSideButton from './components/sides/SeparatorSideButton';

export { Block, Inline, Entity, HANDLED, NOT_HANDLED } from './util/constants';
export { BLOCK_BUTTONS, INLINE_BUTTONS } from './components/toolbar';

export {
  getDefaultBlockData,
  getCurrentBlock,
  addNewBlock,
  resetBlockWithType,
  updateDataOfBlock,
  addNewBlockAt,
} from './model';

// eslint-disable-next-line no-undef
// export const _version = __VERSION__;

export {
  Editor,
  createEditorState,
  StringToTypeMap,
  RenderMap,
  Link,
  findLinkEntities,
  beforeInput,
  toMarkdown,
  fromMarkdown,
  customStyleMap,
  keyBindingFn,
  rendererFn,
  QuoteCaptionBlock,
  CaptionBlock,
  AtomicBlock,
  ImageBlock,
  BreakBlock,
  ImageSideButton,
  BreakSideButton,
};

export default Editor;

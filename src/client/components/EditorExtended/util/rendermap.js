import { Map } from 'immutable';
import { DefaultDraftBlockRenderMap } from 'draft-js';

import { Block } from './constants';

/*
Mapping that returns containers for the various block types.
*/
const RenderMap = Map({
  [Block.CAPTION]: {
    element: 'cite',
  },
  [Block.BLOCKQUOTE_CAPTION]: {
    element: 'blockquote',
  },
  [Block.TODO]: {
    element: 'div',
  },
  [Block.IMAGE]: {
    element: 'figure',
  },
  [Block.BREAK]: {
    element: 'div',
  },
  [Block.STORY_TITLE]: {
    element: 'h1',
  },
  [Block.SLIDER]: {
    element: 'SLIDER',
  },
}).merge(DefaultDraftBlockRenderMap);

export default RenderMap;

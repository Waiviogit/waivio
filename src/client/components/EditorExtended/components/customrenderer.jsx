import QuoteCaptionBlock from './blocks/blockquotecaption';
import CaptionBlock from './blocks/caption';
import AtomicBlock from './blocks/atomic';
import ImageBlock from './blocks/image';
import BreakBlock from './blocks/break';

import { Block } from '../util/constants';

export default (setEditorState, getEditorState) => contentBlock => {
  const type = contentBlock.getType();

  switch (type) {
    case Block.BLOCKQUOTE_CAPTION:
      return {
        component: QuoteCaptionBlock,
      };
    case Block.CAPTION:
      return {
        component: CaptionBlock,
      };
    case Block.ATOMIC:
      return {
        component: AtomicBlock,
        editable: false,
        props: {
          getEditorState,
        },
      };
    case Block.IMAGE:
      return {
        component: ImageBlock,
        props: {
          setEditorState,
          getEditorState,
        },
      };
    case Block.BREAK:
      return {
        component: BreakBlock,
        editable: false,
      };
    default:
      return null;
  }
};

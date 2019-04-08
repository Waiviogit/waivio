import React from 'react';
import { Block, rendererFn } from '../index';
import { ATOMIC_TYPES } from '../util/constants';
import SeparatorBlock from '../components/blocks/break';

const AtomicBlock = props => {
  const { blockProps, block } = props; // eslint-disable-line
  const content = blockProps.getEditorState().getCurrentContent();
  const entity = content.getEntity(block.getEntityAt(0));
  const data = entity.getData();
  const type = entity.getType();
  if (blockProps.components[type]) {
    const AtComponent = blockProps.components[type];
    return (
      <div className={`md-block-atomic-wrapper md-block-atomic-wrapper-${type}`}>
        <AtComponent data={data} />
      </div>
    );
  }
  return (
    <p>
      Block of type <b>{type}</b> is not supported.
    </p>
  );
};

function customRenderer(setEditorState, getEditorState) {
  const atomicRenderers = {
    // embed: () => <div>Embed Component</div>,
    [ATOMIC_TYPES.SEPARATOR]: SeparatorBlock,
  };
  const rFnOld = rendererFn(setEditorState, getEditorState);
  const rFnNew = contentBlock => {
    const type = contentBlock.getType();
    switch (type) {
      case Block.ATOMIC:
        return {
          component: AtomicBlock,
          editable: false,
          props: {
            components: atomicRenderers,
            getEditorState,
          },
        };
      default:
        return rFnOld(contentBlock);
    }
  };
  return rFnNew;
}

export default customRenderer;

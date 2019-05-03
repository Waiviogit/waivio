import React from 'react';
import PropTypes from 'prop-types';
import './atomic.less';
import { ATOMIC_TYPES } from '../../util/constants';
import SeparatorBlock from './break';
import VideoBlock from './video';

const AtomicBlock = props => {
  const { blockProps, block } = props; // eslint-disable-line
  const content = blockProps.getEditorState().getCurrentContent();
  const entity = content.getEntity(block.getEntityAt(0));
  const type = entity.getType();
  switch (type) {
    case ATOMIC_TYPES.SEPARATOR:
      return <SeparatorBlock />;
    case ATOMIC_TYPES.VIDEO:
      return <VideoBlock entityData={entity.data} />;
    default:
      return <p>No supported block for {type}</p>;
  }
};

AtomicBlock.propTypes = {
  block: PropTypes.shape(),
  getEditorState: PropTypes.func,
};

AtomicBlock.defaultProps = {
  block: {},
  getEditorState: () => {},
};

export default AtomicBlock;

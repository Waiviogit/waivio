import React from 'react';
import PropTypes from 'prop-types';
import './atomic.less';

const AtomicBlock = props => {
  const content = props.getEditorState().getCurrentContent();
  const entity = content.getEntity(props.block.getEntityAt(0));
  const data = entity.getData();
  const type = entity.getType();
  if (type === 'image') {
    return (
      <div className="md-block-atomic-wrapper">
        <img alt="" src={data.src} />
        <div className="md-block-atomic-controls">
          <button>&times;</button>
        </div>
      </div>
    );
  }
  return <p>No supported block for {type}</p>;
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

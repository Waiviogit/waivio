import PropTypes from 'prop-types';
import React from 'react';

import { EditorBlock, EditorState, SelectionState } from 'draft-js';

import { getCurrentBlock } from '../../model';
import './image.less';

class ImageBlock extends React.Component {
  static propTypes = {
    block: PropTypes.shape().isRequired,
    blockProps: PropTypes.shape(),
  };
  static defaultProps = {
    blockProps: {},
  };

  focusBlock = () => {
    const { block, blockProps } = this.props;
    const { getEditorState, setEditorState } = blockProps;
    const key = block.getKey();
    const editorState = getEditorState();
    const currentBlock = getCurrentBlock(editorState);
    if (currentBlock.getKey() === key) {
      return;
    }
    const newSelection = new SelectionState({
      anchorKey: key,
      focusKey: key,
      anchorOffset: 0,
      focusOffset: 0,
    });
    setEditorState(EditorState.forceSelection(editorState, newSelection));
  };

  render() {
    const { block } = this.props;
    const data = block.getData();
    const src = data.get('src');
    if (src !== null) {
      return (
        <div>
          <div
            role="presentation"
            className="md-block-image-inner-container"
            onClick={this.focusBlock}
          >
            <img alt={data.get('alt') || ''} src={src} />
          </div>
          <figcaption>
            <EditorBlock {...this.props} />
          </figcaption>
        </div>
      );
    }
    return <EditorBlock {...this.props} />;
  }
}

export default ImageBlock;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { EditorState, AtomicBlockUtils } from 'draft-js';
import './SideButtons.less';

@injectIntl
class SeparatorSideButton extends Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    setEditorState: PropTypes.func,
    getEditorState: PropTypes.func,
    close: PropTypes.func,
  };
  static defaultProps = {
    setEditorState: () => {},
    getEditorState: () => {},
    close: () => {},
  };

  onClick = () => {
    let editorState = this.props.getEditorState();
    const content = editorState.getCurrentContent();
    const contentWithEntity = content.createEntity('separator', 'IMMUTABLE', { metadata: 'test' });
    const entityKey = contentWithEntity.getLastCreatedEntityKey();
    editorState = EditorState.push(editorState, contentWithEntity, 'create-entity');
    this.props.setEditorState(AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, '***'));
    this.props.close();
  };

  render() {
    return (
      <button
        className="editor-side-btn"
        onClick={this.onClick}
        title={this.props.intl.formatMessage({
          id: 'add_separator',
          defaultMessage: 'Add a separator',
        })}
      >
        <i className="iconfont icon-minus" />
      </button>
    );
  }
}

export default SeparatorSideButton;

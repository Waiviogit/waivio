import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Block, addNewBlock } from 'medium-draft';
import './SideButtons.less';

@injectIntl
class SeparatorSideButton extends Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    setEditorState: PropTypes.func,
    getEditorState: PropTypes.func,
  };
  static defaultProps = {
    setEditorState: () => {},
    getEditorState: () => {},
    close: () => {},
  };

  onClick = () => {
    this.props.setEditorState(addNewBlock(this.props.getEditorState(), Block.BREAK));
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

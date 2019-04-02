import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
// import { Block, addNewBlock } from 'medium-draft';
import './SideButtons.less';

@injectIntl
class EmbedSideButton extends Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    // setEditorState: PropTypes.func,
    // getEditorState: PropTypes.func,
    // close: PropTypes.func,
  };
  static defaultProps = {
    setEditorState: () => {},
    getEditorState: () => {},
    close: () => {},
  };

  onClick = () => {
    this.input.value = null;
    this.input.click();
  };

  render() {
    return (
      <button
        className="editor-side-btn"
        onClick={this.onClick}
        title={this.props.intl.formatMessage({ id: 'embed', defaultMessage: 'Add an embed' })}
      >
        <i className="iconfont icon-code" />
      </button>
    );
  }
}

export default EmbedSideButton;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { EditorState, AtomicBlockUtils } from 'draft-js';
import { Icon, Input } from 'antd';
import { ATOMIC_TYPES } from '../../util/constants';

const videoLinkInput = props => {
  const handleAddVideoLink = link => {
    let editorState = props.getEditorState();
    const content = editorState.getCurrentContent();
    const contentWithEntity = content.createEntity(ATOMIC_TYPES.VIDEO, 'IMMUTABLE', { src: link });
    const entityKey = contentWithEntity.getLastCreatedEntityKey();
    editorState = EditorState.push(editorState, contentWithEntity, 'change-block-type');
    props.setEditorState(AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' '));
    props.close();
  };
  return (
    <Input.Search
      className="video-link-input"
      enterButton="Enter"
      placeholder={props.intl.formatMessage({
        id: 'post_btn_video_placeholder',
        defaultMessage: "Paste link (YouTube | DTube | Vimeo | 3Speak) and press 'Enter'",
      })}
      onSearch={handleAddVideoLink}
    />
  );
};

videoLinkInput.propTypes = {
  intl: PropTypes.shape().isRequired,
  setEditorState: PropTypes.func.isRequired,
  getEditorState: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

@injectIntl
class VideoSideButton extends Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    // setEditorState: PropTypes.func,
    // getEditorState: PropTypes.func,
    // close: PropTypes.func,
    renderControl: PropTypes.func.isRequired,
  };
  static defaultProps = {
    setEditorState: () => {},
    getEditorState: () => {},
  };

  onClick = () => this.props.renderControl(videoLinkInput(this.props));

  render() {
    const { intl } = this.props;
    return (
      <button
        className="md-sb-button action-btn"
        title={intl.formatMessage({
          id: 'video',
          defaultMessage: 'Add a video',
        })}
        onClick={this.onClick}
      >
        <Icon type="video-camera" className="btn-icon" />
        <span className="action-btn__caption">
          {this.props.intl.formatMessage({ id: 'post_btn_video', defaultMessage: 'Video' })}
        </span>
      </button>
    );
  }
}

export default VideoSideButton;

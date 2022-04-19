import React, { Component } from 'react';
import { startsWith } from 'lodash';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { EditorState, AtomicBlockUtils } from 'draft-js';
import { Input, message } from 'antd';
import Play from '@icons/play.png';
import { ATOMIC_TYPES } from '../../util/constants';

const videoLinkInput = props => {
  const handleAddVideoLink = link => {
    if (startsWith(link, 'http')) {
      let editorState = props.getEditorState();
      const content = editorState.getCurrentContent();
      const contentWithEntity = content.createEntity(ATOMIC_TYPES.VIDEO, 'IMMUTABLE', {
        src: link,
      });
      const entityKey = contentWithEntity.getLastCreatedEntityKey();

      editorState = EditorState.push(editorState, contentWithEntity, 'change-block-type');
      props.setEditorState(AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' '));
      props.close();
    } else {
      message.error(
        props.intl.formatMessage({
          id: 'imageSetter_invalid_link',
          defaultMessage: 'The link is invalid',
        }),
      );
    }
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
        <img src={Play} className="action-btn__icon" alt="play" />
        <span className="action-btn__caption">
          {this.props.intl.formatMessage({ id: 'post_btn_video', defaultMessage: 'Video' })}
        </span>
      </button>
    );
  }
}

export default VideoSideButton;

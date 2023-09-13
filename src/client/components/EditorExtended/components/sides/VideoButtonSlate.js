import React, { Component, useState } from 'react';
import { startsWith } from 'lodash';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Input, message } from 'antd';
import classNames from 'classnames';
import { ReactEditor, useSlate } from 'slate-react';
import { Transforms } from 'slate';
import { createEmptyNode, createVideoNode } from '../../util/SlateEditor/utils/embed';

const VideoLinkInput = props => {
  const editor = useSlate();
  const [videoLink, setVideoLink] = useState('');

  const handleAddVideoLink = link => {
    setVideoLink(link);
    if (startsWith(link, 'http')) {
      Transforms.insertNodes(editor, createVideoNode({ url: link }));

      setTimeout(() => {
        Transforms.insertNodes(editor, createEmptyNode(editor));
        ReactEditor.focus(editor);
      });
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

  const className = classNames({
    'video-link-input': true,
    'video-link-input_comment': props.isComment,
  });
  const handleDoneBtnClick = e => {
    if (e.keyCode === 13 || e.key === 'Enters') {
      handleAddVideoLink(videoLink);
    }
  };

  return (
    <Input.Search
      autoFocus
      className={className}
      enterButton="Enter"
      placeholder={props.intl.formatMessage({
        id: 'post_btn_video_placeholder',
        defaultMessage: "Paste link (YouTube | DTube | Vimeo | 3Speak) and press 'Enter'",
      })}
      onSearch={handleAddVideoLink}
      onKeyUp={handleDoneBtnClick}
    />
  );
};

VideoLinkInput.propTypes = {
  intl: PropTypes.shape().isRequired,
  close: PropTypes.func.isRequired,
  isComment: PropTypes.bool,
};

VideoLinkInput.defaultProps = {
  isComment: false,
};

@injectIntl
class VideoSideButtonSlate extends Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    // setEditorState: PropTypes.func,
    // getEditorState: PropTypes.func,
    renderControl: PropTypes.func.isRequired,
  };
  static defaultProps = {
    setEditorState: () => {},
    getEditorState: () => {},
  };

  onClick = () => this.props.renderControl(<VideoLinkInput {...this.props} />);

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
        <img
          src={'/images/icons/play_video.svg'}
          width={30}
          height={30}
          className="action-btn__icon"
          alt="play"
        />
        <span className="action-btn__caption">
          {this.props.intl.formatMessage({ id: 'post_btn_video', defaultMessage: 'Video' })}
        </span>
      </button>
    );
  }
}

export default VideoSideButtonSlate;

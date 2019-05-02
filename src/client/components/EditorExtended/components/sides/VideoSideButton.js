import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
// import { EditorState, Modifier } from 'draft-js';
import { Icon } from 'antd';
// import { Entity } from '../../util/constants';

@injectIntl
class VideoSideButton extends Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    // setEditorState: PropTypes.func,
    // getEditorState: PropTypes.func,
    // close: PropTypes.func,
  };
  static defaultProps = {
    setEditorState: () => {},
    getEditorState: () => {},
    // close: () => {},
  };

  render() {
    const { intl } = this.props;
    return (
      <button
        className="md-sb-button action-btn"
        title={intl.formatMessage({
          id: 'video',
          defaultMessage: 'Add a video',
        })}
      >
        <Icon type="video-camera" className="video-btn" />
      </button>
    );
  }
}

export default VideoSideButton;

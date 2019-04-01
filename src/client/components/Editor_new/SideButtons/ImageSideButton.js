import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Block, addNewBlock } from 'medium-draft';
import { message } from 'antd';
import './SideButtons.less';

@injectIntl
class ImageSideButton extends Component {
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
    this.input.value = null;
    this.input.click();
  };

  onChange = e => {
    const file = e.target.files[0];
    if (file.type.indexOf('image/') === 0) {
      const formData = new FormData();
      formData.append('file', file);

      message.info(
        this.props.intl.formatMessage({
          id: 'notify_uploading_image',
          defaultMessage: 'Uploading image',
        }),
      );

      fetch(`https://ipfs.busy.org/upload`, {
        method: 'POST',
        body: formData,
      })
        .then(response => {
          if (response.status === 200) {
            return response.json().then(data => {
              if (data.url) {
                this.props.setEditorState(
                  addNewBlock(this.props.getEditorState(), Block.IMAGE, {
                    src: data.url,
                  }),
                );
              }
            });
          }
          return null;
        })
        .catch(err => {
          console.log('err', err);
          message.error(
            this.props.intl.formatMessage({
              id: 'notify_uploading_iamge_error',
              defaultMessage: "Couldn't upload image",
            }),
          );
        });
    }
    this.props.close();
  };

  render() {
    return (
      <button
        className="editor-side-btn"
        onClick={this.onClick}
        title={this.props.intl.formatMessage({ id: 'image', defaultMessage: 'Add an Image' })}
      >
        <i className="iconfont icon-picture" />
        <input
          type="file"
          accept="image/*"
          ref={c => {
            this.input = c;
          }}
          onChange={this.onChange}
          style={{ display: 'none' }}
        />
      </button>
    );
  }
}

export default ImageSideButton;

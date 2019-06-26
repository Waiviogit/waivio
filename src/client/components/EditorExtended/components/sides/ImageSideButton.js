import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
// import { EditorState, AtomicBlockUtils } from 'draft-js';
import { message } from 'antd';

import { addNewBlock } from '../../model';
import { Block } from '../../util/constants';
import { imageUploading, imageUploaded } from '../../../../post/Write/editorActions';

@injectIntl
@connect(
  null,
  {
    imageUploading,
    imageUploaded,
  },
)
export default class ImageSideButton extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    imageUploading: PropTypes.func.isRequired,
    imageUploaded: PropTypes.func.isRequired,
    setEditorState: PropTypes.func.isRequired,
    getEditorState: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onClick() {
    this.input.value = null;
    this.input.click();
  }

  onChange(e) {
    // e.preventDefault();
    const file = e.target.files[0];
    if (file.type.indexOf('image/') === 0) {
      const formData = new FormData();
      formData.append('file', file);

      const hideNotification = message.loading(
        this.props.intl.formatMessage({
          id: 'notify_uploading_image',
          defaultMessage: 'Uploading image',
        }),
        0,
      );

      this.props.imageUploading();
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
                    alt: data.name,
                  }),
                );
                this.props.imageUploaded();
                hideNotification();
              }
            });
          }
          return null;
        })
        .catch(err => {
          console.log('err', err);
          this.props.imageUploaded();
          message.error(
            this.props.intl.formatMessage({
              id: 'notify_uploading_iamge_error',
              defaultMessage: "Couldn't upload image",
            }),
          );
          hideNotification();
        });
    }
    this.props.close();
  }

  // For testing - don't load images to ipfs
  // onChange(e) {
  //   // e.preventDefault();
  //   const file = e.target.files[0];
  //   if (file.type.indexOf('image/') === 0) {
  //     const src = URL.createObjectURL(file);
  //     this.props.setEditorState(
  //       addNewBlock(this.props.getEditorState(), Block.IMAGE, {
  //         src,
  //       }),
  //     );
  //   }
  //   this.props.close();
  // }

  render() {
    return (
      <button
        className="md-sb-button action-btn"
        type="button"
        onClick={this.onClick}
        title={this.props.intl.formatMessage({ id: 'image', defaultMessage: 'Add an image' })}
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

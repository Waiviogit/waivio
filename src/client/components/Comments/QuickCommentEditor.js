import React from 'react';
import PropTypes from 'prop-types';
import { Input, Icon, Modal } from 'antd';
import _ from 'lodash';
import withEditor from '../Editor/withEditor';
import Avatar from '../Avatar';
import ImageSetter from '../ImageSetter/ImageSetter';
import './QuickCommentEditor.less';

@withEditor
class QuickCommentEditor extends React.Component {
  static propTypes = {
    parentPost: PropTypes.shape().isRequired,
    username: PropTypes.string.isRequired,
    isLoading: PropTypes.bool,
    inputValue: PropTypes.string.isRequired,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    inputValue: '',
    isLoading: false,
    onImageUpload: () => {},
    onImageInvalid: () => {},
    onSubmit: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      body: '',
      isDisabledSubmit: false,
      currentImage: [],
      imageUploading: false,
      commentMsg: props.inputValue || '',
      isModal: false,
      isLoadingImage: false,
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();
    if (e.shiftKey) {
      this.setState(prevState => ({ commentMsg: `${prevState.commentMsg}\n` }));
    } else {
      const { currentImage, commentMsg } = this.state;
      this.setState({ isDisabledSubmit: true });
      if (commentMsg) {
        let imageData = commentMsg.trim();
        if (currentImage) {
          imageData += `\n![${currentImage[0].name}](${currentImage[0].src})\n`;
        }
        this.props.onSubmit(this.props.parentPost, imageData).then(response => {
          if (!_.get(response, 'error', false)) {
            this.setState({ commentMsg: '', currentImage: [] });
          }
        });
      }
    }
  };

  handleMsgChange = e => {
    const commentMsg = e.currentTarget.value;
    this.setState({ commentMsg });
  };

  handleRemoveImage = () => {
    this.setState({ currentImage: [], imageUploading: false });
  };

  handleOpenModal = () => this.setState({ isModal: !this.state.isModal });

  handleOnOk = () => this.setState({ isModal: !this.state.isModal });

  onLoadingImage = value => this.setState({ isLoading: value });

  getImages = image => {
    this.setState({ currentImage: image });
  };

  render() {
    const { currentImage, imageUploading, commentMsg, isModal, isLoadingImage } = this.state;
    const { username, isLoading } = this.props;

    const setImage = (
      <label htmlFor={this.props.parentPost.id}>
        {imageUploading ? (
          <Icon className="QuickComment__loading-img-icon" type="loading" />
        ) : (
          <i
            className="iconfont icon-picture QuickComment__add-img-icon"
            role="presentation"
            onClick={this.handleOpenModal}
          />
        )}
      </label>
    );

    return (
      <React.Fragment>
        <div className="QuickComment">
          {Boolean(username) && (
            <div className="QuickComment__avatar">
              <Avatar username={username} size={34} />
            </div>
          )}
          <Input.TextArea
            autoSize
            value={commentMsg}
            disabled={imageUploading || isLoading}
            onPressEnter={this.handleSubmit}
            onChange={this.handleMsgChange}
          />
          {_.isEmpty(currentImage) && setImage}
        </div>
        {!_.isEmpty(currentImage) && (
          <div className="QuickComment__img-preview">
            <div
              className="QuickComment__img-preview__remove"
              onClick={this.handleRemoveImage}
              role="presentation"
            >
              <i className="iconfont icon-delete_fill QuickComment__img-preview__remove__icon" />
            </div>
            <img src={currentImage[0].src} alt={currentImage[0].name} />
          </div>
        )}
        <Modal
          wrapClassName="Settings__modal"
          onCancel={this.handleOpenModal}
          okButtonProps={{ disabled: isLoadingImage }}
          cancelButtonProps={{ disabled: isLoadingImage }}
          visible={isModal}
          onOk={this.handleOnOk}
        >
          <ImageSetter onImageLoaded={this.getImages} onLoadingImage={this.onLoadingImage} />
        </Modal>
      </React.Fragment>
    );
  }
}

export default QuickCommentEditor;

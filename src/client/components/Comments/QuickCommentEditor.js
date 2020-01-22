import React from 'react';
import PropTypes from 'prop-types';
import { Input, Icon, Modal, message } from 'antd';
import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import { injectIntl } from 'react-intl';
import withEditor from '../Editor/withEditor';
import Avatar from '../Avatar';
import { isValidImage } from '../../helpers/image';
import ImageSetter from '../ImageSetter/ImageSetter';
import { ALLOWED_IMG_FORMATS, MAX_IMG_SIZE } from '../../../common/constants/validation';
import { objectFields } from '../../../common/constants/listOfFields';
import './QuickCommentEditor.less';

@withEditor
@injectIntl
class QuickCommentEditor extends React.Component {
  static propTypes = {
    parentPost: PropTypes.shape().isRequired,
    username: PropTypes.string.isRequired,
    intl: PropTypes.shape().isRequired,
    isLoading: PropTypes.bool,
    inputValue: PropTypes.string.isRequired,
    onImageUpload: PropTypes.func,
    onImageInvalid: PropTypes.func,
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
      image: [],
      imageUploading: false,
      commentMsg: props.inputValue || '',
      isModal: false,
      isLoadingImage: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMsgChange = this.handleMsgChange.bind(this);
    this.handleRemoveImage = this.handleRemoveImage.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.shiftKey) {
      this.setState(prevState => ({ commentMsg: `${prevState.commentMsg}\n` }));
    } else {
      const { image, commentMsg } = this.state;
      this.setState({ isDisabledSubmit: true });
      if (commentMsg) {
        let imageData = commentMsg.trim();
        if (image) {
          imageData += `\n![${image[0].name}](${image[0].src})\n`;
        }
        this.props.onSubmit(this.props.parentPost, imageData).then(response => {
          if (!_.get(response, 'error', false)) {
            this.setState({ commentMsg: '', image: [] });
          }
        });
      }
    }
  }

  handleMsgChange(e) {
    const commentMsg = e.currentTarget.value;
    this.setState({ commentMsg });
  }

  handleRemoveImage() {
    this.setState({ image: [], imageUploading: false });
  }

  handleAddImageByLink = image => {
    this.checkIsValidImageLink(image, this.checkIsImage);
  };

  checkIsValidImageLink = (image, setImageIsValid) => {
    const img = new Image();
    img.src = image.src;
    img.onload = () => setImageIsValid(image, true);
    img.onerror = () => setImageIsValid(image, false);
  };

  checkIsImage = (image, isValidLink) => {
    const { intl } = this.props;
    if (isValidLink) {
      this.setState({ image: [image] });
    } else {
      message.error(
        intl.formatMessage({
          id: 'imageSetter_invalid_link',
          defaultMessage: 'The link is invalid',
        }),
      );
    }
  };

  handleChangeImage = event => {
    const { onImageInvalid, onImageUpload } = this.props;
    if (event.target.files && event.target.files[0]) {
      if (
        !isValidImage(
          event.target.files[0],
          MAX_IMG_SIZE[objectFields.background],
          ALLOWED_IMG_FORMATS,
        )
      ) {
        onImageInvalid(
          MAX_IMG_SIZE[objectFields.background],
          `(${ALLOWED_IMG_FORMATS.join(', ')}) `,
        );
        return;
      }

      this.setState({
        isLoadingImage: true,
        image: [],
      });

      onImageUpload(event.target.files[0], this.disableAndInsertImage, () =>
        this.setState({
          isLoadingImage: false,
        }),
      );
    }
  };

  disableAndInsertImage = (image, imageName = 'image') => {
    const newImage = {
      src: image,
      name: imageName,
      id: uuidv4(),
    };
    this.setState({
      image: [newImage],
      isLoadingImage: false,
    });
  };

  handleOpenModal = () => this.setState({ isModal: !this.state.isModal });

  handleOnOk = () => this.setState({ isModal: !this.state.isModal });

  render() {
    const { image, imageUploading, commentMsg, isModal, isLoadingImage } = this.state;
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
          {_.isEmpty(image) && setImage}
        </div>
        {!_.isEmpty(image) && (
          <div className="QuickComment__img-preview">
            <div
              className="QuickComment__img-preview__remove"
              onClick={this.handleRemoveImage}
              role="presentation"
            >
              <i className="iconfont icon-delete_fill QuickComment__img-preview__remove__icon" />
            </div>
            <img src={image[0].src} alt={image[0].name} />
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
          <ImageSetter
            isLoading={isLoadingImage}
            handleAddImage={this.handleChangeImage}
            onRemoveImage={this.handleRemoveImage}
            images={image}
            handleAddImageByLink={this.handleAddImageByLink}
          />
        </Modal>
      </React.Fragment>
    );
  }
}

export default QuickCommentEditor;

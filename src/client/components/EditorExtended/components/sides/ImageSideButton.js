import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
// import { EditorState, AtomicBlockUtils } from 'draft-js';
import { Modal } from 'antd';
import uuidv4 from 'uuid/v4';
import { addNewBlock } from '../../model';
import { Block } from '../../util/constants';
import ImageSetter from '../../../ImageSetter/ImageSetter';
import withEditor from '../../../Editor/withEditor';
import { isValidImage } from '../../../../helpers/image';
import { ALLOWED_IMG_FORMATS, MAX_IMG_SIZE } from '../../../../../common/constants/validation';
import { objectFields } from '../../../../../common/constants/listOfFields';
import addImageByLink from '../../../ImageSetter/ImageSetterHelpers';

@withEditor
@injectIntl
export default class ImageSideButton extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    setEditorState: PropTypes.func.isRequired,
    getEditorState: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
    onImageInvalid: PropTypes.func.isRequired,
    onImageUpload: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isModal: false,
      isLoadingImage: false,
    };

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.setState({ isModal: true });
  }

  handleChangeImage = e => {
    if (e.target.files && e.target.files[0]) {
      if (
        !isValidImage(e.target.files[0], MAX_IMG_SIZE[objectFields.background], ALLOWED_IMG_FORMATS)
      ) {
        this.props.onImageInvalid(
          MAX_IMG_SIZE[objectFields.background],
          `(${ALLOWED_IMG_FORMATS.join(', ')}) `,
        );
        return;
      }

      this.setState({
        isLoadingImage: true,
        currentImage: [],
      });

      this.props.onImageUpload(e.target.files[0], this.disableAndInsertImage, () =>
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
      currentImage: [newImage],
      isLoadingImage: false,
    });
  };

  handleOnOk = () => {
    if (this.state.currentImage.length) {
      const image = this.state.currentImage[0];
      this.props.setEditorState(
        addNewBlock(this.props.getEditorState(), Block.IMAGE, {
          // fix for issue with loading large images to digital-ocean
          src: `${image.src.startsWith('http') ? image.src : `https://${image.src}`}`,
          alt: image.name,
        }),
      );
    }
    this.props.close();
  };

  handleRemoveImage = () => {
    this.setState({
      currentImage: [],
    });
  };

  handleOpenModal = () => this.setState({ isModal: !this.state.isModal });

  getImageByLink = image => {
    this.setState({ currentImage: [image] });
  };

  handleAddImageByLink = image => {
    addImageByLink(image, this.getImageByLink, this.props.intl);
  };

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
    const { isLoadingImage, isModal, currentImage } = this.state;
    return (
      <React.Fragment>
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
            images={currentImage}
            handleAddImageByLink={this.handleAddImageByLink}
          />
        </Modal>
      </React.Fragment>
    );
  }
}

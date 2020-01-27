import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
// import { EditorState, AtomicBlockUtils } from 'draft-js';
import { Modal } from 'antd';
import { addNewBlock } from '../../model';
import { Block } from '../../util/constants';
import ImageSetter from '../../../ImageSetter/ImageSetter';
import withEditor from '../../../Editor/withEditor';

@withEditor
@injectIntl
export default class ImageSideButton extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    setEditorState: PropTypes.func.isRequired,
    getEditorState: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isModal: false,
      isLoadingImage: false,
      currentImage: [],
    };
  }

  onClick = () => this.setState({ isModal: true });

  onLoadingImage = value => this.setState({ isLoading: value });

  getImages = image => this.setState({ currentImage: image });

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

  handleOpenModal = () => this.setState({ isModal: !this.state.isModal });

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
    const { isLoadingImage, isModal } = this.state;
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
          {isModal && (
            <ImageSetter onImageLoaded={this.getImages} onLoadingImage={this.onLoadingImage} />
          )}
        </Modal>
      </React.Fragment>
    );
  }
}

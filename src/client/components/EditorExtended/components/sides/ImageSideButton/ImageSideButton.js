import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Modal, Button, Tooltip } from 'antd';
import { addNewBlock } from '../../../model';
import { Block } from '../../../util/constants';
import ImageSetter from '../../../../ImageSetter/ImageSetter';
import withEditor from '../../../../Editor/withEditor';

import './ImageSideButton.less';

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
    const { isLoadingImage, isModal, currentImage } = this.state;
    const tooltipMessage = currentImage.length ? 'modal_set_image' : 'modal_must_upload_image'
    const tooltipDefaultMessage = currentImage.length ? 'Set Image' : 'Нou have to upload a image'
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
          okButtonProps={{ disabled: isLoadingImage || !currentImage.length }}
          cancelButtonProps={{ disabled: isLoadingImage }}
          visible={isModal}
          footer={[
            <Button key="back" onClick={this.props.close}>
              {this.props.intl.formatMessage({ id: 'modal.button.cancel', defaultMessage: 'Cancel' })}
            </Button>,
            <Tooltip
              overlayClassName='SideButtonTooltip'
              title={this.props.intl.formatMessage({ id: tooltipMessage, defaultMessage: tooltipDefaultMessage })}
              overlayStyle={{fontSize: '12px'}}
              children={
                <Button type="primary" disabled={!this.state.currentImage.length} onClick={this.handleOnOk}>
                  {this.props.intl.formatMessage({ id: 'modal.button.yes', defaultMessage: 'OK' })}
                </Button>
              }
            />
          ]}
        >
          {isModal && (
            <ImageSetter
              onImageLoaded={this.getImages}
              onLoadingImage={this.onLoadingImage}
              isRequired
            />
          )}
        </Modal>
      </React.Fragment>
    );
  }
}

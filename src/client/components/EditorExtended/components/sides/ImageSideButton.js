import PropTypes from 'prop-types';
import React from 'react';
import { EditorState } from 'draft-js';
import { get, isEqual, isNil } from 'lodash';
import { injectIntl } from 'react-intl';
import { Icon, Modal } from 'antd';
import { addNewBlockAt } from '../../model';
import { Block } from '../..';
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
      isLoading: false,
      currentImages: [],
    };
    this.onChange = editorState => {
      this.props.setEditorState(editorState);
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.setState({ isModal: true });
  }

  handleOnOk = () => this.props.close();

  handleOpenModal = () => {
    this.setState({ isModal: !this.state.isModal });
    return this.handleCancelModal();
  };

  handleCancelModal = () => {
    const { getEditorState, setEditorState } = this.props;
    const { currentImages } = this.state;
    const contentState = getEditorState().getCurrentContent();
    const allBlocks = contentState.getBlockMap();
    console.log('allBlocks: ', allBlocks);

    allBlocks.forEach((block, index) => {
      console.log('block: ', block);
      // eslint-disable-next-line no-underscore-dangle
      const currentImageSrc = get(block.data._root, 'entries[0][1]', '');
      currentImages.forEach((image, imgIndex) => {
        console.log('currentImages: ', currentImages);
        if (!isNil(currentImageSrc) && isEqual(image.src, currentImageSrc)) {
          const blockBefore = contentState.getBlockBefore(index).getKey();
          const removeImage = contentState.getBlockMap().delete(index);
          const contentAfterRemove = removeImage.delete(blockBefore);
          const filtered = contentAfterRemove.filter(element => !isNil(element));
          const newContent = contentState.merge({
            blockMap: filtered,
          });
          console.log('removeImage: ', removeImage);
          setEditorState(EditorState.push(getEditorState(), newContent, 'split-block'));
          currentImages.splice(imgIndex, 1);
        }
      });
    });
  };

  onLoadingImage = value => this.setState({ isLoading: value });

  getImages = image => this.setState({ currentImages: image });

  render() {
    console.log('state: ', this.state.currentImages);
    const { isLoading, isModal } = this.state;
    return (
      <React.Fragment>
        <button
          className="md-sb-button action-btn"
          type="button"
          onClick={this.onClick}
          title={this.props.intl.formatMessage({ id: 'image', defaultMessage: 'Add an image' })}
        >
          <Icon type="picture" className="btn-icon" />
          <span className="action-btn__caption">
            {this.props.intl.formatMessage({ id: 'post_btn_photo', defaultMessage: 'Photo' })}
          </span>
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
          okButtonProps={{ disabled: isLoading }}
          cancelButtonProps={{ disabled: isLoading }}
          visible={isModal}
          onOk={this.handleOnOk}
        >
          <ImageSetter
            onImageLoaded={this.getImages}
            onLoadingImage={this.onLoadingImage}
            isRequired
            Block={Block}
            addNewBlockAt={addNewBlockAt}
            setEditorState={this.onChange}
            getEditorState={this.props.getEditorState}
            selection={this.props.getEditorState().getSelection()}
          />
        </Modal>
      </React.Fragment>
    );
  }
}

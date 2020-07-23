import PropTypes from 'prop-types';
import React from 'react';
import { CompositeDecorator, EditorState, ContentBlock, genKey } from 'draft-js';
import { injectIntl } from 'react-intl';
import { Icon, Modal } from 'antd';
// import {addNewBlock, addNewBlockAt} from '../../model';
import { Block, findLinkEntities } from '../..';
import ImageSetter from '../../../ImageSetter/ImageSetter';
import withEditor from '../../../Editor/withEditor';
import ObjectLink from '../entities/objectlink';

@withEditor
@injectIntl
export default class ImageSideButton extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    // setEditorState: PropTypes.func.isRequired,
    // getEditorState: PropTypes.func.isRequired,
    // close: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const decorator = new CompositeDecorator([
      {
        strategy: findLinkEntities,
        component: ObjectLink,
      },
    ]);

    this.state = {
      isModal: false,
      isLoadingImage: false,
      isLoading: false,
      currentImage: [],
      editorState: EditorState.createEmpty(decorator),
    };

    this.onClick = this.onClick.bind(this);

    this.onChange = editorState => {
      this.setState({ editorState });
    };
  }

  onClick() {
    this.setState({ isModal: true });
  }

  inserNewBlockToContentState = image => {
    console.log('inserNewBlockToContentState: ', image);
    const content = this.state.editorState.getCurrentContent();
    const blockMap = content.getBlockMap();
    const newBlock = new ContentBlock({
      key: genKey(),
      src: `${image.src.startsWith('http') ? image.src : `https://${image.src}`}`,
      alt: image.name,
      type: Block.IMAGE,
    });
    console.log('newBlock: ', newBlock);
    const newBlockMap = blockMap
      .toSeq()
      .concat([[newBlock.getKey(), newBlock]])
      .toOrderedMap();
    return content.merge({
      blockMap: newBlockMap,
    });
    // return
  };

  handleOnOk = () => {
    // if (this.state.currentImage.length) {
    //   const images = this.state.currentImage;
    //   images.forEach(image => this.inserNewBlockToContentState(image));
    // }
    // this.props.close();
  };

  handleOpenModal = () => this.setState({ isModal: !this.state.isModal });

  onLoadingImage = value => {
    this.setState({ isLoading: value });
  };

  getImages = image => {
    this.setState({ currentImage: image });
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
          />
        </Modal>
      </React.Fragment>
    );
  }
}

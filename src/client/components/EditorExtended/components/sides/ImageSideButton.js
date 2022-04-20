import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Modal } from 'antd';
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
      currentImage: [],
      isOkayBtn: false,
    };
    this.onChange = editorState => {
      this.props.setEditorState(editorState);
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.setState({ isModal: true });
  }

  handleOnOk = () => this.setState({ isOkayBtn: true }, () => this.props.close());

  handleOpenModal = () => this.setState({ isModal: !this.state.isModal, isOkayBtn: false });

  onLoadingImage = value => this.setState({ isLoading: value });

  getImages = image => this.setState({ currentImage: image });

  render() {
    const { isLoading, isModal, isOkayBtn } = this.state;

    return (
      <React.Fragment>
        <button
          className="md-sb-button action-btn"
          type="button"
          onClick={this.onClick}
          title={this.props.intl.formatMessage({ id: 'image', defaultMessage: 'Add an image' })}
        >
          <img src="../images/icons/picture.svg" alt="show photos" className="btn-icon_photo" />
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
            isOkayBtn={isOkayBtn}
            isModal={isModal}
          />
        </Modal>
      </React.Fragment>
    );
  }
}

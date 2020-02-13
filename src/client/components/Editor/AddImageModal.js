import React from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';
import { injectIntl } from 'react-intl';
import { Input, Modal, Form } from 'antd';
import QuickPostEditorFooter from '../../../client/components/QuickPostEditor/QuickPostEditorFooter';
import {
  ALLOWED_IMG_FORMATS,
  MAX_IMG_SIZE,
  objectURLValidationRegExp,
} from '../../../common/constants/validation';
import { isValidImage } from '../../helpers/image';
import './AddImageModal.less';

@injectIntl
@Form.create()
class AddImageModal extends React.Component {
  static propTypes = {
    form: PropTypes.shape().isRequired,
    onCancel: PropTypes.func,
    insertImage: PropTypes.func,
    onImageInvalid: PropTypes.func,
    onImageUpload: PropTypes.func,
    visible: PropTypes.bool,
    intl: PropTypes.shape(),
  };

  static defaultProps = {
    onCancel: () => {},
    insertImage: () => {},
    onImageInvalid: () => {},
    onImageUpload: () => {},
    visible: false,
    intl: {},
  };

  state = {
    imageUploading: false,
    currentImage: [],
  };

  handleOk = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.insertImage(values.image);
        this.props.onCancel();
      }
    });
    this.reset();
  };

  handleImageChange = e => {
    if (e.target.files && e.target.files[0]) {
      if (!isValidImage(e.target.files[0], MAX_IMG_SIZE.background, ALLOWED_IMG_FORMATS)) {
        this.props.onImageInvalid(MAX_IMG_SIZE.background, `(${ALLOWED_IMG_FORMATS.join(', ')}) `);
        return;
      }

      this.setState({
        imageUploading: true,
      });

      this.props.onImageUpload(e.target.files[0], this.disableAndInsertImage, () =>
        this.setState({
          imageUploading: false,
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
    this.setState({ imageUploading: false, currentImage: [newImage] });
    this.props.form.setFieldsValue({ image });
  };

  handleRemoveImage = () => {
    this.reset();
  };

  handleCancelModal = () => {
    this.reset();
    this.props.onCancel();
  };

  reset = () => {
    this.props.form.setFieldsValue({ image: '' });
    this.setState({
      imageUploading: false,
      currentImage: [],
    });
  };

  renderImage = () => {
    const { currentImage } = this.state;

    if (currentImage[0]) {
      return (
        <div className="AddImageModal__previewWrap">
          <img src={currentImage[0].src} alt="pic" className="AddImageModal__preview" />
        </div>
      );
    }
    return null;
  };

  render() {
    const { visible, intl, form } = this.props;
    const { imageUploading, currentImage } = this.state;

    return (
      <Modal
        visible={visible}
        onCancel={this.handleCancelModal}
        onOk={this.handleOk}
        okText={intl.formatMessage({
          id: 'image_modal_add',
          defaultMessage: 'Add',
        })}
        cancelText={intl.formatMessage({
          id: 'image_modal_cancel',
          defaultMessage: 'Cancel',
        })}
      >
        <div className="image-wrapper">
          <QuickPostEditorFooter
            imageUploading={imageUploading}
            handleImageChange={this.handleImageChange}
            currentImages={currentImage}
            onRemoveImage={this.handleRemoveImage}
            showAddButton={false}
          />
          <span>
            {intl.formatMessage({
              id: 'or',
              defaultMessage: 'OR',
            })}
          </span>
          <Form.Item>
            {form.getFieldDecorator('image', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: intl.formatMessage(
                    {
                      id: 'field_error',
                      defaultMessage: 'Field is required',
                    },
                    {
                      field: intl.formatMessage({
                        id: 'image_url_placeholder',
                        defaultMessage: 'Image URL',
                      }),
                    },
                  ),
                },
                {
                  pattern: objectURLValidationRegExp,
                  message: intl.formatMessage({
                    id: 'image_link_validation',
                    defaultMessage: 'Please enter valid link',
                  }),
                },
              ],
            })(
              <Input
                className="AddImageModal__input"
                placeholder={intl.formatMessage({
                  id: 'image_url_placeholder',
                  defaultMessage: 'Image URL',
                })}
              />,
            )}
          </Form.Item>
          {this.renderImage()}
        </div>
      </Modal>
    );
  }
}

export default AddImageModal;

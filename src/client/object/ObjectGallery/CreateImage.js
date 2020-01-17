import React from 'react';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { bindActionCreators } from 'redux';
import { Form, Select, Modal, message } from 'antd';
import uuidv4 from 'uuid/v4';
import { ALLOWED_IMG_FORMATS, MAX_IMG_SIZE } from '../../../common/constants/validation';
import { getAuthenticatedUserName, getObject, getObjectAlbums } from '../../reducers';
import { objectFields } from '../../../common/constants/listOfFields';
import * as galleryActions from './galleryActions';
import * as appendActions from '../appendActions';
import { getField, generatePermlink, prepareImageToStore } from '../../helpers/wObjectHelper';
import AppendFormFooter from '../AppendFormFooter';
import ImageSetter from '../../components/ImageSetter/ImageSetter';
import { isValidImage } from '../../helpers/image';
import './CreateImage.less';

@connect(
  state => ({
    currentUsername: getAuthenticatedUserName(state),
    wObject: getObject(state),
    albums: getObjectAlbums(state),
  }),
  dispatch =>
    bindActionCreators(
      {
        addImageToAlbumStore: image => galleryActions.addImageToAlbumStore(image),
        appendObject: wObject => appendActions.appendObject(wObject),
      },
      dispatch,
    ),
)
class CreateImage extends React.Component {
  state = {
    fileList: [],
    uploadingList: [],
    loading: false,
    imageUploading: false,
    currentImages: [],
    isValidLink: false,
  };

  getWobjectData = () => {
    const { currentUsername, wObject } = this.props;
    const data = {};
    data.author = currentUsername;
    data.parentAuthor = wObject.author;
    data.parentPermlink = wObject.author_permlink;
    data.title = '';
    data.lastUpdated = Date.now();
    data.wobjectName = getField(wObject, objectFields.name);
    return data;
  };

  getWobjectField = image => {
    const { form } = this.props;
    return {
      name: 'galleryItem',
      body: image.src,
      locale: 'en-US',
      id: form.getFieldValue('id'),
    };
  };

  getWobjectBody = image => {
    const { selectedAlbum, currentUsername, intl } = this.props;
    return intl.formatMessage(
      {
        id: 'append_new_image',
        defaultMessage: `@{user} added a new image to album {album} <br /> {image.response.image}`,
      },
      {
        user: currentUsername,
        album: selectedAlbum.body,
        url: image.src,
      },
    );
  };

  handleSubmit = e => {
    e.preventDefault();

    const { selectedAlbum, hideModal, intl } = this.props;

    this.props.form.validateFields(err => {
      if (!err) {
        this.setState({ loading: true });

        this.appendImages()
          .then(() => {
            hideModal();
            this.setState({ fileList: [], uploadingList: [], loading: false });
            message.success(
              intl.formatMessage(
                {
                  id: 'added_image_to_album',
                  defaultMessage: `@{user} added a new image to album {album} <br /> {url}`,
                },
                {
                  album: selectedAlbum.body,
                },
              ),
            );
          })
          .catch(() => {
            message.error(
              intl.formatMessage({
                id: 'couldnt_upload_image',
                defaultMessage: "Couldn't add the image to album.",
              }),
            );
            this.setState({ loading: false });
          });
      }
    });
  };

  handleImageChange = e => {
    const { onImageInvalid, onImageUpload } = this.props;
    if (e.target.files && e.target.files[0]) {
      if (
        !isValidImage(e.target.files[0], MAX_IMG_SIZE[objectFields.background], ALLOWED_IMG_FORMATS)
      ) {
        onImageInvalid(
          MAX_IMG_SIZE[objectFields.background],
          `(${ALLOWED_IMG_FORMATS.join(', ')}) `,
        );
        return;
      }

      this.setState({
        imageUploading: true,
      });

      onImageUpload(e.target.files[0], this.disableAndInsertImage, () =>
        this.setState({
          imageUploading: false,
        }),
      );
    }
  };

  checkIsValidImageLink = (image, setImageIsValid) => {
    const img = new Image();
    img.src = image.src;
    img.onload = () => setImageIsValid(image, true);
    img.onerror = () => setImageIsValid(image, false);
  };

  checkIsImage = (image, isValidLink) => {
    const { intl } = this.props;
    const { currentImages } = this.state;
    const isSameLink = currentImages.some(currentImage => currentImage.src === image.src);
    if (isValidLink) {
      if (!isSameLink) {
        const images = [...this.state.currentImages, image];
        this.setState({ currentImages: images });
      } else
        message.error(
          intl.formatMessage({
            id: 'imageSetter_link_is_already_added',
            defaultMessage: 'The link you are trying to add is already added',
          }),
        );
    } else {
      message.error(
        intl.formatMessage({
          id: 'imageSetter_invalid_link',
          defaultMessage: 'The link is invalid',
        }),
      );
    }
  };

  handleAddImageByLink = image => {
    this.checkIsValidImageLink(image, this.checkIsImage);
  };

  disableAndInsertImage = (image, imageName = 'image') => {
    const newImage = {
      src: image,
      name: imageName,
      id: uuidv4(),
    };
    const images = [...this.state.currentImages, newImage];
    this.setState({ imageUploading: false, currentImages: images });
  };

  handleRemoveImage = imageId => {
    this.setState({
      currentImages: this.state.currentImages.filter(f => f.id !== imageId),
    });
  };

  handleChange = ({ fileList, file }) => {
    if (!fileList.length) {
      this.props.form.resetFields();
    }

    const isAllowed = ALLOWED_IMG_FORMATS.includes(`${file.type.split('/')[1]}`);
    if (!isAllowed) {
      message.error(
        this.props.intl.formatMessage(
          {
            id: 'file_format_allowed',
            defaultMessage: 'You can only upload {formats} file formats!',
          },
          {
            formats: ALLOWED_IMG_FORMATS.join(' ').toUpperCase(),
          },
        ),
      );
      return;
    }

    const maxSizeByte = MAX_IMG_SIZE[objectFields.background];
    if (file.size > maxSizeByte) {
      message.error(
        this.props.intl.formatMessage(
          {
            id: 'invalid_image_size',
            defaultMessage: 'Image must smaller than {size}MB!',
          },
          {
            size: (maxSizeByte / 1024 / 1024).toFixed(),
          },
        ),
      );
      return;
    }

    switch (file.status) {
      case 'uploading':
        this.setState(prevState => ({ uploadingList: prevState.uploadingList.concat(file.uid) }));
        break;
      case 'done':
        this.setState(prevState => ({
          uploadingList: prevState.uploadingList.filter(f => f !== file.uid),
        }));
        break;
      default:
        this.setState({ uploadingList: [] });
    }

    this.setState({ fileList });
  };

  appendImages = async () => {
    const { addImageToAlbumStore, form } = this.props;
    const { currentImages } = this.state;

    const data = this.getWobjectData();
    /* eslint-disable no-restricted-syntax */
    for (const image of currentImages) {
      const postData = {
        ...data,
        permlink: `${data.author}-${generatePermlink()}`,
        field: this.getWobjectField(image),
        body: this.getWobjectBody(image),
      };

      /* eslint-disable no-await-in-loop */
      const response = await this.props.appendObject(postData);
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (response.value.transactionId) {
        const filteredFileList = this.state.fileList.filter(file => file.uid !== image.uid);
        this.setState({ fileList: filteredFileList }, async () => {
          const img = prepareImageToStore(postData);
          await addImageToAlbumStore({
            ...img,
            author: response.value.author,
            id: form.getFieldValue('id'),
          });
        });
      }
    }
  };

  handleModalCancel = () => {
    this.props.hideModal();
    this.setState({ fileList: [], uploadingList: [] });
  };

  render() {
    const { showModal, form, intl, selectedAlbum, albums } = this.props;
    const { fileList, uploadingList, loading } = this.state;

    return (
      <Modal
        title={intl.formatMessage({
          id: 'add_new_image',
          defaultMessage: 'Add new image',
        })}
        footer={null}
        visible={showModal}
        onCancel={this.handleModalCancel}
        width={767}
        destroyOnClose
      >
        <Form className="CreateImage" layout="vertical">
          <Form.Item>
            {form.getFieldDecorator('id', {
              initialValue: selectedAlbum ? selectedAlbum.id : 'Choose an album',
              rules: [
                {
                  required: true,
                  message: intl.formatMessage(
                    {
                      id: 'field_error',
                      defaultMessage: 'Field is required',
                    },
                    { field: 'Album' },
                  ),
                },
              ],
            })(
              <Select disabled={loading}>
                {map(albums, album => (
                  <Select.Option key={`${album.id}${album.bogy}`} value={album.id}>
                    {album.body}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item>
            {form.getFieldDecorator('upload', {
              rules: [
                {
                  required: !fileList.length,
                  message: intl.formatMessage({
                    id: 'upload_photo_error',
                    defaultMessage: 'You need to upload at least one image',
                  }),
                },
              ],
            })(
              <div className="clearfix">
                <ImageSetter
                  images={this.state.currentImages}
                  handleAddImage={this.handleImageChange}
                  handleAddImageByLink={this.handleAddImageByLink}
                  onRemoveImage={this.handleRemoveImage}
                  isLoading={this.state.imageUploading}
                  isMultiple
                />
                {/* TODO: Possible will use */}
                {/* <Modal visible={previewVisible} footer={null} onCancel={this.handlePreviewCancel}> */}
                {/*  <img */}
                {/*    alt="example" */}
                {/*    style={{ width: '100%', 'max-height': '90vh' }} */}
                {/*    src={previewImage} */}
                {/*  /> */}
                {/* </Modal> */}
              </div>,
            )}
          </Form.Item>
          <Form.Item>
            {!uploadingList.length ? (
              <AppendFormFooter
                loading={loading}
                form={this.props.form}
                handleSubmit={this.handleSubmit}
              />
            ) : (
              <AppendFormFooter
                loading={Boolean(uploadingList.length)}
                form={this.props.form}
                handleSubmit={this.handleSubmit}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

CreateImage.propTypes = {
  showModal: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
  form: PropTypes.shape().isRequired,
  selectedAlbum: PropTypes.shape(),
  onImageUpload: PropTypes.func.isRequired,
  onImageInvalid: PropTypes.func.isRequired,
  albums: PropTypes.arrayOf(PropTypes.shape()),
  currentUsername: PropTypes.shape(),
  wObject: PropTypes.shape(),
  appendObject: PropTypes.func,
  addImageToAlbumStore: PropTypes.func,
};

CreateImage.defaultProps = {
  selectedAlbum: null,
  currentUsername: {},
  wObject: {},
  albums: [],
  appendObject: () => {},
  addImageToAlbumStore: () => {},
};

export default injectIntl(Form.create()(CreateImage));

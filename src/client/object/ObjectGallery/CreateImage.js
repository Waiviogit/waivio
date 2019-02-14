import React from 'react';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { bindActionCreators } from 'redux';
import { Button, Form, Select, Modal, Upload, Icon, message, Spin } from 'antd';
import './CreateImage.less';
import { ALLOWED_IMG_FORMATS, MAX_IMG_SIZE } from '../../../common/constants/validation';
import { getField } from '../../objects/WaivioObject';
import { getAuthenticatedUserName, getObject } from '../../reducers';
import { objectFields } from '../../../common/constants/listOfFields';
import * as galleryActions from './galleryActions';
import * as appendActions from '../appendActions';
import { prepareImageToStore } from '../../helpers/wObjectHelper';

@connect(
  state => ({
    currentUsername: getAuthenticatedUserName(state),
    wObject: getObject(state),
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
    previewVisible: false,
    previewImage: '',
    fileList: [],
    uploadingList: [],
    loading: false,
  };

  getWobjectData = () => {
    const { currentUsername, wObject } = this.props;
    const data = {};
    data.author = currentUsername;
    data.parentAuthor = wObject.author;
    data.parentPermlink = wObject.author_permlink;
    data.title = '';
    data.permlink = `${data.author}-${Math.random()
      .toString(36)
      .substring(2)}`;
    data.lastUpdated = Date.now();
    data.wobjectName = getField(wObject, objectFields.name);
    return data;
  };

  getWobjectField = image => ({
    name: 'galleryItem',
    body: image.response.url,
    locale: 'en-US',
    id: this.props.selectedAlbum.id,
  });

  getWobjectBody = image => {
    const { selectedAlbum, currentUsername, intl } = this.props;
    return intl.formatMessage(
      {
        id: 'append_new_image',
        defaultMessage: `@{user} added a new image to album {album} <br /> {url}`,
      },
      {
        user: currentUsername,
        album: selectedAlbum.body,
        url: image.response.url,
      },
    );
  };

  handlePreviewCancel = () => this.setState({ previewVisible: false });

  handleSubmit = e => {
    e.preventDefault();

    const { selectedAlbum, hideModal, intl } = this.props;
    const { fileList } = this.state;

    this.props.form.validateFields(err => {
      if (!err) {
        this.setState({ loading: true });

        this.appendImages(fileList)
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

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  appendImages = async images => {
    const { addImageToAlbumStore, selectedAlbum } = this.props;

    const data = this.getWobjectData();

    /* eslint-disable-next-line */
    for (const image of images) {
      const postData = {
        ...data,
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
            id: selectedAlbum.id,
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
    const { previewVisible, previewImage, fileList, uploadingList, loading } = this.state;

    const acceptImageFormat = ALLOWED_IMG_FORMATS.map(format => `.${format}`).join(',');

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
              initialValue: selectedAlbum.id,
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
                  <Select.Option key={album.id} value={album.id}>
                    {album.body}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>

          <Form.Item
            label={intl.formatMessage({
              id: 'upload_photos',
              defaultMessage: 'Upload photos',
            })}
          >
            {form.getFieldDecorator('upload', {
              rules: [
                {
                  required: true,
                  message: intl.formatMessage({
                    id: 'upload_photo_error',
                    defaultMessage: 'You need to upload at least one image',
                  }),
                },
              ],
            })(
              <div className="clearfix">
                <Spin
                  tip={intl.formatMessage({
                    id: 'image_submitting',
                    defaultMessage: 'Submitting...',
                  })}
                  spinning={loading}
                >
                  <Upload
                    accept={acceptImageFormat}
                    action="https://ipfs.busy.org/upload"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    supportServerRender
                  >
                    {fileList.length >= 10 ? null : (
                      <div>
                        <Icon type="plus" />
                        <div className="ant-upload-text">
                          {intl.formatMessage({
                            id: 'upload_image',
                            defaultMessage: 'Upload',
                          })}
                        </div>
                      </div>
                    )}
                  </Upload>
                  <Modal visible={previewVisible} footer={null} onCancel={this.handlePreviewCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </Spin>
              </div>,
            )}
          </Form.Item>
          <Form.Item className="CreateImage__submit">
            {!uploadingList.length ? (
              <Button
                type="primary"
                loading={loading}
                disabled={loading}
                onClick={this.handleSubmit}
              >
                {intl.formatMessage({
                  id: loading ? 'image_send_progress' : 'image_append_send',
                  defaultMessage: loading ? 'Submitting' : 'Submit image',
                })}
              </Button>
            ) : (
              <Button
                type="primary"
                loading={Boolean(uploadingList.length)}
                disabled={Boolean(uploadingList.length)}
              >
                {intl.formatMessage({
                  id: 'uploading_image_progress',
                  defaultMessage: 'Uploading image...',
                })}
              </Button>
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
  selectedAlbum: PropTypes.shape().isRequired,
  albums: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  currentUsername: PropTypes.shape(),
  wObject: PropTypes.shape(),
  appendObject: PropTypes.func,
  addImageToAlbumStore: PropTypes.func.isRequired,
};

CreateImage.defaultProps = {
  currentUsername: {},
  wObject: {},
  appendObject: () => {},
};

export default injectIntl(Form.create()(CreateImage));

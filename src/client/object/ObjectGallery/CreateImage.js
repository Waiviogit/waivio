import React from 'react';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Form, Select, Modal, Upload, Icon, message, Spin } from 'antd';
import './CreateImage.less';
import { ALLOWED_IMG_FORMATS, MAX_IMG_SIZE } from '../../../common/constants/validation';
import { getField } from '../../objects/WaivioObject';
import { getAuthenticatedUserName, getObject } from '../../reducers';
import { appendObject } from '../appendActions';
import { objectFields } from '../../../common/constants/listOfFields';

@connect(
  state => ({
    currentUsername: getAuthenticatedUserName(state),
    wObject: getObject(state),
  }),
  { appendObject },
)
class CreateImage extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
    uploadingList: [],
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
    const { selectedAlbum, currentUsername } = this.props;
    return `@${currentUsername} added a new image to album ${selectedAlbum.body} <br /> ${
      image.response.url
    }`;
  };

  handlePreviewCancel = () => this.setState({ previewVisible: false });

  handleSubmit = e => {
    e.preventDefault();

    const { selectedAlbum, hideModal } = this.props;
    const { fileList } = this.state;

    this.props.form.validateFields(err => {
      if (!err) {
        this.appendImages(fileList)
          .then(() => {
            hideModal();
            this.setState({ fileList: [], uploadingList: [] });
            message.success(
              `You successfully have added the image(s) to album ${selectedAlbum.body}`,
            );
          })
          .catch(() => message.error("Couldn't add the image to album."));
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
        `You can only upload ${ALLOWED_IMG_FORMATS.join(' ').toUpperCase()} file formats!`,
      );
      return;
    }
    const maxSizeByte = MAX_IMG_SIZE[objectFields.background];
    const isLimited = file.size < maxSizeByte;
    if (!isLimited) {
      message.error(`Image must smaller than ${(maxSizeByte / 1024 / 1024).toFixed()}MB!`);
      return;
    }

    switch (file.status) {
      case 'uploading':
        this.setState({ uploadingList: this.state.uploadingList.concat(file.uid) });
        break;
      case 'done':
        this.setState({
          uploadingList: this.state.uploadingList.filter(f => f !== file.uid),
        });
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
    const data = this.getWobjectData();

    /* eslint-disable-next-line */
    for (const image of images) {
      const postData = {
        ...data,
        field: this.getWobjectField(image),
        body: this.getWobjectBody(image),
      };

      /* eslint-disable-next-line */
      const response = await this.props.appendObject(postData);

      if (response.value.transactionId) {
        const filteredFileList = this.state.fileList.filter(file => file.uid !== image.uid);
        this.setState({ fileList: filteredFileList });
      }
    }
  };

  handleModalCancel = () => {
    this.props.hideModal();
    this.setState({ fileList: [], uploadingList: [] });
  };

  // beforeUpload = (fileList, file) => {
  //   const isAllowed = ALLOWED_IMG_FORMATS.includes(`${file[0].type.split('/')[1]}`);
  //   if (!isAllowed) {
  //     message.error(
  //       `You can only upload ${ALLOWED_IMG_FORMATS.join(' ').toUpperCase()} file formats!`,
  //     );
  //     return false;
  //   }
  //   const maxSizeByte = MAX_IMG_SIZE[objectFields.background];
  //   const isLimited = file[0].size < maxSizeByte;
  //   if (!isLimited) {
  //     message.error(`Image must smaller than ${(maxSizeByte / 1024 / 1024).toFixed()}MB!`);
  //     return false;
  //   }
  //   return true;
  // };

  render() {
    const { showModal, form, loading, intl, selectedAlbum, albums } = this.props;
    const { previewVisible, previewImage, fileList, uploadingList } = this.state;

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
              <Select>
                {map(albums, album => (
                  <Select.Option key={album.id} value={album.id}>
                    {album.body}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="Upload photos">
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
                <Spin tip="Submitting..." spinning={loading}>
                  <Upload
                    accept={acceptImageFormat}
                    action="https://ipfs.busy.org/upload"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    // beforeUpload={this.beforeUpload}
                    supportServerRender
                  >
                    {fileList.length >= 10 ? null : (
                      <div>
                        <Icon type="plus" />
                        <div className="ant-upload-text">Upload</div>
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
                loading={!!uploadingList.length}
                disabled={uploadingList.length}
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
  loading: PropTypes.bool.isRequired,
  intl: PropTypes.shape().isRequired,
  form: PropTypes.shape().isRequired,
  selectedAlbum: PropTypes.shape().isRequired,
  albums: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  currentUsername: PropTypes.shape(),
  wObject: PropTypes.shape(),
  appendObject: PropTypes.func,
};

CreateImage.defaultProps = {
  currentUsername: {},
  wObject: {},
  appendObject: () => {},
};

export default injectIntl(Form.create()(CreateImage));

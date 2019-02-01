import React from 'react';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Form, Select, Modal, Upload, Icon, message, Spin } from 'antd';
import './CreateImage.less';
import { ALLOWED_IMG_FORMATS } from '../../../common/constants/validation';
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
    // uploading: false,
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

  handleCancel = () => this.setState({ previewVisible: false });

  handleSubmit = e => {
    e.preventDefault();

    const { selectedAlbum, hideModal } = this.props;
    const { fileList } = this.state;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.appendImages(fileList)
          .then(() => {
            hideModal();
            message.success(
              `You successfully have added the image(s) to album ${selectedAlbum.body}`,
            );
          })
          .catch(() => message.error("Couldn't add the image to album."));
      }
      message.error("Couldn't add the image to album.");
      console.log(values);
    });
  };

  handleChange = ({ fileList, file }) => {
    if (!fileList.length) {
      this.props.form.resetFields();
    }

    if (file.status !== 'uploading') {
      console.log(file, fileList);
    }
    if (file.status === 'done') {
      console.info(`${file.name} file uploaded successfully`);
    } else if (file.status === 'error') {
      console.error(`${file.name} file upload failed.`);
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

  handleCustomRequest = () => {};

  render() {
    const {
      showModal,
      hideModal,
      // handleSubmit,
      form,
      loading,
      intl,
      selectedAlbum,
      albums,
      // imageUploading,
      // currentImage,
      // handleImageChange,
      // handleRemoveImage,
    } = this.props;

    const { previewVisible, previewImage, fileList } = this.state;

    const acceptImageFormat = ALLOWED_IMG_FORMATS.map(format => `.${format}`).join(',');

    return (
      <Modal
        title={intl.formatMessage({
          id: 'add_new_image',
          defaultMessage: 'Add new image',
        })}
        footer={null}
        visible={showModal}
        onCancel={hideModal}
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
                    // customRequest={this.handleCustomRequest}
                    supportServerRender
                  >
                    {fileList.length >= 10 ? null : (
                      <div>
                        <Icon type="plus" />
                        <div className="ant-upload-text">Upload</div>
                      </div>
                    )}
                  </Upload>
                  <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                  </Modal>
                </Spin>
              </div>,
            )}
          </Form.Item>
          <Form.Item className="CreateImage__submit">
            <Button type="primary" loading={loading} disabled={loading} onClick={this.handleSubmit}>
              {intl.formatMessage({
                id: loading ? 'image_send_progress' : 'image_append_send',
                defaultMessage: loading ? 'Submitting' : 'Submit image',
              })}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

CreateImage.propTypes = {
  showModal: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  // handleSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  intl: PropTypes.shape().isRequired,
  form: PropTypes.shape().isRequired,
  selectedAlbum: PropTypes.shape().isRequired,
  albums: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  // currentImage: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  // imageUploading: PropTypes.bool.isRequired,
  // handleImageChange: PropTypes.func.isRequired,
  // handleRemoveImage: PropTypes.func.isRequired,
  currentUsername: PropTypes.shape().isRequired,
  wObject: PropTypes.shape().isRequired,
  appendObject: PropTypes.func.isRequired,
};

export default injectIntl(Form.create()(CreateImage));

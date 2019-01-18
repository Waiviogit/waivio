import React from 'react';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Button, Form, Select, Modal, Input } from 'antd';
import './CreateImage.less';
import QuickPostEditorFooter from '../../components/QuickPostEditor/QuickPostEditorFooter';

const CreateImage = ({
  showModal,
  hideModal,
  handleSubmit,
  form,
  loading,
  intl,
  selectedAlbum,
  albums,
  imageUploading,
  currentImage,
  handleImageChange,
  handleRemoveImage,
}) => (
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
      <QuickPostEditorFooter
        imageUploading={imageUploading}
        handleImageChange={handleImageChange}
        currentImages={currentImage}
        onRemoveImage={handleRemoveImage}
      />
      <Form.Item>
        {form.getFieldDecorator('image', {
          initialValue: currentImage[0] && currentImage[0].src,
          rules: [
            {
              required: true,
              message: intl.formatMessage(
                {
                  id: 'field_error',
                  defaultMessage: 'Field is required',
                },
                { field: 'Image' },
              ),
            },
          ],
        })(<Input className="CreateImage__hidden" />)}
      </Form.Item>
      {currentImage[0] && (
        <div className="CreateImage__previewWrap">
          <img src={currentImage[0].src} alt="pic" className="CreateImage__preview" />
        </div>
      )}
      <Form.Item className="CreateImage__submit">
        <Button
          type="primary"
          loading={loading}
          disabled={loading}
          onClick={e => {
            e.preventDefault();
            if (currentImage[0]) {
              form.setFieldsValue({
                image: currentImage[0].src,
              });
            }
            form.validateFieldsAndScroll((err, values) => !err && handleSubmit(values));
          }}
        >
          {intl.formatMessage({
            id: loading ? 'image_send_progress' : 'image_append_send',
            defaultMessage: loading ? 'Submitting' : 'Submit image',
          })}
        </Button>
      </Form.Item>
    </Form>
  </Modal>
);

CreateImage.propTypes = {
  showModal: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  intl: PropTypes.shape().isRequired,
  form: PropTypes.shape().isRequired,
  selectedAlbum: PropTypes.shape().isRequired,
  albums: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  currentImage: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  imageUploading: PropTypes.bool.isRequired,
  handleImageChange: PropTypes.func.isRequired,
  handleRemoveImage: PropTypes.func.isRequired,
};

export default injectIntl(Form.create()(CreateImage));

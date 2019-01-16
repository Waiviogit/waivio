import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input, Modal } from 'antd';
import { FormattedMessage, injectIntl } from 'react-intl';
import objectNameValidationRegExp from '../../common/constants/validationRegExps';
import './CreateAlbum.less';

const CreateAlbum = ({ showModal, hideModal, handleSubmit, form, loading, intl }) => (
  <Modal
    title={intl.formatMessage({
      id: 'add_new_album',
      defaultMessage: 'Add new album',
    })}
    footer={null}
    visible={showModal}
    onCancel={hideModal}
    width={767}
    destroyOnClose
  >
    <Form className="CreateAlbum" layout="vertical">
      <Form.Item>
        {form.getFieldDecorator('galleryAlbum', {
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
            {
              max: 100,
              message: intl.formatMessage(
                {
                  id: 'value_error_long',
                  defaultMessage: "Value can't be longer than 100 characters.",
                },
                { value: 100 },
              ),
            },
            {
              pattern: objectNameValidationRegExp,
              message: intl.formatMessage({
                id: 'validation_special_symbols',
                defaultMessage: 'Please dont use special simbols like "/", "?", "%", "&"',
              }),
            },
          ],
        })(
          <Input
            className="CreateAlbum__input"
            placeholder={intl.formatMessage({
              id: 'add_new_album_placeholder',
              defaultMessage: 'Add value',
            })}
          />,
        )}
      </Form.Item>
      <Form.Item className="CreateAlbum__submit">
        <Button
          type="primary"
          loading={loading}
          disabled={loading}
          onClick={e => {
            e.preventDefault();
            form.validateFieldsAndScroll((err, values) => !err && handleSubmit(values));
          }}
        >
          <FormattedMessage
            id={loading ? 'album_send_progress' : 'album_append_send'}
            defaultMessage={loading ? 'Submitting' : 'Create'}
          />
        </Button>
      </Form.Item>
    </Form>
  </Modal>
);

CreateAlbum.propTypes = {
  showModal: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  intl: PropTypes.shape().isRequired,
  form: PropTypes.shape().isRequired,
};

CreateAlbum.defaultProps = {
  showModal: () => {},
  hideModal: () => {},
  handleSubmit: () => {},
  loading: false,
  intl: {},
  form: {},
};

export default injectIntl(Form.create()(CreateAlbum));

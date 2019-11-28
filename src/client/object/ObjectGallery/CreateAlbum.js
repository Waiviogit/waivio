import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input, message, Modal } from 'antd';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';

import { objectNameValidationRegExp } from '../../../common/constants/validation';
import { prepareAlbumData, prepareAlbumToStore } from '../../helpers/wObjectHelper';
import { getAuthenticatedUserName, getIsAppendLoading, getObject } from '../../reducers';
import { appendObject } from '../appendActions';
import { addAlbumToStore } from './galleryActions';
import './CreateAlbum.less';

const CreateAlbum = ({
  showModal,
  hideModal,
  form,
  loading,
  intl,
  currentUsername,
  wObject,
  appendObjectDispatch,
  addAlbumToStoreDispatch,
}) => {
  const handleSubmit = async formData => {
    const data = prepareAlbumData(formData, currentUsername, wObject);
    const album = prepareAlbumToStore(data);

    try {
      const { author } = await appendObjectDispatch(data);
      await addAlbumToStoreDispatch({ ...album, author });
      hideModal();
      // this.handleToggleModal();
      message.success(
        intl.formatMessage(
          {
            id: 'gallery_add_album_success',
            defaultMessage: 'You successfully have created the {albumName} album',
          },
          {
            albumName: formData.galleryAlbum,
          },
        ),
      );
    } catch (err) {
      message.error(
        intl.formatMessage({
          id: 'gallery_add_album_failure',
          defaultMessage: "Couldn't create the album.",
        }),
      );
      console.log('err', err);
    }
  };

  const handleOnClick = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => !err && handleSubmit(values));
  };

  return (
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
                message: intl.formatMessage({
                  id: 'create_album_valid_enter_name',
                  defaultMessage: 'Please, enter name of album',
                }),
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
              disabled={loading}
              placeholder={intl.formatMessage({
                id: 'add_new_album_placeholder',
                defaultMessage: 'Add value',
              })}
            />,
          )}
        </Form.Item>
        <Form.Item className="CreateAlbum__submit">
          <Button type="primary" loading={loading} disabled={loading} onClick={handleOnClick}>
            <FormattedMessage
              id={loading ? 'album_send_progress' : 'album_append_send'}
              defaultMessage={loading ? 'Submitting' : 'Create'}
            />
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

CreateAlbum.propTypes = {
  showModal: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  intl: PropTypes.shape().isRequired,
  form: PropTypes.shape().isRequired,
  currentUsername: PropTypes.string.isRequired,
  wObject: PropTypes.shape().isRequired,
  appendObjectDispatch: PropTypes.func.isRequired,
  addAlbumToStoreDispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  loading: getIsAppendLoading(state),
  currentUsername: getAuthenticatedUserName(state),
  wObject: getObject(state),
});

const mapDispatchToProps = dispatch => ({
  addAlbumToStoreDispatch: album => dispatch(addAlbumToStore(album)),
  appendObjectDispatch: wObject => dispatch(appendObject(wObject)),
});

export default injectIntl(Form.create()(connect(mapStateToProps, mapDispatchToProps)(CreateAlbum)));

import React, { useState } from 'react';
import { Icon, Modal, Select, message, Checkbox } from 'antd';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import LANGUAGES from '../../../../common/translations/languages';
import { uploadObject } from '../../../../waivioApi/importApi';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';

import './ImportModal.less';

const ImportModal = ({ visible, toggleModal, getImportList, intl }) => {
  const formData = new FormData();
  const authName = useSelector(getAuthenticatedUserName);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [locale, setLocale] = useState('en-US');
  const [objectType, setObjectType] = useState('book');
  const [authority, setAuthority] = useState('administrative');
  const [translate, setTranslate] = useState(false);

  const handleUploadFile = e => {
    setUploadedFile(e.currentTarget.files[0]);
  };

  const deleteFile = () => setUploadedFile(null);

  const onSubmit = () => {
    formData.append('file', uploadedFile);
    formData.append('user', authName);
    formData.append('locale', locale);
    formData.append('objectType', objectType);
    formData.append('authority', authority);
    formData.append('translate', translate);
    uploadObject(formData).then(res => {
      if (res.message) message.error(res.message);

      toggleModal();
      getImportList();
    });
  };

  return (
    <Modal
      visible={visible}
      title={intl.formatMessage({ id: 'upload_new_file', defaultMessage: 'Upload new file' })}
      className={'ImportModal'}
      onCancel={toggleModal}
      onOk={onSubmit}
      okButtonProps={{
        disabled: !objectType || !uploadedFile,
      }}
      okText={intl.formatMessage({ id: 'send_confirmation', defaultMessage: 'Submit' })}
    >
      <div>
        <h4>
          {intl.formatMessage({ id: 'select_object_type', defaultMessage: 'Select object type' })}:
        </h4>
        <Select
          placeholder={intl.formatMessage({ id: 'select', defaultMessage: 'Select' })}
          onSelect={setObjectType}
        >
          {['book', 'product', 'restaurant'].map(type => (
            <Select.Option key={type}>{type}</Select.Option>
          ))}
        </Select>
      </div>
      <div>
        <h4>{intl.formatMessage({ id: 'select_locale', defaultMessage: 'Select locale' })}:</h4>
        <Select defaultValue={'en-US'} onSelect={setLocale}>
          {LANGUAGES.map(lang => (
            <Select.Option key={lang.id}>{lang.name}</Select.Option>
          ))}
        </Select>
      </div>
      <div className="ImportModal__checkbox-wrap">
        <Checkbox checked={translate} onClick={() => setTranslate(!translate)}>
          {intl.formatMessage({
            id: 'data_import_translate_tags',
            defaultMessage: 'Translate tags to the selected locale',
          })}
        </Checkbox>
      </div>
      <div>
        <h4>{intl.formatMessage({ id: 'upload_json', defaultMessage: 'Upload JSON file' })}:</h4>
        {uploadedFile ? (
          <div className="ImportModal__fileCard">
            <Icon className="ImportModal__close" type="close" onClick={deleteFile} />
            {uploadedFile.name}
          </div>
        ) : (
          <React.Fragment>
            <input
              type="file"
              id="inputfile"
              className="ImportModal__inputFile"
              accept={'.json, .txt'}
              onChange={handleUploadFile}
            />
            <label htmlFor={'inputfile'} className="ImportModal__button">
              {intl.formatMessage({ id: 'upload_file', defaultMessage: 'Upload file' })}
            </label>
          </React.Fragment>
        )}
        <p className={'ImportModal__disclaimer'}>
          {intl.formatMessage({
            id: 'json_file_note',
            defaultMessage:
              'The JSON file must be created according to the Datafiniti.io data schema.',
          })}
        </p>
      </div>
      <div>
        <h4>{intl.formatMessage({ id: 'claim_authority', defaultMessage: 'Claim authority' })}:</h4>
        <Select defaultValue={'administrative'} onSelect={setAuthority}>
          {['administrative', 'ownership'].map(type => (
            <Select.Option key={type}>{type}</Select.Option>
          ))}
        </Select>
        <p className={'ImportModal__disclaimer'}>
          {intl.formatMessage({
            id: 'claim_authority_data_import_note',
            defaultMessage:
              'Administrative authority indicates that other non-competing object updates posted by other users are allowed. Ownership authority indicates that all updates by other users must be ignored.',
          })}
        </p>
      </div>
    </Modal>
  );
};

ImportModal.propTypes = {
  visible: PropTypes.string,
  toggleModal: PropTypes.func,
  getImportList: PropTypes.func,
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(ImportModal);

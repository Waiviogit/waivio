import React, { useState } from 'react';
import { Icon, Modal, Select, Checkbox, message } from 'antd';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import LANGUAGES from '../../../../common/translations/languages';
import { uploadObject } from '../../../../waivioApi/importApi';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';

import './ImportModal.less';

const ImportModal = ({ visible, toggleModal, getImportList, intl }) => {
  const authName = useSelector(getAuthenticatedUserName);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [locale, setLocale] = useState('en-US');
  const [loading, setLoading] = useState(false);
  const [objectType, setObjectType] = useState('');
  const [authority, setAuthority] = useState('administrative');
  const [translate, setTranslate] = useState(false);
  const [chatGPT, setChatGPT] = useState(false);

  const handleUploadFile = e => {
    setUploadedFile(e.currentTarget.files[0]);
  };

  const deleteFile = () => setUploadedFile(null);

  const onSubmit = (forceUpdate = false) => {
    const formData = new FormData();

    formData.append('file', uploadedFile);
    formData.append('user', authName);
    formData.append('locale', locale);
    formData.append('objectType', objectType);
    formData.append('authority', authority);
    formData.append('translate', translate);
    formData.append('useGPT', chatGPT);
    if (forceUpdate) {
      formData.append('forceImport', true);
    }
    setLoading(true);
    uploadObject(formData).then(async res => {
      const response = await res.json();
      const msg = response.message;

      if (res.status === 425 && msg) {
        Modal.confirm({
          title: intl.formatMessage({
            id: 'repeat_json_data_file_import',
            defaultMessage: 'Repeat JSON data file import',
          }),
          content: intl.formatMessage({
            id: 'force_import_json_message',
            defaultMessage:
              'It looks like you are trying to import books with type product. Are you sure you want to continue with the import?',
          }),
          onOk: () => onSubmit(true),
          okText: intl.formatMessage({ id: 'import', defaultMessage: 'Import' }),
          cancelText: intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' }),
        });
      } else if (!res.ok) {
        message.error(msg);
      }
      toggleModal();
      getImportList();
      setLoading(true);
    });
  };

  return (
    <Modal
      visible={visible}
      title={intl.formatMessage({ id: 'upload_new_file', defaultMessage: 'Upload new file' })}
      className={'ImportModal'}
      onCancel={toggleModal}
      onOk={() => onSubmit(false)}
      okButtonProps={{
        disabled: !objectType || !uploadedFile,
        loading,
      }}
      okText={intl.formatMessage({ id: 'submit', defaultMessage: 'Submit' })}
    >
      <div>
        <h4>
          {intl.formatMessage({ id: 'select_object_type', defaultMessage: 'Select object type' })}:
        </h4>
        <Select
          placeholder={intl.formatMessage({ id: 'select', defaultMessage: 'Select' })}
          onSelect={setObjectType}
        >
          {['book', 'product', 'business', 'restaurant', 'link', 'recipe', 'person', 'place'].map(
            type => (
              <Select.Option key={type}>{type}</Select.Option>
            ),
          )}
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
      <div className="ImportModal__checkbox-wrap">
        <Checkbox checked={chatGPT} onClick={() => setChatGPT(!chatGPT)}>
          {intl.formatMessage({
            id: 'optimize_description_with_ChatGPT',
            defaultMessage: 'Optimize description with ChatGPT',
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

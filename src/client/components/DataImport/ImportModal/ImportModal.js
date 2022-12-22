import React, { useState } from 'react';
import { Icon, Modal, Select, message } from 'antd';
import { useSelector } from 'react-redux';
import LANGUAGES from '../../../../common/translations/languages';
import { uploadObject } from '../../../../waivioApi/importApi';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';

import './ImportModal.less';

// eslint-disable-next-line react/prop-types
const ImportModal = ({ visible, toggleModal, getImportList }) => {
  const formData = new FormData();
  const authName = useSelector(getAuthenticatedUserName);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [locale, setLocale] = useState('en-US');
  const [objectType, setObjectType] = useState('book');
  const [authority, setAuthority] = useState('administrative');

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
    uploadObject(formData).then(res => {
      if (res.message) message.error(res.message);

      toggleModal();
      getImportList();
    });
  };

  return (
    <Modal
      visible={visible}
      title={'Upload new file'}
      className={'ImportModal'}
      onCancel={toggleModal}
      onOk={onSubmit}
    >
      <div>
        <h4>Select object type:</h4>
        <Select defaultValue={'book'} onSelect={setObjectType}>
          {['book', 'product', 'restaurant'].map(type => (
            <Select.Option key={type}>{type}</Select.Option>
          ))}
        </Select>
      </div>
      <div>
        <h4>Select locale:</h4>
        <Select defaultValue={'en-US'} onSelect={setLocale}>
          {LANGUAGES.map(lang => (
            <Select.Option key={lang.id}>{lang.name}</Select.Option>
          ))}
        </Select>
      </div>
      <div>
        <h4>Upload JSON file:</h4>
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
              // accept={'.(json|txt)'}
              onChange={handleUploadFile}
            />
            <label htmlFor={'inputfile'} className="ImportModal__button">
              Upload file
            </label>
          </React.Fragment>
        )}
        <p className={'ImportModal__disclaimer'}>
          The JSON file must be created according to the Datafiniti.io data schema.
        </p>
      </div>
      <div>
        <h4>Claim athority:</h4>
        <Select defaultValue={'administrative'} onSelect={setAuthority}>
          {['administrative', 'ownership'].map(type => (
            <Select.Option key={type}>{type}</Select.Option>
          ))}
        </Select>
        <p className={'ImportModal__disclaimer'}>
          Administrative authority indicates that other non-competing object updates posted by other
          users are allowed. Ownership authority indicates that all updates by other users must be
          ignored.
        </p>
      </div>
    </Modal>
  );
};

export default ImportModal;

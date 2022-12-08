import React, { useState } from 'react';
import { Modal, Select } from 'antd';

import './ImportModal.less';

// eslint-disable-next-line react/prop-types
const ImportModal = ({ visible, toggleModal }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const handleUploadFile = e => {
    setUploadedFile(e.currentTarget.files[0]);
  };

  // const deleteFile = () => setUploadedFile(null)

  return (
    <Modal
      visible={visible}
      title={'Upload new file'}
      className={'ImportModal'}
      onCancel={toggleModal}
    >
      <div>
        <h4>Select object type:</h4>
        <Select defaultValue={'book'}>
          {['book', 'product', 'business', 'person'].map(type => (
            <Select.Option key={type}>{type}</Select.Option>
          ))}
        </Select>
      </div>
      <div>
        <h4>Upload JSON file:</h4>
        {uploadedFile ? (
          <div className="ImportModal__fileCard">{uploadedFile.name}</div>
        ) : (
          <React.Fragment>
            <input
              type="file"
              id="inputfile"
              className="ImportModal__inputFile"
              accept={'.json'}
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
        <Select defaultValue={'admin'}>
          {['admin', 'owner'].map(type => (
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

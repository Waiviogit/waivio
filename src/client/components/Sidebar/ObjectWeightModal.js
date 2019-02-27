import React from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import ObjectDynamicList from '../../object/ObjectDynamicList';
import * as api from '../../../waivioApi/ApiClient';

const ObjectWeightModal = ({ username, visible, onClose }) => {
  const objectFetcher = async skip => {
    const { wobjects } = await api.getWobjectsWithUserWeight(username, skip);
    return Promise.resolve(wobjects);
  };

  return (
    <Modal visible={visible} footer={null} onCancel={onClose}>
      <Scrollbars autoHide style={{ height: '400px' }}>
        <ObjectDynamicList limit={30} fetcher={objectFetcher} showWeight />
      </Scrollbars>
    </Modal>
  );
};

ObjectWeightModal.propTypes = {
  username: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ObjectWeightModal;

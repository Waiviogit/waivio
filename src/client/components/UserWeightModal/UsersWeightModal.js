import React from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import UsersWeightList from './UsersWeightList';

const UsersWeightModal = ({ users, visible, onClose }) => (
  <Modal visible={visible && users.length > 0} footer={null} onCancel={onClose}>
    <UsersWeightList users={users} />
  </Modal>
);

UsersWeightModal.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape()),
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

UsersWeightModal.defaultProps = {
  users: [],
  visible: false,
  onClose: () => {},
};

export default UsersWeightModal;

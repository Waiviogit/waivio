import { Modal } from 'antd';
import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import UserDynamicList from '../../../user/UserDynamicList';
import { getSuitableUsers } from '../../../../waivioApi/ApiClient';

const ModalEligibleUsers = ({ toggleModal, isModalOpen, userName, followsCount, postsCount }) => {
  const fetcher = () => getSuitableUsers(followsCount || 0, postsCount || 0);

  return (
    <Modal visible={isModalOpen} footer={null} onCancel={toggleModal}>
      <UserDynamicList
        limit={20}
        fetcher={fetcher}
        showAuthorizedUser={false}
        userName={userName}
      />
    </Modal>
  );
};

ModalEligibleUsers.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  isModalOpen: PropTypes.bool.isRequired,
  userName: PropTypes.string.isRequired,
  followsCount: PropTypes.string,
  postsCount: PropTypes.string,
};

ModalEligibleUsers.defaultProps = {
  followsCount: '0',
  postsCount: '0',
};

export default injectIntl(ModalEligibleUsers);

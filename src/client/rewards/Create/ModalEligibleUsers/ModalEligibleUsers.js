import { Modal } from 'antd';
import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import UserDynamicList from '../../../user/UserDynamicList';
import { getSuitableUsers } from '../../../../waivioApi/ApiClient';

const ModalEligibleUsers = ({ toggleModal, isModalOpen, userName }) => {
  // const fetcher = (previous) => {
  const fetcher = () =>
    // const startFrom =
    //   previous[previous.length - 1] && previous[previous.length - 1].name
    //     ? previous[previous.length - 1].name
    //     : '';
    getSuitableUsers(2, 2);

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
};

export default injectIntl(ModalEligibleUsers);

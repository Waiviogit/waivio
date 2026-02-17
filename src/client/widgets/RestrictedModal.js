import { Modal } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';

const RestrictedModal = props => {
  const handleOk = () => {
    if (props.handleRestrictUser && !props.restrictLoading) {
      props.handleRestrictUser(props.user);
    }
  };

  const handleCancel = () => {
    if (!props.restrictLoading) {
      props.setVisible(false);
    }
  };

  return (
    props.visible && (
      <Modal
        visible={props.visible}
        zIndex={2000}
        title={`Reinstate ${props.user?.name}`}
        onCancel={handleCancel}
        onOk={handleOk}
        confirmLoading={props.restrictLoading}
      >
        <p className={'flex justify-center'}>Restore access to this user and profile?</p>
      </Modal>
    )
  );
};

RestrictedModal.propTypes = {
  visible: PropTypes.bool,
  // intl: PropTypes.shape(),
  setVisible: PropTypes.func,
  user: PropTypes.shape(),
  handleRestrictUser: PropTypes.func,
  restrictLoading: PropTypes.bool,
};
export default injectIntl(RestrictedModal);

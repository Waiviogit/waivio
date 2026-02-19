import { Modal } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';

const RestrictedModal = props => {
  const isRestrict = props.mode === 'restrict';
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

  const title = isRestrict
    ? props.intl.formatMessage(
        { id: 'restrict_user', defaultMessage: 'Restrict {username}' },
        { username: props.user?.name },
      )
    : props.intl.formatMessage(
        { id: 'reinstate_user', defaultMessage: 'Reinstate {username}' },
        { username: props.user?.name },
      );

  const content = isRestrict
    ? props.intl.formatMessage({
        id: 'restrict_confirmation',
        defaultMessage:
          'Are you sure you want to restrict this account? Their existing posts and comments will no longer be visible, and they will lose access to platform features.',
      })
    : props.intl.formatMessage({
        id: 'reinstate_confirmation',
        defaultMessage: 'Restore access to this user and profile?',
      });

  return (
    props.visible && (
      <Modal
        visible={props.visible}
        zIndex={2000}
        title={title}
        onCancel={handleCancel}
        onOk={handleOk}
        confirmLoading={props.restrictLoading}
      >
        <p className={'flex justify-center'}>{content}</p>
      </Modal>
    )
  );
};

RestrictedModal.propTypes = {
  visible: PropTypes.bool,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  setVisible: PropTypes.func,
  user: PropTypes.shape(),
  handleRestrictUser: PropTypes.func,
  restrictLoading: PropTypes.bool,
  mode: PropTypes.oneOf(['restrict', 'reinstate']),
};
export default injectIntl(RestrictedModal);

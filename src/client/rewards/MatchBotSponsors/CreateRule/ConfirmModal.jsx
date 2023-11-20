import React from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { isEmpty } from 'lodash';

const ConfirmModal = ({
  confirmLoading,
  editRule,
  intl,
  onCancel,
  onOk,
  sponsor,
  sliderValue,
  visible,
}) => (
  <Modal
    confirmLoading={confirmLoading}
    onCancel={onCancel}
    onOk={onOk}
    title={
      isEmpty(editRule)
        ? intl.formatMessage({
            id: 'matchBot_rule_creation_confirmation',
            defaultMessage: 'Rule creation confirmation',
          })
        : intl.formatMessage({
            id: 'matchBot_rule_editing_confirmation',
            defaultMessage: 'Rule editing confirmation',
          })
    }
    visible={visible}
  >
    {isEmpty(editRule) ? (
      <div>
        {intl.formatMessage({
          id: 'matchBot_modal_create_rule_with_sponsor',
          defaultMessage: 'Do you want to create rule with sponsor',
        })}{' '}
        <Link to={`/@${sponsor.account}`}>{` @${sponsor.account}`}</Link>{' '}
        {intl.formatMessage(
          {
            id: 'matchBot_modal_sponsor_with_upvote',
            defaultMessage: 'and with upvote {upvote}%?',
          },
          {
            upvote: sliderValue,
          },
        )}
      </div>
    ) : (
      intl.formatMessage({
        id: 'matchBot_modal_edit_rule_with_current_changes',
        defaultMessage: 'Do you want to edit rule with current changes',
      })
    )}
  </Modal>
);

ConfirmModal.propTypes = {
  confirmLoading: PropTypes.bool.isRequired,
  editRule: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  sponsor: PropTypes.shape().isRequired,
  sliderValue: PropTypes.number.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default injectIntl(ConfirmModal);

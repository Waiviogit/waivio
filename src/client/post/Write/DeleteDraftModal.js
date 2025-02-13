import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Modal, message } from 'antd';
import { injectIntl } from 'react-intl';
import { deleteDraft } from '../../../store/draftsStore/draftsActions';

const DeleteDraftModal = ({ intl, draftIds, onDelete, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleDeleteDraft = () => {
    setLoading(true);
    dispatch(deleteDraft(draftIds)).then(() => {
      message.success({
        message: intl.formatMessage({
          id: 'draft_delete_success',
          defaultMessage: 'Draft has been deleted',
        }),
      });
      setLoading(false);
      onDelete();
    });
  };

  return (
    <Modal
      title={intl.formatMessage({
        id: 'draft_delete',
        defaultMessage: 'Delete this draft?',
      })}
      visible
      confirmLoading={loading}
      okText={intl.formatMessage({ id: 'confirm', defaultMessage: 'Confirm' })}
      cancelText={intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
      onOk={handleDeleteDraft}
      onCancel={onCancel}
    >
      <div style={{ textAlign: 'center' }}>
        {intl.formatMessage({
          id: 'draft_delete_modal_content',
          defaultMessage: 'Are you sure you want to delete this draft permanently?',
        })}
      </div>
    </Modal>
  );
};

DeleteDraftModal.propTypes = {
  intl: PropTypes.shape().isRequired,
  draftIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onDelete: PropTypes.func,
  onCancel: PropTypes.func,
};

DeleteDraftModal.defaultProps = {
  onDelete: () => {},
  onCancel: () => {},
};

export default injectIntl(DeleteDraftModal);

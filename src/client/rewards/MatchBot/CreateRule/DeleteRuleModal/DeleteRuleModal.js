import React from 'react';
import { Button, Modal } from 'antd';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import './DeleteRuleModal.less';

const DeleteRuleModal = ({
  deleteLoading,
  handleModalVisibility,
  intl,
  isDeleteModal,
  onOk,
  sponsor,
}) => {
  const handleDeleteRule = () => handleModalVisibility();
  return (
    <Modal
      title={intl.formatMessage({
        id: 'matchBot_modal_confirmation_required',
        defaultMessage: 'Confirmation required',
      })}
      wrapClassName="DeleteRuleModal"
      onCancel={handleDeleteRule}
      visible={isDeleteModal}
      footer={null}
    >
      <div className="DeleteRuleModal__content">
        {intl.formatMessage({
          id: 'matchBot_do_you_want_delete_match_bot_rules',
          defaultMessage: 'Do you want to delete match bot rules for',
        })}
        <Link to={`/@${sponsor}`}>{` @${sponsor}`}</Link>?
      </div>
      <div className="DeleteRuleModal__footer">
        <div className="CreateRule__button">
          <Button onClick={handleModalVisibility} disabled={deleteLoading}>
            {intl.formatMessage({
              id: 'matchBot_btn_cancel',
              defaultMessage: 'Cancel',
            })}
          </Button>
          <div className="CreateRule__button-delete">
            <Button disabled={deleteLoading} onClick={onOk} loading={deleteLoading}>
              {intl.formatMessage({
                id: 'matchBot_btn_delete',
                defaultMessage: 'Delete',
              })}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

DeleteRuleModal.propTypes = {
  deleteLoading: PropTypes.bool.isRequired,
  handleModalVisibility: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
  isDeleteModal: PropTypes.bool.isRequired,
  onOk: PropTypes.func.isRequired,
  sponsor: PropTypes.string.isRequired,
};

export default injectIntl(DeleteRuleModal);

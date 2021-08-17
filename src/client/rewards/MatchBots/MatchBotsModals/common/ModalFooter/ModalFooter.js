import { Button } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { MATCH_BOTS_NAMES } from '../../../../../helpers/matchBotsHelpers';

import './ModalFooter.less';

const ModalFooter = ({
  intl,
  handleCloseModal,
  isAddModal,
  botName,
  handleDeleteConfirmation,
  handleAddBot,
  handleEditConfirmation,
}) => {
  const handleConfirmCreate = () => handleAddBot(false);

  return (
    <div className="modalFooter">
      <div className="modalFooter_buttons">
        <Button disabled={false} onClick={handleCloseModal}>
          {intl.formatMessage({ id: 'matchBot_btn_cancel', defaultMessage: 'Cancel' })}
        </Button>
        {isAddModal ? (
          <Button type="primary" disabled={false} onClick={handleConfirmCreate}>
            {intl.formatMessage({ id: `matchBot_btn_add_${botName}` })}
          </Button>
        ) : (
          <Button type="primary" disabled={false} onClick={handleEditConfirmation}>
            {intl.formatMessage({ id: 'matchBot_btn_edit_rule', defaultMessage: 'Save changes' })}
          </Button>
        )}
      </div>
      {!isAddModal && (
        <div className="modalFooter__edit-footer">
          <div className="modalFooter__text f9">
            {intl.formatMessage({
              id: 'matchBot_remove_match_bot_rule_click_button',
              defaultMessage: 'To remove the match bot rule, click the delete button',
            })}
            :
          </div>
          <div className="modalFooter__button-delete">
            <Button disabled={false} onClick={handleDeleteConfirmation}>
              {intl.formatMessage({
                id: 'matchBot_btn_delete_rule',
                defaultMessage: 'Delete rule',
              })}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

ModalFooter.propTypes = {
  intl: PropTypes.shape().isRequired,
  isAddModal: PropTypes.bool.isRequired,
  handleAddBot: PropTypes.func.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  handleEditConfirmation: PropTypes.func.isRequired,
  handleDeleteConfirmation: PropTypes.func.isRequired,
  botName: PropTypes.oneOf([MATCH_BOTS_NAMES.AUTHORS, MATCH_BOTS_NAMES.CURATORS]).isRequired,
};

export default injectIntl(ModalFooter);

import { message, Modal } from 'antd';
import * as React from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';

import MatchBotsBtn from '../../MatchBotsBtn';
import ModalFooter from '../common/ModalFooter';
import ModalBodyDelete from '../common/ModalBodyDelete';
import {
  getBotObjCurator,
  setInitialInputValues,
  MATCH_BOTS_NAMES,
  INITIAL_INPUTS_VALUE_CURATOR,
} from '../../../../helpers/matchBotsHelpers';
import ModalCuratorsBody from '../ModalCuratorsBody';
import ModalBodyConfirm from '../common/ModalBodyConfirm/ModalBodyConfirm';

const ModalsCurators = ({ intl, modalType, addCuratorBot, bot, deleteCuratorBot }) => {
  const isAddModal = modalType === 'add';
  const [inputsValue, setInputsValue] = React.useState(INITIAL_INPUTS_VALUE_CURATOR);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isModalOpenConfirmDelete, setIsModalOpenConfirmDelete] = React.useState(false);
  const [isModalOpenConfirmEdit, setIsModalOpenConfirmEdit] = React.useState(false);

  React.useEffect(() => {
    if (!isModalOpen) setInputsValue(INITIAL_INPUTS_VALUE_CURATOR);
  }, [isModalOpen]);

  React.useEffect(() => {
    if (bot && isModalOpen) setInputsValue(setInitialInputValues(bot));
  }, [bot, isModalOpen]);

  const handleToggleModal = () => setIsModalOpen(prev => !prev);
  const handleToggleModalDelete = () => setIsModalOpenConfirmDelete(prev => !prev);
  const handleCloseModalEdit = () => setIsModalOpenConfirmEdit(false);

  const handleOpenConfirmEditModal = () => {
    setInputsValue(prev => ({ ...prev, isSubmitted: true }));
    if (inputsValue.voteRatio) {
      setIsModalOpenConfirmEdit(true);
    }
  };
  const handleAddBot = isEdit => {
    const ruleObj = getBotObjCurator(inputsValue, isEdit);

    setInputsValue(prev => ({ ...prev, isSubmitted: true }));
    if (!isEmpty(ruleObj)) {
      addCuratorBot(ruleObj)
        .then(() =>
          message.success(
            intl.formatMessage({
              id: isEdit ? 'matchBot_success_updated_curator' : 'matchBot_success_added_curator',
            }),
          ),
        )
        .catch(() =>
          message.error(
            intl.formatMessage({
              id: 'append_validate_common_message',
              defaultMessage: 'Something went wrong',
            }),
          ),
        );
      setIsModalOpen(false);
      setIsModalOpenConfirmEdit(false);
    }
  };
  const handleDeleteBot = () => {
    deleteCuratorBot(bot.name)
      .then(() => {
        message.success(
          intl.formatMessage({
            id: 'matchBot_success_deleted_author',
            defaultMessage: 'Author was successfully deleted',
          }),
        );
      })
      .catch(() =>
        message.error(
          intl.formatMessage({
            id: 'append_validate_common_message',
            defaultMessage: 'Something went wrong',
          }),
        ),
      );
    setIsModalOpen(false);
    setIsModalOpenConfirmDelete(false);
  };

  const handleEditRule = () => handleAddBot(true);

  const handleCancelModal = () => {
    handleToggleModal();
    setInputsValue(INITIAL_INPUTS_VALUE_CURATOR);
  };

  return (
    <div>
      {isAddModal ? (
        <MatchBotsBtn
          onClick={handleToggleModal}
          name={intl.formatMessage({
            id: 'matchBot_curator_btn_add',
            defaultMessage: 'Add curator',
          })}
        />
      ) : (
        <p onClick={handleToggleModal}>
          {intl.formatMessage({
            id: 'edit',
            defaultMessage: 'Edit',
          })}
        </p>
      )}
      {isModalOpen && (
        <React.Fragment>
          <Modal
            footer={null}
            visible={isModalOpen}
            onCancel={handleCancelModal}
            title={
              isAddModal ? (
                intl.formatMessage({ id: `match_bots_${modalType}_curator` })
              ) : (
                <span>
                  {intl.formatMessage({
                    id: 'matchBot_title_edit_rule_curator',
                    defaultMessage: 'Edit match bot rules for curator',
                  })}
                  <Link to={`/@${bot.name}`}>{` @${bot.name}`}</Link>
                </span>
              )
            }
          >
            <ModalCuratorsBody
              isAddModal={isAddModal}
              inputsValue={inputsValue}
              setInputsValue={setInputsValue}
            />
            <ModalFooter
              isAddModal={isAddModal}
              handleAddBot={handleAddBot}
              botName={MATCH_BOTS_NAMES.CURATORS}
              handleCloseModal={handleCancelModal}
              handleDeleteConfirmation={handleToggleModalDelete}
              handleEditConfirmation={handleOpenConfirmEditModal}
            />
          </Modal>
          {!isAddModal && (
            <React.Fragment>
              <Modal
                visible={isModalOpenConfirmDelete}
                onCancel={handleToggleModalDelete}
                title={intl.formatMessage({
                  id: 'match_bots_delete_confirmation',
                  defaultMessage: 'Delete confirmation',
                })}
                footer={null}
              >
                <ModalBodyDelete
                  name={bot.name}
                  type={MATCH_BOTS_NAMES.CURATORS}
                  handleDeleteBot={handleDeleteBot}
                  handleCloseModal={handleToggleModalDelete}
                />
              </Modal>
              <Modal
                onOk={handleEditRule}
                visible={isModalOpenConfirmEdit}
                onCancel={handleCloseModalEdit}
                title={intl.formatMessage({
                  id: 'matchBot_confirm_changes',
                  defaultMessage: 'Confirm changes',
                })}
              >
                <ModalBodyConfirm name={bot.name} />
              </Modal>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </div>
  );
};

ModalsCurators.propTypes = {
  intl: PropTypes.shape().isRequired,
  modalType: PropTypes.oneOf(['add', 'edit']).isRequired,
  addCuratorBot: PropTypes.func.isRequired,
  bot: PropTypes.shape().isRequired,
  deleteCuratorBot: PropTypes.func.isRequired,
};

export default injectIntl(ModalsCurators);

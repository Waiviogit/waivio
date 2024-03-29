import { Modal, message } from 'antd';
import * as React from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';

import MatchBotsBtn from '../../MatchBotsBtn';
import ModalFooter from '../common/ModalFooter';
import ModalAuthorsBody from '../ModalAuthorsBody';
import ModalBodyDelete from '../common/ModalBodyDelete';
import {
  getBotObjAuthor,
  setInitialInputValues,
  INITIAL_INPUTS_VALUE,
  MATCH_BOTS_NAMES,
} from '../../../../../common/helpers/matchBotsHelpers';
import ModalBodyConfirm from '../common/ModalBodyConfirm/ModalBodyConfirm';

const ModalsAuthors = ({ intl, modalType, addAuthorBot, bot, deleteAuthorBot }) => {
  const isAddModal = modalType === 'add';
  const [inputsValue, setInputsValue] = React.useState(INITIAL_INPUTS_VALUE);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isModalOpenConfirmDelete, setIsModalOpenConfirmDelete] = React.useState(false);
  const [isModalOpenConfirmEdit, setIsModalOpenConfirmEdit] = React.useState(false);

  React.useEffect(() => {
    if (!isModalOpen) setInputsValue(INITIAL_INPUTS_VALUE);
  }, [isModalOpen]);

  React.useEffect(() => {
    if (bot && isModalOpen) setInputsValue(setInitialInputValues(bot));
  }, [bot, isModalOpen]);

  const handleToggleModal = () => setIsModalOpen(prev => !prev);
  const handleToggleModalDelete = () => setIsModalOpenConfirmDelete(prev => !prev);
  const handleToggleModalEdit = () => setIsModalOpenConfirmEdit(prev => !prev);
  const handleAddBot = isEdit => {
    const ruleObj = getBotObjAuthor(inputsValue, isEdit);

    setInputsValue(prev => ({ ...prev, isSubmitted: true }));
    if (!isEmpty(ruleObj)) {
      addAuthorBot(ruleObj)
        .then(() =>
          message.success(
            intl.formatMessage({
              id: isEdit ? 'matchBot_success_updated_author' : 'matchBot_success_added_author',
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

  const handleEditRule = () => handleAddBot(true);
  const handleDeleteBot = () => {
    deleteAuthorBot(bot.name)
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

  return (
    <div>
      {isAddModal ? (
        <MatchBotsBtn
          onClick={handleToggleModal}
          name={intl.formatMessage({ id: 'matchBot_author_btn_add', defaultMessage: 'Add author' })}
        />
      ) : (
        <p onClick={handleToggleModal}>
          {intl.formatMessage({ id: 'edit', defaultMessage: 'Edit' })}
        </p>
      )}
      {isModalOpen && (
        <React.Fragment>
          <Modal
            footer={null}
            visible={isModalOpen}
            onCancel={handleToggleModal}
            title={
              isAddModal ? (
                <span>
                  {intl.formatMessage({
                    id: 'match_bots_add_author',
                    defaultMessage: 'Add new author',
                  })}
                </span>
              ) : (
                <span>
                  {intl.formatMessage({
                    id: 'matchBot_title_edit_rule_author',
                    defaultMessage: 'Edit match bot rules for author',
                  })}
                  <Link to={`/@${bot.name}`}>{` @${bot.name}`}</Link>
                </span>
              )
            }
          >
            <ModalAuthorsBody
              isAddModal={isAddModal}
              inputsValue={inputsValue}
              setInputsValue={setInputsValue}
              bot={bot}
            />
            <ModalFooter
              botName={MATCH_BOTS_NAMES.AUTHORS}
              isAddModal={isAddModal}
              handleAddBot={handleAddBot}
              handleCloseModal={handleToggleModal}
              handleDeleteConfirmation={handleToggleModalDelete}
              handleEditConfirmation={handleToggleModalEdit}
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
                  type={MATCH_BOTS_NAMES.AUTHORS}
                  handleCloseModal={handleToggleModalDelete}
                  handleDeleteBot={handleDeleteBot}
                />
              </Modal>
              <Modal
                onOk={handleEditRule}
                visible={isModalOpenConfirmEdit}
                onCancel={handleToggleModalEdit}
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

ModalsAuthors.propTypes = {
  intl: PropTypes.shape().isRequired,
  modalType: PropTypes.oneOf(['add', 'edit']).isRequired,
  addAuthorBot: PropTypes.func.isRequired,
  bot: PropTypes.shape().isRequired,
  deleteAuthorBot: PropTypes.func.isRequired,
};

export default injectIntl(ModalsAuthors);

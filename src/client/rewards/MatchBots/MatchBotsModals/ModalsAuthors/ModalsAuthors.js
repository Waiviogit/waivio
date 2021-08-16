import { Modal } from 'antd';
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
} from '../../../../helpers/matchBotsHelpers';
import ModalBodyConfirm from '../common/ModalBodyConfirm/ModalBodyConfirm';

const ModalsAuthors = ({ intl, modalType, addAuthorBot, bot, deleteAuthorBot }) => {
  const isAddModal = modalType === 'add';
  const [inputsValue, setInputsValue] = React.useState(INITIAL_INPUTS_VALUE);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isModalOpenConfirmDelete, setIsModalOpenConfirmDelete] = React.useState(false);
  const [isModalOpenConfirmEdit, setIsModalOpenConfirmEdit] = React.useState(false);

  React.useEffect(() => {
    if (bot) setInputsValue(setInitialInputValues(bot));
  }, []);
  const handleToggleModal = () => setIsModalOpen(prev => !prev);
  const handleToggleModalDelete = () => setIsModalOpenConfirmDelete(prev => !prev);
  const handleToggleModalEdit = () => setIsModalOpenConfirmEdit(prev => !prev);
  const handleAddBot = () => {
    const ruleObj = getBotObjAuthor(inputsValue);

    setInputsValue(prev => ({ ...prev, isSubmitted: true }));
    if (!isEmpty(ruleObj)) {
      addAuthorBot(ruleObj);
      setIsModalOpen(false);
      setIsModalOpenConfirmEdit(false);
    }
  };
  const handleDeleteBot = () => {
    deleteAuthorBot(bot.name);
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
        />
        <ModalFooter
          botName={'author'}
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
              handleCloseModal={handleToggleModalDelete}
              handleDeleteBot={handleDeleteBot}
            />
          </Modal>
          <Modal
            onOk={handleAddBot}
            visible={isModalOpenConfirmEdit}
            onCancel={handleToggleModalEdit}
            title={intl.formatMessage({ id: 'match_bots_delete_confirmation' })}
          >
            <ModalBodyConfirm name={bot.name} />
          </Modal>
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

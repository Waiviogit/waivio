import { Modal } from 'antd';
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
    if (bot) setInputsValue(setInitialInputValues(bot));
  }, []);
  const handleToggleModal = () => setIsModalOpen(prev => !prev);
  const handleToggleModalDelete = () => setIsModalOpenConfirmDelete(prev => !prev);
  const handleToggleModalEdit = () => setIsModalOpenConfirmEdit(prev => !prev);
  const handleAddBot = () => {
    const ruleObj = getBotObjCurator(inputsValue);

    setInputsValue(prev => ({ ...prev, isSubmitted: true }));
    if (!isEmpty(ruleObj)) {
      addCuratorBot(ruleObj);
      setIsModalOpen(false);
      setIsModalOpenConfirmEdit(false);
    }
  };
  const handleDeleteBot = () => {
    deleteCuratorBot(bot.name);
    setIsModalOpen(false);
    setIsModalOpenConfirmDelete(false);
  };

  return (
    <div>
      {isAddModal ? (
        <MatchBotsBtn
          onClick={handleToggleModal}
          name={intl.formatMessage({ id: 'matchBot_curator_btn_add' })}
        />
      ) : (
        <p onClick={handleToggleModal}>{intl.formatMessage({ id: 'edit' })}</p>
      )}
      <Modal
        footer={null}
        visible={isModalOpen}
        onCancel={handleToggleModal}
        title={
          isAddModal ? (
            intl.formatMessage({ id: `match_bots_${modalType}_curator` })
          ) : (
            <span>
              {intl.formatMessage({ id: 'matchBot_title_edit_rule_curator' })}
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
          botName="curator"
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
            title={intl.formatMessage({ id: 'match_bots_delete_confirmation' })}
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

ModalsCurators.propTypes = {
  intl: PropTypes.shape().isRequired,
  modalType: PropTypes.oneOf(['add', 'edit']).isRequired,
  addCuratorBot: PropTypes.func.isRequired,
  bot: PropTypes.shape().isRequired,
  deleteCuratorBot: PropTypes.func.isRequired,
};

export default injectIntl(ModalsCurators);

import { Modal } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { isEmpty } from 'lodash';

import MatchBotsBtn from '../../MatchBotsBtn';
import ModalAuthorsBody from '../ModalAuthorsBody';
import { getBotObjAuthor } from '../../../../helpers/matchBotsHelpers';

const INITIAL_INPUTS_VALUE = {
  selectedUser: null,
  voteValue: 100,
  manaValue: 100,
  expiredDate: null,
  notesValue: '',
  isSubmitted: false,
};

const ModalsAuthors = ({ intl, modalType, addAuthorBot }) => {
  const [inputsValue, setInputsValue] = React.useState(INITIAL_INPUTS_VALUE);
  const [isModalOpen, setIsModalOpen] = React.useState(true);
  const handleToggleModal = () => setIsModalOpen(prev => !prev);
  const handleClickOk = () => {
    const ruleObj = getBotObjAuthor(inputsValue);

    setInputsValue(prev => ({ ...prev, isSubmitted: true }));
    if (!isEmpty(ruleObj)) addAuthorBot(ruleObj);
  };

  return (
    <div>
      <MatchBotsBtn
        onClick={handleToggleModal}
        name={intl.formatMessage({ id: 'matchBot_authors_btn_add' })}
      />
      <Modal
        onOk={handleClickOk}
        visible={isModalOpen}
        onCancel={handleToggleModal}
        title={intl.formatMessage({ id: 'match_bots_add_new_author' })}
        okText={intl.formatMessage({ id: `matchBot_authors_btn_${modalType}` })}
      >
        <ModalAuthorsBody inputsValue={inputsValue} setInputsValue={setInputsValue} />
      </Modal>
    </div>
  );
};

ModalsAuthors.propTypes = {
  intl: PropTypes.shape().isRequired,
  modalType: PropTypes.string.isRequired,
  addAuthorBot: PropTypes.func.isRequired,
};

export default injectIntl(ModalsAuthors);

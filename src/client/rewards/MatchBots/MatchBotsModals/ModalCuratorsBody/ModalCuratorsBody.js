import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { debounce } from 'lodash';

import ModalBodyDate from '../common/ModalBodyDate';
import ModalBodyNotes from '../common/ModalBodyNotes';
import ModalBodySlider from '../common/ModalBodySlider';
import ModalBodyVoteRatio from '../common/ModalBodyVoteRatio';
import ModalBodySearch from '../common/ModalBodySearch/ModalBodySearch';
import ModalBodyCheckBox from '../common/ModalBodyCheckBox/ModalBodyCheckBox';

const ModalCuratorsBody = ({ intl, isAddModal, inputsValue, setInputsValue }) => {
  const handleChangeSliderMana = manaValue => setInputsValue(prev => ({ ...prev, manaValue }));
  const handleChangeDate = expiredDate => setInputsValue(prev => ({ ...prev, expiredDate }));
  const handleChangeNote = notesValue => setInputsValue(prev => ({ ...prev, notesValue }));
  const handleChangeVote = debounce(
    voteRatio => setInputsValue(prev => ({ ...prev, voteRatio })),
    200,
  );

  return (
    <div>
      {isAddModal && (
        <ModalBodySearch
          botType="curator"
          isSubmitted={inputsValue.isSubmitted}
          selectedUser={inputsValue.selectedUser}
          setInputsValue={setInputsValue}
        />
      )}
      <ModalBodyVoteRatio value={inputsValue.voteRatio} handleChangeVote={handleChangeVote} />
      <ModalBodyCheckBox
        type="isDownvote"
        textId="matchBot_curator_downvotes"
        value={inputsValue.isDownvote}
        setInputsValue={setInputsValue}
      />
      <ModalBodyCheckBox
        type="isComment"
        textId="matchBot_curator_comments"
        value={inputsValue.isComment}
        setInputsValue={setInputsValue}
      />
      <ModalBodySlider
        sliderValue={inputsValue.manaValue}
        handleChangeSlider={handleChangeSliderMana}
        sliderTitle={intl.formatMessage({ id: 'match_bot_slider_title_mana' })}
        sliderDescription={intl.formatMessage({ id: 'match_bot_slider_description_mana' })}
      />
      <ModalBodyDate onChange={handleChangeDate} value={inputsValue.expiredDate} />
      <ModalBodyNotes onChange={handleChangeNote} textAreaValue={inputsValue.notesValue} />
    </div>
  );
};

ModalCuratorsBody.propTypes = {
  intl: PropTypes.shape().isRequired,
  isAddModal: PropTypes.bool.isRequired,
  setInputsValue: PropTypes.func.isRequired,
  inputsValue: PropTypes.shape().isRequired,
};

export default injectIntl(ModalCuratorsBody);

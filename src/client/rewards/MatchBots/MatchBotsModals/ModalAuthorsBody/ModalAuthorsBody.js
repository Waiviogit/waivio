import * as React from 'react';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import ModalBodyDate from '../common/ModalBodyDate';
import ModalBodyNotes from '../common/ModalBodyNotes';
import ModalBodySlider from '../common/ModalBodySlider';
import ModalBodySearch from '../common/ModalBodySearch/ModalBodySearch';

import './ModalAuthorsBody.less';

const ModalAuthorsBody = ({ intl, inputsValue, setInputsValue, isAddModal }) => {
  const handleChangeSliderVote = value => setInputsValue(prev => ({ ...prev, voteValue: value }));
  const handleChangeSliderMana = value => setInputsValue(prev => ({ ...prev, manaValue: value }));
  const handleChangeDate = expiredDate => setInputsValue(prev => ({ ...prev, expiredDate }));
  const handleChangeNote = debounce(
    value => setInputsValue(prev => ({ ...prev, notesValue: value })),
    250,
  );

  return (
    <div className="authorModalBody">
      {isAddModal && (
        <ModalBodySearch
          isSubmitted={inputsValue.isSubmitted}
          selectedUser={inputsValue.selectedUser}
          setInputsValue={setInputsValue}
        />
      )}
      <ModalBodySlider
        sliderValue={inputsValue.voteValue}
        handleChangeSlider={handleChangeSliderVote}
        sliderTitle={intl.formatMessage({ id: 'match_bot_slider_title_vote' })}
        sliderDescription={intl.formatMessage({ id: 'match_bot_slider_description_vote' })}
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

ModalAuthorsBody.propTypes = {
  intl: PropTypes.shape().isRequired,
  inputsValue: PropTypes.shape().isRequired,
  setInputsValue: PropTypes.func.isRequired,
  isAddModal: PropTypes.bool.isRequired,
};

export default injectIntl(ModalAuthorsBody);

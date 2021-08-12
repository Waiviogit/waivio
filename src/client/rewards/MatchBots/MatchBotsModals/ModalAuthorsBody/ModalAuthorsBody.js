import * as React from 'react';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import ModalBodyDate from '../common/ModalBodyDate';
import ModalBodyNotes from '../common/ModalBodyNotes';
import ModalBodySlider from '../common/ModalBodySlider';
import ModalBodySearch from '../common/ModalBodySearch/ModalBodySearch';

import './ModalAuthorsBody.less';

const ModalAuthorsBody = ({ intl, inputsValue, setInputsValue }) => {
  const handleChangeSliderVote = value => setInputsValue(prev => ({ ...prev, voteValue: value }));
  const handleChangeSliderMana = value => setInputsValue(prev => ({ ...prev, manaValue: value }));
  const handleChangeDate = value =>
    setInputsValue(prev => ({ ...prev, expiredDate: value.format() }));
  const handleChangeNote = debounce(
    value => setInputsValue(prev => ({ ...prev, notesValue: value })),
    250,
  );

  return (
    <div className="authorModalBody">
      <ModalBodySearch
        isSubmitted={inputsValue.isSubmitted}
        selectedUser={inputsValue.selectedUser}
        setInputsValue={setInputsValue}
      />
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
      <ModalBodyDate onChange={handleChangeDate} />
      <ModalBodyNotes onChange={handleChangeNote} />
    </div>
  );
};

ModalAuthorsBody.propTypes = {
  intl: PropTypes.shape().isRequired,
  inputsValue: PropTypes.shape().isRequired,
  setInputsValue: PropTypes.func.isRequired,
};

export default injectIntl(ModalAuthorsBody);

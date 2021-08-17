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
  const handleChangeDate = expiredAt => setInputsValue(prev => ({ ...prev, expiredAt }));
  const handleChangeNote = notesValue => setInputsValue(prev => ({ ...prev, notesValue }));
  const handleChangeVote = debounce(
    voteRatio => setInputsValue(prev => ({ ...prev, voteRatio, isSubmitted: false })),
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
      <ModalBodyVoteRatio
        value={inputsValue.voteRatio}
        handleChangeVote={handleChangeVote}
        isSubmitted={inputsValue.isSubmitted}
      />
      <ModalBodyCheckBox
        type="isDownvote"
        textId="matchBot_curator_downvotes"
        value={inputsValue.isDownvote}
        setInputsValue={setInputsValue}
      />
      <ModalBodyCheckBox
        type="isComments"
        textId="matchBot_curator_comments"
        value={inputsValue.isComments}
        setInputsValue={setInputsValue}
      />
      <ModalBodySlider
        sliderValue={inputsValue.manaValue}
        handleChangeSlider={handleChangeSliderMana}
        sliderTitle={intl.formatMessage({
          id: 'match_bot_slider_title_mana',
          defaultMessage: 'Min Voting Power (mana):',
        })}
        sliderDescription={intl.formatMessage({
          id: 'match_bot_slider_description_mana',
          defaultMessage:
            'Votes will only be processed if the VP on the account is greater than the specified threshold at the time of voting (typically, 5 min after the post is published).',
        })}
      />
      <ModalBodyDate onChange={handleChangeDate} value={inputsValue.expiredAt} />
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

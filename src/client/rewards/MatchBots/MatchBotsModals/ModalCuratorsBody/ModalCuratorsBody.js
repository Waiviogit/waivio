import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { debounce, get } from 'lodash';

import ModalBodyDate from '../common/ModalBodyDate';
import ModalBodyNotes from '../common/ModalBodyNotes';
import ModalBodySlider from '../common/ModalBodySlider';
import ModalBodyVoteRatioRadio from '../common/ModalBodyVoteRatioRadio/ModalBodyVoteRatioRadio';
import { MATCH_BOTS_NAMES } from '../../../../../common/helpers/matchBotsHelpers';
import ModalBodySearch from '../common/ModalBodySearch/ModalBodySearch';
import ModalBodyCheckBox from '../common/ModalBodyCheckBox/ModalBodyCheckBox';
import {
  cryptoCurrencyListForSlider,
  currencyListForSliderValues,
} from '../../../../../common/constants/cryptos';

const ModalCuratorsBody = ({ intl, isAddModal, inputsValue, setInputsValue, bot }) => {
  const handleChangeSliderMana = manaValue => setInputsValue(prev => ({ ...prev, manaValue }));
  const handleChangeDate = expiredAt => setInputsValue(prev => ({ ...prev, expiredAt }));
  const handleChangeNote = notesValue => setInputsValue(prev => ({ ...prev, notesValue }));
  const handleChangeCurrency = value =>
    setInputsValue(prev => ({
      ...prev,
      minVotingPowerCurrencies: currencyListForSliderValues[value],
    }));

  const handleChangeVote = debounce((value, fieldType) => {
    if (fieldType === 'voteWeight') {
      setInputsValue(prev => ({ ...prev, voteWeight: value, voteRatio: null, isSubmitted: false }));
    } else if (fieldType === 'voteRatio') {
      setInputsValue(prev => ({ ...prev, voteRatio: value, voteWeight: null, isSubmitted: false }));
    }
  }, 200);

  return (
    <div>
      {isAddModal && (
        <ModalBodySearch
          botType={MATCH_BOTS_NAMES.CURATORS}
          isSubmitted={inputsValue.isSubmitted}
          selectedUser={inputsValue.selectedUser}
          setInputsValue={setInputsValue}
        />
      )}
      <ModalBodyVoteRatioRadio
        voteWeight={inputsValue.voteWeight}
        voteRatio={inputsValue.voteRatio}
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
      <ModalBodyCheckBox
        type="lastMomentVote"
        textId="matchBot_curator_vote"
        value={inputsValue.lastMomentVote}
        setInputsValue={setInputsValue}
      />
      <ModalBodySlider
        sliderValue={inputsValue.manaValue}
        handleChangeSlider={handleChangeSliderMana}
        sliderTitle={intl.formatMessage({
          id: 'match_bot_slider_title_mana',
          defaultMessage: 'Min. Voting Power (mana):',
        })}
        sliderDescription={intl.formatMessage({
          id: 'match_bot_slider_description_mana_curator',
          defaultMessage:
            'Votes will only be processed if the VP on the account is greater than the specified threshold at the time of voting.',
        })}
        selectOptions={cryptoCurrencyListForSlider}
        handleChangeCurrency={handleChangeCurrency}
        currency={get(bot, 'minVotingPowerCurrencies')}
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
  bot: PropTypes.shape().isRequired,
};

export default injectIntl(ModalCuratorsBody);

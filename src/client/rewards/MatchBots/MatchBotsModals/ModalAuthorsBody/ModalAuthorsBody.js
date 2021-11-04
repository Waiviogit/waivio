import * as React from 'react';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import ModalBodyDate from '../common/ModalBodyDate';
import ModalBodyNotes from '../common/ModalBodyNotes';
import ModalBodySlider from '../common/ModalBodySlider';
import ModalBodySearch from '../common/ModalBodySearch/ModalBodySearch';
import { MATCH_BOTS_NAMES } from '../../../../helpers/matchBotsHelpers';
import {
  cryptoCurrencyListForSlider,
  currencyListForSliderValues,
} from '../../../../../common/constants/cryptos';

import './ModalAuthorsBody.less';

const ModalAuthorsBody = ({ intl, inputsValue, setInputsValue, isAddModal, bot }) => {
  const handleChangeSliderVote = value => setInputsValue(prev => ({ ...prev, voteValue: value }));
  const handleChangeSliderMana = value => setInputsValue(prev => ({ ...prev, manaValue: value }));
  const handleChangeDate = expiredAt => setInputsValue(prev => ({ ...prev, expiredAt }));
  const handleChangeCurrency = value =>
    setInputsValue(prev => ({
      ...prev,
      minVotingPowerCurrencies: currencyListForSliderValues[value],
    }));

  const handleChangeNote = debounce(
    value => setInputsValue(prev => ({ ...prev, notesValue: value })),
    250,
  );

  return (
    <div className="authorModalBody">
      {isAddModal && (
        <ModalBodySearch
          botType={MATCH_BOTS_NAMES.AUTHORS}
          isSubmitted={inputsValue.isSubmitted}
          selectedUser={inputsValue.selectedUser}
          setInputsValue={setInputsValue}
        />
      )}
      <ModalBodySlider
        sliderValue={inputsValue.voteValue}
        handleChangeSlider={handleChangeSliderVote}
        sliderTitle={intl.formatMessage({
          id: 'match_bot_slider_title_vote',
          defaultMessage: 'Specify the value for the vote:',
        })}
        sliderDescription={intl.formatMessage({
          id: 'match_bot_slider_description_vote',
          defaultMessage:
            'The Authors match bot only publishes upvotes with estimated value of 0.01 HBD or more.',
        })}
      />
      <ModalBodySlider
        sliderValue={inputsValue.manaValue}
        handleChangeSlider={handleChangeSliderMana}
        sliderTitle={intl.formatMessage({
          id: 'match_bot_slider_title_mana',
          defaultMessage: 'Min. Voting Power (mana):',
        })}
        sliderDescription={intl.formatMessage({
          id: 'match_bot_slider_description_mana',
          defaultMessage:
            'Votes will only be processed if the VP on the account is greater than the specified threshold at the time of voting (typically, 5 min after the post is published).',
        })}
        selectOptions={cryptoCurrencyListForSlider}
        handleChangeCurrency={handleChangeCurrency}
        currency={bot.minVotingPowerCurrencies}
      />
      <ModalBodyDate onChange={handleChangeDate} value={inputsValue.expiredAt} />
      <ModalBodyNotes onChange={handleChangeNote} textAreaValue={inputsValue.notesValue} />
    </div>
  );
};

ModalAuthorsBody.propTypes = {
  intl: PropTypes.shape().isRequired,
  inputsValue: PropTypes.shape().isRequired,
  setInputsValue: PropTypes.func.isRequired,
  isAddModal: PropTypes.bool.isRequired,
  bot: PropTypes.shape().isRequired,
};

export default injectIntl(ModalAuthorsBody);

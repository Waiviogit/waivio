import { Input, Radio } from 'antd';
import { get } from 'lodash';
import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import './ModalBodyVoteRatioRadio.less';

const ModalBodyVoteRatioRadio = ({
  intl,
  voteWeight,
  voteRatio,
  handleChangeVote,
  isSubmitted,
}) => {
  const [voteType, setVoteType] = React.useState('absolute');
  const [absoluteValue, setAbsoluteValue] = React.useState('100');
  const [proportionalValue, setProportionalValue] = React.useState('100');

  React.useEffect(() => {
    if (voteWeight !== null && voteWeight !== undefined && voteRatio === null) {
      setVoteType('absolute');
      setAbsoluteValue(voteWeight.toString());
    } else if (voteRatio !== null && voteRatio !== undefined && voteWeight === null) {
      setVoteType('proportional');
      setProportionalValue(voteRatio.toString());
    }
  }, []);

  React.useEffect(() => {
    if (voteWeight !== null && voteWeight !== undefined) {
      setAbsoluteValue(voteWeight.toString());
    }
  }, [voteWeight]);

  React.useEffect(() => {
    if (voteRatio !== null && voteRatio !== undefined) {
      setProportionalValue(voteRatio.toString());
    }
  }, [voteRatio]);

  const handleTypeChange = event => {
    const newType = event.target.value;

    setVoteType(newType);

    const currentValue = newType === 'absolute' ? absoluteValue : proportionalValue;
    const fieldType = newType === 'absolute' ? 'voteWeight' : 'voteRatio';

    handleChangeVote(currentValue, fieldType);
  };

  const handleAbsoluteChange = event => {
    const valueInput = get(event, 'target.value', '');

    if (+valueInput <= 100) {
      setAbsoluteValue(valueInput);
      if (voteType === 'absolute') {
        handleChangeVote(valueInput, 'voteWeight');
      }
    }
  };

  const handleProportionalChange = event => {
    const valueInput = get(event, 'target.value', '');

    if (+valueInput <= 10000) {
      setProportionalValue(valueInput);
      if (voteType === 'proportional') {
        handleChangeVote(valueInput, 'voteRatio');
      }
    }
  };

  const handleKeyDown = event => {
    if (event.key === '-' || (!event.target.value && event.key === '0')) {
      event.preventDefault();
    }
  };

  return (
    <div className="voteRatioRadio">
      <div className="voteRatioRadio_options">
        <Radio.Group value={voteType} onChange={handleTypeChange}>
          <div className="voteRatioRadio_option">
            <Radio value="absolute">
              <span className="voteRatioRadio_option__label">
                {intl.formatMessage({
                  id: 'matchBot_curator_absolute_vote_ratio',
                  defaultMessage: 'Absolute vote ratio (1%-100%)',
                })}
              </span>
            </Radio>
            <Input
              type="number"
              value={absoluteValue}
              onKeyDown={handleKeyDown}
              onChange={handleAbsoluteChange}
              className="voteRatioRadio_option__input"
              disabled={voteType !== 'absolute'}
            />
            <span>%</span>
          </div>

          <div className="voteRatioRadio_option">
            <Radio value="proportional">
              <span className="voteRatioRadio_option__label">
                {intl.formatMessage({
                  id: 'matchBot_curator_proportional_vote_ratio',
                  defaultMessage: 'Proportional vote ratio (1%-10000%)',
                })}
              </span>
            </Radio>
            <Input
              type="number"
              value={proportionalValue}
              onKeyDown={handleKeyDown}
              onChange={handleProportionalChange}
              className="voteRatioRadio_option__input"
              disabled={voteType !== 'proportional'}
            />
            <span>%</span>
          </div>
        </Radio.Group>
      </div>

      {!voteWeight && !voteRatio && isSubmitted && (
        <span className="modalBodySearch-error">
          {intl.formatMessage({
            id: 'matchBot_voteRatio_validation',
            defaultMessage: 'Vote ratio is invalid',
          })}
        </span>
      )}

      <p className="voteRatioRadio_description">
        {intl.formatMessage({
          id: 'matchBot_curator_vote_ratio_msg',
          defaultMessage:
            'The Curators match bot only publishes votes with estimated value of 0.01 HBD or more.',
        })}
      </p>
    </div>
  );
};

ModalBodyVoteRatioRadio.propTypes = {
  intl: PropTypes.shape().isRequired,
  voteWeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  voteRatio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleChangeVote: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool,
};

ModalBodyVoteRatioRadio.defaultProps = {
  voteWeight: null,
  voteRatio: null,
  isSubmitted: false,
};

export default injectIntl(ModalBodyVoteRatioRadio);

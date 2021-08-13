import { Input } from 'antd';
import { get } from 'lodash';
import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import './ModalBodyVoteRatio.less';

const ModalBodyVoteRatio = ({ intl, value, handleChangeVote }) => {
  const [voteValue, setVoteValue] = React.useState('');

  React.useEffect(() => {
    setVoteValue(value);
  }, []);
  const handleChange = event => {
    const valueInput = get(event, 'target.value', '');

    if (+valueInput <= 1000) {
      setVoteValue(valueInput);
      handleChangeVote(prev => ({ ...prev, voteRatio: valueInput }));
    }
  };

  const handleKeyDown = event => {
    if (event.key === '-' || (!voteValue && event.key === '0')) {
      event.preventDefault();
    }
  };

  return (
    <div className="voteRatio">
      <div className="voteRatio_content fw5">
        <span className="voteRatio_content__msg">
          {intl.formatMessage({ id: 'matchBot_curator_vote_ratio' })}
        </span>
        <Input
          min={1}
          type="number"
          value={voteValue}
          pattern="^[1-9]\d*$"
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          className="voteRatio_content__input"
        />
        <span>%</span>
      </div>
      <p className="voteRatio_description">
        {intl.formatMessage({ id: 'matchBot_curator_vote_ratio_msg' })}
      </p>
    </div>
  );
};

ModalBodyVoteRatio.propTypes = {
  intl: PropTypes.shape().isRequired,
  value: PropTypes.string.isRequired,
  handleChangeVote: PropTypes.func.isRequired,
};

export default injectIntl(ModalBodyVoteRatio);

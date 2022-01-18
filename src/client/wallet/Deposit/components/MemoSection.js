import React from 'react';
import PropTypes from 'prop-types';

import '../Deposit.less';

const MemoSection = ({ memo }) => (
  <p className={'Deposit__section'}>
    <h4>
      Memo <span style={{ color: 'red' }}>(required field)</span>:
    </h4>
    <p className={'Deposit__input'}>{memo}</p>
    <p>Attention: Failure to specify the memo will result in loss of funds!</p>
  </p>
);

MemoSection.propTypes = {
  memo: PropTypes.string.isRequired,
};

export default MemoSection;

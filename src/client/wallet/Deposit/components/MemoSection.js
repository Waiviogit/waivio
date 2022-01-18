import React from 'react';
import PropTypes from 'prop-types';
import CopyButton from '../../../widgets/CopyButton/CopyButton';

import '../Deposit.less';

const MemoSection = ({ memo }) => (
  <p className={'Deposit__section'}>
    <h4>
      Memo <span style={{ color: 'red' }}>(required field)</span>:
    </h4>
    <CopyButton className="Deposit__input" text={memo} />
    <p>Attention: Failure to specify the memo will result in loss of funds!</p>
  </p>
);

MemoSection.propTypes = {
  memo: PropTypes.string.isRequired,
};

export default MemoSection;

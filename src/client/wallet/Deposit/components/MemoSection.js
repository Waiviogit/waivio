import { Input } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';

import '../Deposit.less';

const MemoSection = ({ memo }) => (
  <div className={'Deposit__section'}>
    <h4>
      Memo <span style={{ color: 'red' }}>(required field)</span>
    </h4>
    <Input className={'Deposit__input'} value={memo} />
    <p>Attention: Failure to specify the memo will result in loss of funds!</p>
  </div>
);

MemoSection.propTypes = {
  memo: PropTypes.string.isRequired,
};

export default MemoSection;

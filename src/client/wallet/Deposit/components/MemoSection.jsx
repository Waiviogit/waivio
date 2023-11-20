import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import CopyButton from '../../../widgets/CopyButton/CopyButton';
import '../Deposit.less';

const MemoSection = ({ memo }) => (
  <p className={'Deposit__section'}>
    <h4>
      <FormattedMessage id="memo" defaultMessage="Memo" />{' '}
      <span style={{ color: 'red' }}>
        {' '}
        (<FormattedMessage id="required_field" defaultMessage="required field" />)
      </span>
      :
    </h4>
    <CopyButton className="Deposit__input" text={memo} />
    <p>
      <FormattedMessage
        id="memo_attention"
        defaultMessage="Attention: Failure to specify the memo will result in loss of funds!"
      />
    </p>
  </p>
);

MemoSection.propTypes = {
  memo: PropTypes.string.isRequired,
};

export default MemoSection;

import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import './PolicyConfirmation.less';

const PolicyConfirmation = props => {
  const { checkboxLabel, policyText, onChange } = props;
  const handleChange = e => {
    onChange(e.target.checked);
  };
  return (
    <div className="policy-confirmation">
      <Checkbox onChange={handleChange}>{checkboxLabel}</Checkbox>
      <div className="policy-confirmation__text">{policyText}</div>
    </div>
  );
};

PolicyConfirmation.propTypes = {
  checkboxLabel: PropTypes.string,
  policyText: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

PolicyConfirmation.defaultProps = {
  checkboxLabel: 'Checkbox',
  policyText: '',
};

export default PolicyConfirmation;

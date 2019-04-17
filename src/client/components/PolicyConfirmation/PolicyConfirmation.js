import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Checkbox } from 'antd';
import './PolicyConfirmation.less';

const PolicyConfirmation = props => {
  const { checkboxLabel, policyText, onChange, className } = props;
  const handleChange = e => {
    onChange(e.target.checked);
  };
  return (
    <div className={classNames('policy-confirmation', { [className]: Boolean(className) })}>
      <Checkbox onChange={handleChange}>{checkboxLabel}</Checkbox>
      <div className="policy-confirmation__text">{policyText}</div>
    </div>
  );
};

PolicyConfirmation.propTypes = {
  checkboxLabel: PropTypes.string,
  policyText: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

PolicyConfirmation.defaultProps = {
  checkboxLabel: 'Checkbox',
  policyText: '',
  className: '',
};

export default PolicyConfirmation;

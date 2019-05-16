import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Checkbox } from 'antd';
import './PolicyConfirmation.less';

const PolicyConfirmation = props => {
  const { isChecked, checkboxLabel, policyText, onChange, className, disabled } = props;
  const handleChange = e => {
    onChange(e.target.checked);
  };
  return (
    <div className={classNames('policy-confirmation', { [className]: Boolean(className) })}>
      <Checkbox checked={isChecked} onChange={handleChange} disabled={disabled}>
        {checkboxLabel}
      </Checkbox>
      <div className="policy-confirmation__text">{policyText}</div>
    </div>
  );
};

PolicyConfirmation.propTypes = {
  isChecked: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  checkboxLabel: PropTypes.string,
  policyText: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

PolicyConfirmation.defaultProps = {
  disabled: false,
  checkboxLabel: 'Checkbox',
  policyText: '',
  className: '',
};

export default PolicyConfirmation;

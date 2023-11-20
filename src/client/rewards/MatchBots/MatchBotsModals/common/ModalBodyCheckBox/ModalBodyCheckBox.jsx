import { Checkbox } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import './ModalBodyCheckBox.less';

const ModalBodyCheckBox = ({ intl, textId, setInputsValue, value, type }) => {
  const handleChange = event => {
    setInputsValue(prev => ({ ...prev, [type]: event.target.checked }));
  };

  return (
    <div className="modalCheckbox">
      <Checkbox checked={value} onChange={handleChange}>
        <span className="fw5">{intl.formatMessage({ id: textId })}</span>
      </Checkbox>
    </div>
  );
};

ModalBodyCheckBox.propTypes = {
  type: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired,
  intl: PropTypes.shape().isRequired,
  textId: PropTypes.string.isRequired,
  setInputsValue: PropTypes.func.isRequired,
};

export default injectIntl(ModalBodyCheckBox);

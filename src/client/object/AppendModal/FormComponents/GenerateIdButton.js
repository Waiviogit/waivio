import React from 'react';
import PropTypes from 'prop-types';

const GenerateIdButton = ({ field, setFieldsValue }) => {
  const generateId = () => {
    const id = self.crypto.randomUUID();

    setFieldsValue({ [field]: id });
  };

  return (
    <span className={'main-color-button'} onClick={generateId}>
      Need an ID?
    </span>
  );
};

GenerateIdButton.propTypes = {
  field: PropTypes.string.isRequired,
  setFieldsValue: PropTypes.func.isRequired,
};

export default GenerateIdButton;

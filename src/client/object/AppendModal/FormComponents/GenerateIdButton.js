import React from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';

const GenerateIdButton = ({ field, setFieldsValue }) => {
  const generateId = () => {
    const id = self.crypto.randomUUID();

    setFieldsValue({ [field]: id });
  };

  return (
    <Button type={'primary'} onClick={generateId}>
      Generate ID
    </Button>
  );
};

GenerateIdButton.propTypes = {
  field: PropTypes.string.isRequired,
  setFieldsValue: PropTypes.func.isRequired,
};

export default GenerateIdButton;

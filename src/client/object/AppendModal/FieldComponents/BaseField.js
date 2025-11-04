import React from 'react';
import { Form } from 'antd';
import PropTypes from 'prop-types';

const BaseField = ({
  fieldName,
  getFieldDecorator,
  rules,
  initialValue,
  children,
  valuePropName,
  ...formItemProps
}) => (
  <Form.Item {...formItemProps}>
    {getFieldDecorator(fieldName, {
      rules,
      ...(initialValue !== undefined && { initialValue }),
    })(children)}
  </Form.Item>
);

BaseField.propTypes = {
  fieldName: PropTypes.string.isRequired,
  getFieldDecorator: PropTypes.func.isRequired,
  rules: PropTypes.arrayOf(PropTypes.shape()),
  initialValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.object,
    PropTypes.array,
  ]),
  children: PropTypes.node.isRequired,
  valuePropName: PropTypes.string,
};

BaseField.defaultProps = {
  rules: [],
  initialValue: undefined,
  valuePropName: undefined,
};

export default BaseField;

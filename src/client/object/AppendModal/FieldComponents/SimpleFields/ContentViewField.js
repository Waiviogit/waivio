import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import { objectFields } from '../../../../../common/constants/listOfFields';
import BaseField from '../BaseField';

const { Option } = Select;

// Функція для перетворення значення Select в об'єкт
const transformValueToObject = (value) => {
  switch (value) {
    case 'show_both':
      return { hideSignIn: false, hideMenu: false };
    case 'hide_signin':
      return { hideSignIn: true, hideMenu: false };
    case 'hide_menu':
      return { hideSignIn: false, hideMenu: true };
    case 'hide_both':
      return { hideSignIn: true, hideMenu: true };
    default:
      return { hideSignIn: false, hideMenu: false };
  }
};

// Функція для перетворення об'єкта в значення Select
const transformObjectToValue = (obj) => {
  if (!obj || typeof obj !== 'object') return 'show_both';
  
  const { hideSignIn, hideMenu } = obj;
  
  if (hideSignIn && hideMenu) return 'hide_both';
  if (hideSignIn && !hideMenu) return 'hide_signin';
  if (!hideSignIn && hideMenu) return 'hide_menu';
  return 'show_both';
};

const ContentViewField = ({ getFieldDecorator, loading, getFieldRules, intl }) => {
  // Створюємо кастомний компонент, який перетворює значення
  const CustomSelect = (props) => (
    <Select
      {...props}
      className="AppendForm__input"
      disabled={loading}
      placeholder={intl.formatMessage({
        id: 'content_view_placeholder',
        defaultMessage: 'Select content view type',
      })}
      onChange={(value) => {
        // Перетворюємо значення Select в об'єкт і передаємо його в Form
        const transformedValue = transformValueToObject(value);
        console.log('Transforming value:', value, 'to object:', transformedValue)

        return value;
      }}
    >
      <Option value="show_both">Sign in + Main menu</Option>
      <Option value="hide_signin">Hide Sign In</Option>
      <Option value="hide_menu">Hide Menu</Option>
      <Option value="hide_both">Hide Both</Option>
    </Select>
  );

  return (
    <BaseField
      fieldName={objectFields.contentView}
      getFieldDecorator={getFieldDecorator}
      rules={getFieldRules(objectFields.contentView)}
      initialValue={transformValueToObject('show_both')}
    >
      <CustomSelect />
    </BaseField>
  );
};

ContentViewField.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  getFieldRules: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

ContentViewField.defaultProps = {
  loading: false,
};

export default React.memo(ContentViewField);

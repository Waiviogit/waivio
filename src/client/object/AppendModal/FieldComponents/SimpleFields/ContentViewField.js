import React from 'react';
import { Select, Form } from 'antd';
import PropTypes from 'prop-types';
import { objectFields } from '../../../../../common/constants/listOfFields';

const { Option } = Select;

export const transformValueToObject = value => {
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

const ContentViewField = ({ getFieldDecorator, getFieldRules, intl, handleSelectChange }) => (
  <Form.Item>
    <div className="NewsFiltersRule-title AppendForm__appendTitles">
      {intl.formatMessage({
        id: 'header',
        defaultMessage: 'Header',
      })}
    </div>
    {getFieldDecorator(objectFields.contentView, {
      rules: getFieldRules(objectFields.contentView),
    })(
      <Select
        placeholder={intl.formatMessage({
          id: 'content_view_placeholder',
          defaultMessage: 'Select content view type',
        })}
        onChange={handleSelectChange}
      >
        <Option value="show_both">Sign in + Main menu</Option>
        <Option value="hide_signin">Sign In</Option>
        <Option value="hide_menu">Menu</Option>
      </Select>,
    )}
    <div>
      {intl.formatMessage({
        id: 'note_add_display_headers',
        defaultMessage: 'Add display of sign in and main site menu to the site page.',
      })}
    </div>
  </Form.Item>
);

ContentViewField.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  getFieldRules: PropTypes.func.isRequired,
  handleSelectChange: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

ContentViewField.defaultProps = {
  loading: false,
};

export default ContentViewField;

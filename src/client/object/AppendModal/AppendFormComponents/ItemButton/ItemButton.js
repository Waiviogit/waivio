import React from 'react';
import { Form, Input } from 'antd';
import classNames from 'classnames';
import { buttonFields } from '../../../../../common/constants/listOfFields';

const ItemButton = (getFieldDecorator, getFieldRules, isSomeValue, loading, intl) => (
  <React.Fragment>
    <Form.Item>
      {getFieldDecorator(buttonFields.title, {
        rules: getFieldRules('buttonTitle'),
      })(
        <Input
          className={classNames('AppendForm__input', {
            'validation-error': !isSomeValue,
          })}
          disabled={loading}
          placeholder={intl.formatMessage({
            id: 'title_website_placeholder',
            defaultMessage: 'Title',
          })}
        />,
      )}
    </Form.Item>
    <Form.Item>
      {getFieldDecorator(buttonFields.link, {
        rules: getFieldRules('buttonFields.link'),
      })(
        <Input
          className={classNames('AppendForm__input', {
            'validation-error': !this.state.isSomeValue,
          })}
          disabled={loading}
          placeholder={intl.formatMessage({
            id: 'profile_website',
            defaultMessage: 'Website',
          })}
        />,
      )}
    </Form.Item>
  </React.Fragment>
);
export default ItemButton;

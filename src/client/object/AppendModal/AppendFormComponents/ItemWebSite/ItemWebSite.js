import React from 'react';
import classNames from 'classnames';
import { Form, Input } from 'antd';
import { websiteFields } from '../../../../../common/constants/listOfFields';

const ItemWebSite = (getFieldDecorator, getFieldRules, isSomeValue, loading, intl) => (
  <React.Fragment>
    <Form.Item>
      {getFieldDecorator(websiteFields.title, {
        rules: getFieldRules('websiteFields.title'),
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
      {getFieldDecorator(websiteFields.link, {
        rules: getFieldRules('websiteFields.link'),
      })(
        <Input
          className={classNames('AppendForm__input', {
            'validation-error': !isSomeValue,
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
export default ItemWebSite;

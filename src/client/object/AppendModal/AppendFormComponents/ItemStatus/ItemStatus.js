import React from 'react';
import { Form, Input, Select } from 'antd';
import classNames from 'classnames';
import { statusFields } from '../../../../../common/constants/listOfFields';

const ItemStatus = (getFieldDecorator, getFieldRules, isSomeValue, statusTitle, intl, loading) => (
  <React.Fragment>
    <Form.Item>
      {getFieldDecorator(statusFields.title, {
        rules: getFieldRules('buttonFields.title'),
      })(
        <Select placeholder="Select a current status">
          <Select.Option value="unavailable">
            {intl.formatMessage({
              id: 'unavailable',
              defaultMessage: 'Unavailable',
            })}
          </Select.Option>
          <Select.Option value="relisted">
            {intl.formatMessage({
              id: 'relisted',
              defaultMessage: 'Relisted',
            })}
          </Select.Option>
          <Select.Option value="nsfw">
            {intl.formatMessage({
              id: 'append_form_NSFW',
              defaultMessage: 'NSFW (not safe for work)',
            })}
          </Select.Option>
          <Select.Option value="flagged">
            {intl.formatMessage({
              id: 'append_form_flagged',
              defaultMessage: 'Flagged',
            })}
          </Select.Option>
        </Select>,
      )}
    </Form.Item>
    {statusTitle === 'relisted' ? (
      <Form.Item>
        {getFieldDecorator(statusFields.link, {
          rules: getFieldRules('buttonFields.link'),
        })(
          <Input
            className={classNames('AppendForm__input', {
              'validation-error': !isSomeValue,
            })}
            disabled={loading}
            placeholder={intl.formatMessage({
              id: 'link',
              defaultMessage: 'Link',
            })}
          />,
        )}
      </Form.Item>
    ) : null}
  </React.Fragment>
);
export default ItemStatus;

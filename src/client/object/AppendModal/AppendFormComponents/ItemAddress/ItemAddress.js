import React from 'react';
import { Form, Input } from 'antd';
import classNames from 'classnames';
import { addressFields } from '../../../../../common/constants/listOfFields';

const ItemAddress = (
  getFieldDecorator,
  getFieldRules,
  isSomeValue,
  loading,
  intl,
  combinedFieldValidationMsg,
) => (
  <React.Fragment>
    <Form.Item>
      {getFieldDecorator(addressFields.address, {
        rules: getFieldRules(addressFields.address),
      })(
        <Input
          className={classNames('AppendForm__input', {
            'validation-error': !isSomeValue,
          })}
          disabled={loading}
          placeholder={intl.formatMessage({
            id: 'location_accommodation',
            defaultMessage: 'Accommodation',
          })}
        />,
      )}
    </Form.Item>
    <Form.Item>
      {getFieldDecorator(addressFields.street, {
        rules: getFieldRules(addressFields.street),
      })(
        <Input
          className={classNames('AppendForm__input', {
            'validation-error': !isSomeValue,
          })}
          disabled={loading}
          placeholder={intl.formatMessage({
            id: 'location_street',
            defaultMessage: 'Street',
          })}
        />,
      )}
    </Form.Item>
    <Form.Item>
      {getFieldDecorator(addressFields.city, {
        rules: getFieldRules(addressFields.city),
      })(
        <Input
          className={classNames('AppendForm__input', {
            'validation-error': !isSomeValue,
          })}
          disabled={loading}
          placeholder={intl.formatMessage({
            id: 'location_city',
            defaultMessage: 'City',
          })}
        />,
      )}
    </Form.Item>
    <Form.Item>
      {getFieldDecorator(addressFields.state, {
        rules: getFieldRules(addressFields.state),
      })(
        <Input
          className={classNames('AppendForm__input', {
            'validation-error': !isSomeValue,
          })}
          disabled={loading}
          placeholder={intl.formatMessage({
            id: 'stateProvince',
            defaultMessage: 'State/Province',
          })}
        />,
      )}
    </Form.Item>
    <Form.Item>
      {getFieldDecorator(addressFields.postalCode, {
        rules: getFieldRules(addressFields.postalCode),
      })(
        <Input
          className={classNames('AppendForm__input', {
            'validation-error': !isSomeValue,
          })}
          disabled={loading}
          placeholder={intl.formatMessage({
            id: 'postalCode',
            defaultMessage: 'Postal code',
          })}
        />,
      )}
    </Form.Item>
    <Form.Item>
      {getFieldDecorator(addressFields.country, {
        rules: getFieldRules(addressFields.country),
      })(
        <Input
          className={classNames('AppendForm__input', {
            'validation-error': !isSomeValue,
          })}
          disabled={loading}
          placeholder={intl.formatMessage({
            id: 'location_country',
            defaultMessage: 'Country',
          })}
        />,
      )}
    </Form.Item>
    {combinedFieldValidationMsg}
  </React.Fragment>
);
export default ItemAddress;

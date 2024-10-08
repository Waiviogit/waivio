import React from 'react';
import { Form, Input } from 'antd';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { companyIdFields, objectFields } from '../../../../common/constants/listOfFields';
import GenerateIdButton from './GenerateIdButton';

const CompanyIdForm = ({
  getFieldDecorator,
  getFieldRules,
  loading,
  intl,
  isSomeValue,
  setFieldsValue,
}) => (
  <React.Fragment>
    <Form.Item>
      {getFieldDecorator(companyIdFields.companyIdType, {
        rules: getFieldRules(objectFields.companyIdType),
      })(
        <Input
          className={classNames('AppendForm__input', {
            'validation-error': !isSomeValue,
          })}
          disabled={loading}
          placeholder={intl.formatMessage({
            id: 'company_id_type',
            defaultMessage: 'Company ID type',
          })}
        />,
      )}
    </Form.Item>
    <p>
      {intl.formatMessage({
        id: 'company_id_type_description',
        defaultMessage:
          'There are many global and national databases of companies and they use different types of identification numbers, for example DUNS, UBI, Easynumber, EBR, LEI and many more.',
      })}
    </p>
    <br />
    <Form.Item>
      {getFieldDecorator(companyIdFields.companyId, {
        rules: getFieldRules(objectFields.companyId),
      })(
        <Input
          className={classNames('AppendForm__input', {
            'validation-error': !isSomeValue,
          })}
          disabled={loading}
          placeholder={intl.formatMessage({
            id: 'company_id',
            defaultMessage: 'Company ID',
          })}
        />,
      )}
    </Form.Item>
    <p className={'flex justify-between'}>
      {intl.formatMessage({
        id: 'company_id_description',
        defaultMessage:
          'Company identifiers are often alphanumeric, but there are no limitations on this text field.',
      })}
      <GenerateIdButton field={objectFields.companyId} setFieldsValue={setFieldsValue} />
    </p>
  </React.Fragment>
);

CompanyIdForm.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  getFieldRules: PropTypes.func.isRequired,
  setFieldsValue: PropTypes.func.isRequired,
  isSomeValue: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(CompanyIdForm);

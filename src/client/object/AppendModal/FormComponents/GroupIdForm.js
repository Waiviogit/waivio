import React from 'react';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form, Input } from 'antd';
import PropTypes from 'prop-types';
import { objectFields } from '../../../../common/constants/listOfFields';
import GenerateIdButton from './GenerateIdButton';

const GroupIdForm = ({
  getFieldDecorator,
  loading,
  getFieldRules,
  intl,
  isBookType,
  isSomeValue,
  setFieldsValue,
}) => (
  <>
    <Form.Item>
      {getFieldDecorator(objectFields.groupId, {
        rules: getFieldRules(objectFields.groupId),
      })(
        <Input
          autoFocus
          className={classNames('AppendForm__input', {
            'validation-error': !isSomeValue,
          })}
          disabled={loading}
          placeholder={intl.formatMessage({
            id: 'object_field_groupId',
            defaultMessage: 'Group ID',
          })}
        />,
      )}
    </Form.Item>
    <p>
      {isBookType ? (
        <FormattedMessage
          id="groupId_book_info"
          defaultMessage="Products with multiple options (format etc.) can be saved as separate objects with their own descriptions, photo galleries, prices, etc. However, if all these objects refer to the same group ID, all these options will be combined into a single presentation for the convenience of the user."
        />
      ) : (
        <FormattedMessage
          id="groupId_info"
          defaultMessage="Products with multiple options (colors, sizes, configurations, etc.) can be saved as separate objects with their own descriptions, photo galleries, prices, etc. However, if all these objects refer to the same group ID, all these options will be combined into a single presentation for the convenience of the user."
        />
      )}
      <div className={'generateId-container'}>
        <GenerateIdButton field={objectFields.groupId} setFieldsValue={setFieldsValue} />
      </div>
    </p>
  </>
);

GroupIdForm.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  getFieldRules: PropTypes.func.isRequired,
  setFieldsValue: PropTypes.func.isRequired,
  isSomeValue: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  isBookType: PropTypes.bool.isRequired,
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(GroupIdForm);

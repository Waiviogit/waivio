import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
import { featuresFields } from '../../../../common/constants/listOfFields';

function ObjectFeaturesForm({ loading, intl, getFieldDecorator, getFieldRules, isSomeValue }) {
  return (
    <React.Fragment>
      <Form.Item>
        {getFieldDecorator(featuresFields.name, {
          rules: getFieldRules(featuresFields.name),
        })(
          <Input
            className={classNames('AppendForm__input', {
              'validation-error': !isSomeValue,
            })}
            disabled={loading}
            placeholder={intl.formatMessage({
              id: 'name',
              defaultMessage: 'Name',
            })}
          />,
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator(featuresFields.value, {
          rules: getFieldRules(featuresFields.value),
        })(
          <Input
            className={classNames('AppendForm__input', {
              'validation-error': !isSomeValue,
            })}
            disabled={loading}
            placeholder={intl.formatMessage({
              id: 'value',
              defaultMessage: 'Value',
            })}
          />,
        )}
      </Form.Item>
    </React.Fragment>
  );
}

ObjectFeaturesForm.propTypes = {
  intl: PropTypes.shape().isRequired,
  loading: PropTypes.bool.isRequired,
  isSomeValue: PropTypes.bool.isRequired,
  getFieldRules: PropTypes.func.isRequired,
  getFieldDecorator: PropTypes.func.isRequired,
};

export default ObjectFeaturesForm;

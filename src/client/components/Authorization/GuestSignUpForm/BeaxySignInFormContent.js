import React from 'react';
import { Button, Form, Input } from 'antd';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

const BeaxySignInFormContent = ({ form }) => {
  const { getFieldDecorator, getFieldsError } = form;

  const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

  const handleSubmit = () => {
    alert('Submitted');
  };

  return (
    <Form layout="vertical" style={{ width: '100%' }}>
      <Form.Item
        label={<FormattedMessage id="authorizationForm.emailPlaceholder" defaultMessage="Email" />}
      >
        {getFieldDecorator('email', {
          rules: [
            {
              type: 'email',
              message: (
                <FormattedMessage
                  id="tooltip.emailValid"
                  defaultMessage="Please enter a valid email"
                />
              ),
            },
            {
              required: true,
              message: (
                <FormattedMessage
                  id="authForm_validation_email_required"
                  defaultMessage="Please input your E-mail"
                />
              ),
            },
          ],
        })(<Input />)}
      </Form.Item>
      <Form.Item
        label={
          <FormattedMessage id="authorizationForm.passwordPlaceholder" defaultMessage="Password" />
        }
      >
        {getFieldDecorator('password', {
          rules: [
            {
              required: true,
              message: (
                <FormattedMessage
                  id="authForm_validation_password_required"
                  defaultMessage="Please input your password"
                />
              ),
            },
          ],
        })(<Input.Password />)}
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={handleSubmit} disabled={hasErrors(getFieldsError())}>
          <FormattedMessage id="login" defaultMessage="Log in" />
        </Button>
      </Form.Item>
    </Form>
  );
};

BeaxySignInFormContent.propTypes = {
  form: PropTypes.shape().isRequired,
};

export default BeaxySignInFormContent;

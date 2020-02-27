import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { beaxyLogin } from '../../../auth/authActions';
import { beaxy2FALogin, beaxyLoginByCredentials } from '../../../../waivioApi/ApiClient';

const BeaxySignInFormContent = ({ form }) => {
  const dispatch = useDispatch();
  const { getFieldDecorator, getFieldsError, validateFields } = form;

  // state
  const [token2FA, setToken2FA] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        if (!token2FA) {
          setIsLoading(true);
          beaxyLoginByCredentials(values.email, values.password)
            .then(res => {
              const { code, status, bxySessionData, userData, token, expiration, umSession } = res;
              if (code === 321 && status === 'TWO_FA_VERIFICATION_NEEDED') {
                setToken2FA(bxySessionData.token2fa);
              } else {
                dispatch(
                  beaxyLogin({ user: userData, token, expiration }, { ...bxySessionData, umSession }),
                );
              }
              setAuthError(null);
            })
            .catch(error => {
              const errMessage = error.message === 'Unauthorized' ? 'invalid_credentials' : 'server_error';
              setAuthError(errMessage);
              console.log('\tlogin error: ', error && error.message);
            })
            .finally(() => setIsLoading(false));
        } else {
          setIsLoading(true);
          beaxy2FALogin(values.email, token2FA, values.authCode)
            .then(
              res => {
                const { bxySessionData, userData, token, expiration, umSession } = res;
                setAuthError(null);
                dispatch(
                  beaxyLogin({ user: userData, token, expiration, umSession }, bxySessionData),
                );
              },
              error => {
                const errMessage = error.message === 'Unauthorized' ? 'two_FA_error' : 'server_error';
                setAuthError(errMessage);
                console.log('\t2FA error', error && error.message);
              },
            )
            .finally(() => setIsLoading(false));
        }
      }
    });
  };

  return (
    <React.Fragment>
      <div className="auth-form-error-msg">
        {Boolean(authError) && (
          <FormattedMessage id={`authForm_${authError}`} defaultMessage="Invalid credentials" />
        )}
      </div>
      <Form
        className="bxy-sing-in-form"
        layout="vertical"
        style={{ width: '100%' }}
        onSubmit={handleSubmit}
      >
        <Form.Item
          className="bxy-sing-in-form__mail"
          label={
            <FormattedMessage id="authorizationForm.emailPlaceholder" defaultMessage="Email" />
          }
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
          })(<Input disabled={!!token2FA} />)}
        </Form.Item>
        <Form.Item
          className="bxy-sing-in-form__pwd"
          label={
            <FormattedMessage
              id="authorizationForm.passwordPlaceholder"
              defaultMessage="Password"
            />
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
          })(<Input.Password disabled={!!token2FA} />)}
        </Form.Item>

        <Form.Item
          className={classNames('signInAuthCode', { hide: !token2FA })}
          label={
            <FormattedMessage id="authForm_two_FA_code" defaultMessage="Authentication code" />
          }
        >
          {getFieldDecorator('authCode', {
            rules: [
              {
                pattern: /^-?[0-9]*(\.[0-9]*)?$/,
                message: 'only numbers',
              },
            ],
          })(<Input maxLength={6} />)}
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            disabled={hasErrors(getFieldsError())}
          >
            <FormattedMessage id="login" defaultMessage="Log in" />
          </Button>
        </Form.Item>
      </Form>
    </React.Fragment>
  );
};

BeaxySignInFormContent.propTypes = {
  form: PropTypes.shape().isRequired,
};

export default BeaxySignInFormContent;

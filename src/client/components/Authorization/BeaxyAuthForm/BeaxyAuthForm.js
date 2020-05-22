import React, { useState } from 'react';
import { Button, Form, Icon, Input, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { attempt, get, isError } from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
import iconsSvg from '../../../../common/constants/svgIcons';
import { getFollowingObjects } from '../../../user/userActions';
import { getIsAuthenticated } from '../../../reducers';
import './BeaxyAuthForm.less';

const BeaxyAuthForm = ({
  form,
  firstLoginResponse,
  authRequest,
  auth2FARequest,
  btnText,
  onAuthSuccessAction,
  intl,
  hideForm,
  hasSingInParent,
}) => {
  const dispatch = useDispatch();
  const { getFieldDecorator, getFieldsError, validateFields, setFieldsValue } = form;

  // state
  const [token2FA, setToken2FA] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const isAuthUser = useSelector(getIsAuthenticated);

  const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

  const hideBeaxyForm = () => {
    hideForm();
  };

  const onAuthInputChange = () => {
    setAuthError(null);
  };

  const clearAuthCodeField = () => {
    setToken2FA(null);
    onAuthInputChange();
    setFieldsValue({ authCode: '' });
  };

  const handleAuthSuccess = response => {
    const { payload, user, token, expiration, umSession } = response;

    if (!isAuthUser) dispatch(getFollowingObjects(user.name));
    if (get(user, ['user_metadata', 'new_user'], false)) {
      const userJsonMetadata = attempt(JSON.parse, user.json_metadata);
      firstLoginResponse({
        userData: { user, token, expiration },
        bxySessionData: { ...payload, umSession },
        jsonMetadata: isError(userJsonMetadata) ? {} : userJsonMetadata,
        userName: user.name,
        displayName: user.alias,
      });
    } else {
      dispatch(onAuthSuccessAction({ user, token, expiration }, { ...payload, umSession }));
    }

    setTimeout(
      () =>
        message.success(
          intl.formatMessage({
            id: 'broker_modal_broker_connected_successfully',
            defaultMessage: 'Beaxy connection established successfully',
          }),
        ),
      1000,
    );
  };

  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        if (!token2FA) {
          setIsLoading(true);
          authRequest(values.email, values.password)
            .then(async res => {
              if (res.code === 321 && res.status === 'TWO_FA_VERIFICATION_NEEDED') {
                setToken2FA(res.payload.token2fa);
              } else {
                handleAuthSuccess(res);
              }
              setAuthError(null);
            })
            .catch(error => {
              const errMessage =
                error.message === 'Unauthorized' ? 'invalid_credentials' : error.message;
              setAuthError(errMessage);
              console.log('\tlogin error: ', error && error.message);
            })
            .finally(() => setIsLoading(false));
        } else {
          setIsLoading(true);
          setAuthError(null);
          auth2FARequest(values.email, token2FA, values.authCode)
            .then(
              res => {
                handleAuthSuccess(res);
              },
              error => {
                const errMessage =
                  error.message === 'TWO_FA_CODE_ERROR' ? 'two_FA_error' : 'server_error';
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
    <div className="bxy-sing-in-form">
      {hasSingInParent && (
        <div className="bxy-sing-in-form__back-icon">
          <Icon type="arrow-left" onClick={hideBeaxyForm} />
        </div>
      )}
      <div className="bxy-sing-in-form__logo">{iconsSvg.beaxy}</div>
      <div className="bxy-sing-in-form__error-msg">
        {Boolean(authError) && (
          <FormattedMessage id={`authForm_${authError}`} defaultMessage="Login error" />
        )}
      </div>
      <Form
        form={form}
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

        {
          <Form.Item
            className={classNames('signInAuthCode', { hide: !token2FA })}
            label={
              <FormattedMessage id="authForm_two_FA_code" defaultMessage="Authentication code" />
            }
          >
            {getFieldDecorator('authCode', {
              rules: [
                {
                  required: !!token2FA,
                  pattern: /^-?[0-9]*(\.[0-9]*)?$/,
                  message: 'only numbers',
                },
              ],
            })(
              <Input
                addonAfter={<Icon type="close" theme="outlined" onClick={clearAuthCodeField} />}
                maxLength={6}
                onChange={onAuthInputChange}
              />,
            )}
          </Form.Item>
        }

        <Form.Item className="mb1">
          <Button
            block
            type="primary"
            htmlType="submit"
            loading={isLoading}
            disabled={hasErrors(getFieldsError()) || authError}
          >
            {btnText || <FormattedMessage id="login" defaultMessage="Log in" />}
          </Button>
        </Form.Item>
        <Form.Item className={classNames('bxy-sing-in-form__condition mb1', { hide: !!token2FA })}>
          <FormattedMessage id="or" defaultMessage="or" />
        </Form.Item>
        <Form.Item className={classNames({ hide: !!token2FA })}>
          <a href="https://beaxy.com/register/">
            <Button block type="primary">
              <FormattedMessage id="signup" defaultMessage="Sign up" />
            </Button>
          </a>
        </Form.Item>
      </Form>
    </div>
  );
};

BeaxyAuthForm.propTypes = {
  authRequest: PropTypes.func.isRequired,
  auth2FARequest: PropTypes.func.isRequired,
  onAuthSuccessAction: PropTypes.func.isRequired,
  firstLoginResponse: PropTypes.func.isRequired,
  form: PropTypes.shape().isRequired,
  btnText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  intl: PropTypes.shape().isRequired,
  hasSingInParent: PropTypes.bool,
  hideForm: PropTypes.func,
};

BeaxyAuthForm.defaultProps = {
  btnText: '',
  hasSingInParent: false,
  hideForm: () => {},
};

export default Form.create({ name: 'username' })(injectIntl(BeaxyAuthForm));

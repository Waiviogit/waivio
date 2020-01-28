import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import getSlug from 'speakingurl';
import { GUEST_PREFIX } from '../../../../common/constants/waivio';
import { getUserAccount } from '../../../../waivioApi/ApiClient';
import { login } from '../../../auth/authActions';
import { notify } from '../../../app/Notification/notificationActions';

const GuestSignUpForm = ({ form, userData, isModalOpen }) => {
  const {
    getFieldDecorator,
    getFieldsError,
    getFieldError,
    isFieldTouched,
    validateFields,
    setFieldsValue,
  } = form;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userData.socialNetwork === 'facebook') {
      setFieldsValue({
        username: getSlug(userData.name).slice(0, 16),
      });
    } else {
      setFieldsValue({
        username: getSlug(
          `${userData.profileObj.givenName} ${userData.profileObj.familyName}`,
        ).slice(0, 16),
      });
    }
  }, [userData]);

  useEffect(() => {
    if (!isModalOpen) {
      setFieldsValue({ username: '' });
      setIsLoading(false);
    }
  }, [isModalOpen]);

  const dispatch = useDispatch();

  const validateUserName = async (rule, value, callback) => {
    if (value.length >= 25) {
      callback(
        <FormattedMessage
          id="name_is_too_long"
          defaultMessage="Name is too long (map 25 symbols)"
        />,
      );
    }
    // if (value.trim().length === 0)
    //   callback(< FormattedMessage id='please_input_username' defaultMessage='Please input your username' />);
    const user = await getUserAccount(`${GUEST_PREFIX}${value}`);
    if (user.id) {
      callback(
        <FormattedMessage
          id="already_exists"
          defaultMessage="User with such username already exists"
        />,
      );
    }
    callback();
  };

  const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

  const usernameError = isFieldTouched('username') && getFieldError('username');

  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        setIsLoading(true);
        dispatch(
          login(userData.accessToken, userData.socialNetwork, {
            userName: `${GUEST_PREFIX}${values.username}`,
            pickSocialFields: values.agreement,
          }),
        ).then(() => {
          setIsLoading(false);
        });
      } else {
        dispatch(notify(`${err.username.errors[0].message}`, 'error'));
        setIsLoading(false);
      }
    });
  };

  return (
    <Form layout="vertical" onSubmit={handleSubmit} className="mt3">
      <Form.Item validateStatus={usernameError ? 'error' : ''} help={usernameError || ''}>
        {getFieldDecorator('username', {
          rules: [
            {
              required: true,
              message: (
                <FormattedMessage
                  id="please_input_username"
                  defaultMessage="Please input your username"
                />
              ),
            },
            {
              pattern: /^[A-Za-z0-9.-]+$/,
              message: (
                <FormattedMessage
                  id="only_letters"
                  defaultMessage="Only letters, digits, periods, dashes are allowed"
                />
              ),
            },
            {
              validator: validateUserName,
            },
          ],
        })(
          <Input placeholder="Username" addonBefore={GUEST_PREFIX} minLength={3} maxLength={16} />,
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('picture', {
          rules: [],
        })()}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('agreement', {
          initialValue: true,
          valuePropName: 'checked',
        })(
          <Checkbox>
            <FormattedMessage
              id="iAgreePostMyData"
              defaultMessage="I agree to post my public data into the blockchain"
            />
          </Checkbox>,
        )}
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          disabled={hasErrors(getFieldsError())}
          loading={isLoading}
        >
          <FormattedMessage id="signup" defaultMessage="Sign up" />
        </Button>
      </Form.Item>
    </Form>
  );
};

GuestSignUpForm.propTypes = {
  form: PropTypes.shape().isRequired,
  userData: PropTypes.shape().isRequired,
  isModalOpen: PropTypes.bool.isRequired,
};

export default Form.create({ name: 'user_name' })(GuestSignUpForm);

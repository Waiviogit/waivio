import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input, Select } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';
import getSlug from 'speakingurl';
import { GUEST_PREFIX } from '../../../../common/constants/waivio';
import { getUserAccount } from '../../../../waivioApi/ApiClient';
import { login } from '../../../auth/authActions';
import { notify } from '../../../app/Notification/notificationActions';
import LANGUAGES from '../../../translations/languages';
import { getLanguageText } from '../../../translations';
import { getLocale } from '../../../reducers';
import ImageSetter from '../../ImageSetter/ImageSetter';
import './GuestSignUpForm.less';

const GuestSignUpForm = ({ form, userData, isModalOpen }) => {
  const {
    getFieldDecorator,
    getFieldsError,
    getFieldError,
    // isFieldTouched,
    validateFields,
    setFieldsValue,
  } = form;

  let initialLanguages = useSelector(getLocale, shallowEqual);
  initialLanguages = initialLanguages === 'auto' ? 'en-US' : initialLanguages;

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
    if (value.trim().length === 0)
      callback(
        <FormattedMessage id="please_input_username" defaultMessage="Please input your username" />,
      );
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
        dispatch(notify(`${err.username.errors[0].message.props.defaultMessage}`, 'error'));
        setIsLoading(false);
      }
    });
  };

  const getAvatar = image => {
    setFieldsValue({ avatar: image });
  };

  const usernameError = getFieldError('username');
  const aliasError = getFieldError('alias');
  const agreementError = getFieldError('agreement');

  return (
    <React.Fragment>
      <h2 className="ModalSignUp__title">
        <FormattedMessage id="public_profile" defaultMessage="Public profile" />
      </h2>
      <Form layout="vertical" onSubmit={handleSubmit}>
        <Form.Item
          validateStatus={usernameError ? 'error' : 'success'}
          help={usernameError || ''}
          label={<FormattedMessage id="nickname" defaultMessage="Nickname" />}
        >
          {getFieldDecorator('username', {
            rules: [
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="please_input_nickname"
                    defaultMessage="Nickname cannot be empty"
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
            <Input
              placeholder="Enter nickname"
              addonBefore={`@${GUEST_PREFIX}`}
              minLength={3}
              maxLength={16}
            />,
          )}
        </Form.Item>

        <Form.Item>
          {getFieldDecorator('avatar')(
            <ImageSetter
              onImageLoaded={getAvatar}
              onLoadingImage={setIsLoading}
              defaultImage={userData.w3.Paa}
            />,
          )}
        </Form.Item>

        <Form.Item
          validateStatus={aliasError ? 'error' : ''}
          help={aliasError || ''}
          label={<FormattedMessage id="profile_name" defaultMessage="name" />}
        >
          {getFieldDecorator('alias', {
            rules: [
              {
                message: (
                  <FormattedMessage
                    id="please_input_username"
                    defaultMessage="Name cannot be empty"
                  />
                ),
              },
              {
                pattern: /^[\sA-Za-z0-9.-]{0,64}$/,
                message: (
                  <FormattedMessage
                    id="only_letters"
                    defaultMessage="Only letters, digits, periods, dashes are allowed"
                  />
                ),
              },
            ],
          })(<Input placeholder="Enter username" maxLength={64} />)}
        </Form.Item>

        <Form.Item
          label={<FormattedMessage id="preferred_languages" defaultMessage="Preferred Languages" />}
        >
          {getFieldDecorator('locales', {
            initialValue: initialLanguages,
          })(
            <Select mode="multiple" style={{ width: '100%' }}>
              {LANGUAGES.map(lang => (
                <Select.Option key={lang.id} value={lang.id}>
                  {getLanguageText(lang)}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>

        <Form.Item
          validateStatus={agreementError ? 'error' : ''}
          help={agreementError || ''}
          label={<FormattedMessage id="rewards_details_legal" defaultMessage="Legal" />}
        >
          {getFieldDecorator('agreement', {
            checked: false,
            valuePropName: 'checked',
            rules: [
              {
                required: true,
                message: (
                  <FormattedMessage
                    id="please_input_username_"
                    defaultMessage="You need to confirm agreement"
                  />
                ),
              },
            ],
          })(
            <Checkbox>
              <FormattedMessage
                id="terms_and_policy_agreement"
                defaultMessage="I have read and agree to the {Terms} , the {Privacy}, the {Cookies}."
                values={{
                  Terms: (
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href="https://www.waivio.com/object/ylr-waivio/menu#oxa-legal/xrj-terms-and-conditions"
                    >
                      Terms And Conditions
                    </a>
                  ),
                  Privacy: (
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href="https://www.waivio.com/object/ylr-waivio/menu#oxa-legal/poi-privacy-policy"
                    >
                      Privacy Policy
                    </a>
                  ),
                  Cookies: (
                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href="https://www.waivio.com/object/ylr-waivio/menu#oxa-legal/uid-cookies-policy"
                    >
                      Cookies Policy
                    </a>
                  ),
                }}
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
    </React.Fragment>
  );
};

GuestSignUpForm.propTypes = {
  form: PropTypes.shape().isRequired,
  userData: PropTypes.shape().isRequired,
  isModalOpen: PropTypes.bool.isRequired,
};

export default Form.create({ name: 'username' })(GuestSignUpForm);

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Checkbox, Form, Input, Select } from 'antd';
import PropTypes from 'prop-types';
import { GUEST_PREFIX } from '../../../../common/constants/waivio';
import ImageSetter from '../../ImageSetter/ImageSetter';
import LANGUAGES from '../../../translations/languages';
import { getLanguageText } from '../../../translations';

const GuestSignUpFormContent = ({
  getFieldDecorator,
  getFieldsError,
  getFieldError,
  isLoading,
  validateUserName,
  checkboxValidator,
  hasErrors,
  handleSubmit,
  getAvatar,
  setIsLoading,
  image,
  initialLanguages,
}) => {
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
            // todo: get prefix by app
            <Input placeholder="Enter nickname" addonBefore={`@${GUEST_PREFIX}`} maxLength={16} />,
          )}
        </Form.Item>

        <Form.Item>
          {getFieldDecorator('avatar')(
            <ImageSetter
              onImageLoaded={getAvatar}
              onLoadingImage={setIsLoading}
              defaultImage={image}
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
            rules: [
              {
                required: true,
                message: ' ',
              },
              {
                validator: checkboxValidator,
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

GuestSignUpFormContent.propTypes = {
  getFieldDecorator: PropTypes.func,
  getFieldsError: PropTypes.func,
  getFieldError: PropTypes.func,
  isLoading: PropTypes.bool,
  validateUserName: PropTypes.func,
  checkboxValidator: PropTypes.func,
  hasErrors: PropTypes.func,
  handleSubmit: PropTypes.func,
  getAvatar: PropTypes.func,
  setIsLoading: PropTypes.func,
  image: PropTypes.string,
  initialLanguages: PropTypes.string,
};

GuestSignUpFormContent.defaultProps = {
  getFieldDecorator: () => {},
  getFieldsError: () => {},
  getFieldError: () => {},
  isLoading: false,
  validateUserName: () => {},
  checkboxValidator: () => {},
  hasErrors: () => {},
  handleSubmit: () => {},
  getAvatar: () => {},
  setIsLoading: () => {},
  image: '',
  initialLanguages: 'en-US',
};

export default GuestSignUpFormContent;

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Icon, Input, Button, Checkbox } from 'antd';
import { isEmpty } from 'lodash';
import { batch, useDispatch } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import getSlug from 'speakingurl';
import { busyLogin, login } from '../../../auth/authActions';
import { getUserAccount, isUserRegistered } from '../../../../waivioApi/ApiClient';
import { notify } from './../../../app/Notification/notificationActions';
import './ModalSignUp.less';
import { getFollowing, getFollowingObjects, getNotifications } from '../../../user/userActions';
import { GUEST_PREFIX } from '../../../../common/constants/waivio';

const ModalSignUp = ({ isButton, form, intl }) => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({});

  const {
    getFieldDecorator,
    getFieldsError,
    getFieldError,
    isFieldTouched,
    validateFields,
    setFieldsValue,
  } = form;

  const responseGoogle = async response => {
    if (response) {
      const res = await isUserRegistered(response.googleId, 'google');
      if (res) {
        dispatch(login(response.accessToken, 'google')).then(() => {
          batch(() => {
            dispatch(getFollowing());
            dispatch(getFollowingObjects());
            dispatch(getNotifications());
            dispatch(busyLogin());
          });
        });
      } else {
        setFieldsValue({
          username: getSlug(`${response.profileObj.givenName} ${response.profileObj.familyName}`),
        });
        setUserData({ ...response, socialNetwork: 'google' });
      }
    }
  };

  const responseFacebook = async response => {
    if (response) {
      const res = await isUserRegistered(response.id, 'facebook');
      if (res) {
        dispatch(login(response.accessToken, 'facebook')).then(() => {
          batch(() => {
            dispatch(getFollowing());
            dispatch(getFollowingObjects());
            dispatch(getNotifications());
            dispatch(busyLogin());
          });
        });
      } else {
        setFieldsValue({
          username: getSlug(response.name),
        });
        setUserData({ ...response, socialNetwork: 'facebook' });
      }
    }
  };
  const getSignUpInfo = (
    <div className="SignUpCard">
      <div className="SignUpCard__line">
        <a target="_blank" rel="noopener noreferrer" href={process.env.SIGNUP_URL}>
          <img
            alt="linkLogo"
            src="https://cdn.steemitimages.com/DQmernVC8CUupAFckxvE62oMYVJNAsK8YDLmyBzJnNLzH7S/steemit.png"
          />
        </a>
      </div>
      <div className="SignUpCard__line">
        <FormattedMessage id="newSteemAcc" defaultMessage="Account with wallet" />
      </div>
      <div className="SignUpCard__line">
        <FormattedMessage id="longerWaiting" defaultMessage="Waiting time up to 2 weeks" />
      </div>
      <div className="SignUpCard__line">
        <FormattedMessage id="emailAndPhoneReq" defaultMessage="Email and Phone Required" />
      </div>
      <a target="_blank" rel="noopener noreferrer" href={process.env.SIGNUP_URL}>
        <FormattedMessage id="signup" defaultMessage="Sign up" />
      </a>
    </div>
  );

  const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        dispatch(
          login(userData.accessToken, userData.socialNetwork, {
            userName: `${GUEST_PREFIX}${values.username}`,
            pickSocialFields: values.agreement,
          }),
        );
      } else {
        dispatch(notify(`${err.username.errors[0].message}`, 'error'));
      }
    });
  };

  const usernameError = isFieldTouched('username') && getFieldError('username');

  const validateUserName = async (rule, value, callback) => {
    if (value.length >= 25)
      callback(
        `${intl.formatMessage({
          id: 'name_is_too_long',
          defaultMessage: 'Name is too long (map 25 symbols)',
        })}`,
      );
    if (value.trim().length === 0)
      callback(
        `${intl.formatMessage({
          id: 'please_input_username',
          defaultMessage: 'Please input your username',
        })}`,
      );
    const user = await getUserAccount(`${GUEST_PREFIX}${value}`);
    if (user.id) {
      callback(
        `${intl.formatMessage({
          id: 'already_exists',
          defaultMessage: 'User with such username already exists',
        })}`,
      );
    }
    callback();
  };

  const nameForm = (
    <Form layout="vertical" onSubmit={handleSubmit} className="mt3">
      <Form.Item validateStatus={usernameError ? 'error' : ''} help={usernameError || ''}>
        {getFieldDecorator('username', {
          rules: [
            {
              required: true,
              message: `${intl.formatMessage({
                id: 'please_input_username',
                defaultMessage: 'Please input your username',
              })}`,
            },
            {
              pattern: /^[A-Za-z0-9.-]$/,
              message: `${intl.formatMessage({
                id: 'only_letters',
                defaultMessage: 'Only letters, digits, periods, dashes are allowed',
              })}`,
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
        {getFieldDecorator('agreement', {
          initialValue: true,
          valuePropName: 'checked',
        })(<Checkbox>I agree to post my public data into blockchain</Checkbox>)}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
          <FormattedMessage id="signup" defaultMessage="Sign up" />
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <React.Fragment>
      {isButton ? (
        <button onClick={() => setIsModalOpen(true)} className="ModalSignUp__button">
          <FormattedMessage id="signup" defaultMessage="Sign up" />
        </button>
      ) : (
        <a role="presentation" onClick={() => setIsModalOpen(true)}>
          <FormattedMessage id="signup" defaultMessage="Sign up" />
        </a>
      )}
      <Modal
        width={416}
        title=""
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <div className="ModalSignUp">
          <h2 className="ModalSignUp__title">
            <FormattedMessage id="signup" defaultMessage="Sign up" />
          </h2>
          {getSignUpInfo}
          <div className="ModalSignUp__social">
            <div className="ModalSignUp__subtitle">
              <FormattedMessage id="or_sign_up_with" defaultMessage="Or sign up with" />:
            </div>
            <GoogleLogin
              buttonText="Google"
              clientId="623736583769-qlg46kt2o7gc4kjd2l90nscitf38vl5t.apps.googleusercontent.com"
              onSuccess={responseGoogle}
              cookiePolicy={'single_host_origin'}
              onFailure={() => {}}
              className="ModalSignUp__social-btn"
            />
            <FacebookLogin
              appId="754038848413420"
              autoLoad={false}
              fields="name,email,picture"
              callback={responseFacebook}
              onFailure={() => {}}
              textButton="Facebook"
              cssClass="ModalSignUp__social-btn ModalSignUp__social-btn--fb"
              icon={<Icon type="facebook" className="ModalSignUp__icon-fb" />}
            />
          </div>
          {!isEmpty(userData) && nameForm}
        </div>
      </Modal>
    </React.Fragment>
  );
};

ModalSignUp.propTypes = {
  intl: PropTypes.shape().isRequired,
  isButton: PropTypes.bool.isRequired,
  form: PropTypes.shape().isRequired,
};

export default Form.create({ name: 'user_name' })(injectIntl(ModalSignUp));

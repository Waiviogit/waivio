import React, { useEffect, useState } from 'react';
import { Form } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import getSlug from 'speakingurl';
import { GUEST_PREFIX } from '../../../../common/constants/waivio';
import { getUserAccount } from '../../../../waivioApi/ApiClient';
import { login } from '../../../../store/authStore/authActions';
import { notify } from '../../../app/Notification/notificationActions';
import GuestSignUpFormContent from './GuestSignUpFormContent';
import { getIsWaivio } from '../../../../store/appStore/appSelectors';
import { getLocale } from '../../../../store/settingsStore/settingsSelectors';

import './GuestSignUpForm.less';

const GuestSignUpForm = ({ form, userData, isModalOpen, url }) => {
  const { getFieldDecorator, getFieldsError, getFieldError, validateFields, setFieldsValue } = form;
  const isWaivio = useSelector(getIsWaivio);

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

  const checkboxValidator = (rule, value, callback) => {
    if (value) {
      callback();
    } else {
      callback(
        <FormattedMessage
          id="need_confirm_agreement"
          defaultMessage="You need to confirm agreement"
        />,
      );
    }
  };

  const hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        setIsLoading(true);
        const regData = {
          userName: `${GUEST_PREFIX}${values.username}`,
          avatar: isEmpty(values.avatar) ? '' : values.avatar[0].src,
          alias: values.alias || '',
          locales: typeof values.locales === 'string' ? [values.locales] : values.locales,
          allowEmail: values.allow,
        };

        dispatch(login(userData.accessToken, userData.socialNetwork, regData)).then(() => {
          setIsLoading(false);

          if (!isWaivio && url) {
            window.location.href = `https://${url}/?access_token=${userData.accessToken}&socialProvider=${userData.socialNetwork}`;
          }
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

  return (
    <GuestSignUpFormContent
      getFieldDecorator={getFieldDecorator}
      getFieldsError={getFieldsError}
      getFieldError={getFieldError}
      isLoading={isLoading}
      validateUserName={validateUserName}
      checkboxValidator={checkboxValidator}
      hasErrors={hasErrors}
      handleSubmit={handleSubmit}
      getAvatar={getAvatar}
      setIsLoading={setIsLoading}
      image={userData.image}
      initialLanguages={initialLanguages}
    />
  );
};

GuestSignUpForm.propTypes = {
  form: PropTypes.shape().isRequired,
  userData: PropTypes.shape().isRequired,
  isModalOpen: PropTypes.bool.isRequired,
  url: PropTypes.string,
};

GuestSignUpForm.defaultProps = {
  url: '',
};

export default Form.create({ name: 'username' })(GuestSignUpForm);

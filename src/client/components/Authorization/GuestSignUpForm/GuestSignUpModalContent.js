import React, { useEffect, useState } from 'react';
import { Form } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import getSlug from 'speakingurl';
import { GUEST_PREFIX } from '../../../../common/constants/waivio';
import { getGuestAvatarUrl, getUserAccount, setUserStatus, updateGuestProfile } from '../../../../waivioApi/ApiClient';
import { login } from '../../../auth/authActions';
import { notify } from '../../../app/Notification/notificationActions';
import { getLocale } from '../../../reducers';
import GuestSignUpFormContent from './GuestSignUpFormContent';
import './GuestSignUpForm.less';

const GuestSignUpModalContent = ({ form, userData, isModalOpen }) => {
  const { getFieldDecorator, getFieldsError, getFieldError, validateFields, setFieldsValue } = form;

  console.log('\tGuestSignUpModalContent > ', userData);

  let initialLanguages = useSelector(getLocale, shallowEqual);
  initialLanguages = initialLanguages === 'auto' ? 'en-US' : initialLanguages;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    switch (userData.socialNetwork) {
      case 'google':
        setFieldsValue({
          username: getSlug(userData.name).slice(0, 16),
        });
        break;
      case 'facebook':
        setFieldsValue({
          username: getSlug(
            `${userData.profileObj.givenName} ${userData.profileObj.familyName}`,
          ).slice(0, 16),
        });
        break;
      case 'beaxy':
        debugger;
        setFieldsValue({
          username: getSlug(userData.userName.split('_')[1]),
          alias: userData.displayName,
        });
        break;
      default:
        break;
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
    if (userData.socialNetwork === 'beaxy') callback();
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
        // if (userData.socialNetwork === 'beaxy') {
        //   debugger;
        //   updateGuestProfile(userData.userName, { ...userData.userMetadata }).then(res => {
        //     console.log('\t> > > ', res);
        //   })
        // }
        const userAvatar = isEmpty(values.avatar) ? '' : values.avatar[0].src;
        const userAlias = values.alias || '';
        const regData =
          userData.socialNetwork === 'beaxy'
            ? userData
            : {
                userName: `${GUEST_PREFIX}${values.username}`,
                avatar: userAvatar,
                alias: userAlias,
                locales: typeof values.locales === 'string' ? [values.locales] : values.locales,
              };
        dispatch(login(userData.accessToken, userData.socialNetwork, regData))
          .then(() => {
            setIsLoading(false);
          })
          .then(async () => {
            if (userData.socialNetwork === 'beaxy') {
              debugger;
              const { image } = await getGuestAvatarUrl(userData.userName, userAvatar);
              const response = await updateGuestProfile(userData.userName, {
                ...userData.jsonMetadata,
                profile: {
                  ...userData.jsonMetadata.profile,
                  profile_image: image || userAvatar,
                  name: userAlias,
                },
              });
              if(response.ok) {
                setUserStatus(userData.userName);
              }
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
      socialNetwork={userData.socialNetwork}
    />
  );
};

GuestSignUpModalContent.propTypes = {
  form: PropTypes.shape().isRequired,
  userData: PropTypes.shape().isRequired,
  isModalOpen: PropTypes.bool.isRequired,
};

export default Form.create({ name: 'username' })(GuestSignUpModalContent);

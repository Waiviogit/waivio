import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { batch, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import SteemConnect from '../../../steemConnectAPI';
import { login, beaxyLogin, busyLogin } from '../../../auth/authActions';
import {
  isUserRegistered,
  beaxyLoginByCredentials,
  beaxy2FALogin,
} from '../../../../waivioApi/ApiClient';
import { getFollowing, getFollowingObjects, getNotifications } from '../../../user/userActions';
import { getRate, getRewardFund } from './../../../app/appActions';
import { getRebloggedList } from './../../../app/Reblog/reblogActions';
import GuestSignUpModalContent from '../GuestSignUpForm/GuestSignUpModalContent';
import Spinner from '../../Icon/Loading';
import SocialButtons from '../SocialButtons/SocialButtons';
import BeaxySignInButton from '../SocialButtons/BeaxySignInButton';
import BeaxyAuthForm from '../BeaxyAuthForm/BeaxyAuthForm';
import '../ModalSignUp/ModalSignUp.less';

const ModalSignIn = ({ next }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const socialLoginResponse = async (response, socialNetwork) => {
    if (response) {
      const id = socialNetwork === 'google' ? response.googleId : response.id;
      const res = await isUserRegistered(id, socialNetwork);
      if (res) {
        setIsLoading(true);
        dispatch(login(response.accessToken, socialNetwork)).then(() => {
          setIsLoading(false);
          batch(() => {
            dispatch(getFollowing());
            dispatch(getFollowingObjects());
            dispatch(getNotifications());
            dispatch(busyLogin());
            dispatch(getRewardFund());
            dispatch(getRebloggedList());
            dispatch(getRate());
          });
        });
      } else {
        let image = '';

        if (socialNetwork === 'google') {
          if (response.w3) {
            image = response.w3.Paa;
          } else if (response.profileObj) {
            image = response.profileObj.imageUrl;
          }
        } else if (response.picture) {
          image = response.picture.data.url;
        }

        setUserData({ ...response, image, socialNetwork });
        setIsFormVisible(true);
      }
    }
  };

  const loginByCredentialsResponse = response => {
    const image = get(response, ['jsonMetadata', 'profile', 'profile_image'], '');
    setUserData({ ...response, image, socialNetwork: 'beaxy' });
    setIsFormVisible(true);
  };

  const handleBeaxySignIn = () => {
    setUserData({ socialNetwork: 'beaxy' });
    setIsLoginForm(true);
  };

  const renderSignIn = loginWithCredentials =>
    loginWithCredentials ? (
      <BeaxyAuthForm
        authRequest={beaxyLoginByCredentials}
        auth2FARequest={beaxy2FALogin}
        firstLoginResponse={loginByCredentialsResponse}
        onAuthSuccessAction={beaxyLogin}
      />
    ) : (
      <React.Fragment>
        <h2 className="ModalSignUp__title">
          <FormattedMessage id="login" defaultMessage="Log in" />
        </h2>
        {isLoading ? (
          <Spinner />
        ) : (
          <React.Fragment>
            <BeaxySignInButton onClick={handleBeaxySignIn} />
            <a role="button" href={SteemConnect.getLoginURL(next)} className="ModalSignUp__signin">
              <img
                src="/images/icons/steemit.svg"
                alt="steemit"
                className="ModalSignUp__icon-steemit"
              />
              <FormattedMessage id="signin_with_steemIt" defaultMessage="SteemConnect" />
            </a>
            <SocialButtons responseSocial={socialLoginResponse} />
          </React.Fragment>
        )}
      </React.Fragment>
    );

  const onModalClose = () => {
    setIsModalOpen(false);
    setIsFormVisible(false);
    setIsLoginForm(false);
  };

  const memoizedOnModalClose = useCallback(() => {
    onModalClose();
  }, []);

  return (
    <React.Fragment>
      <a role="presentation" onClick={() => setIsModalOpen(true)}>
        <FormattedMessage id="signin" defaultMessage="Log in" />
      </a>
      <Modal
        width={416}
        title=""
        visible={isModalOpen}
        onCancel={memoizedOnModalClose}
        footer={null}
        destroyOnClose
      >
        <div className="ModalSignUp">
          {isFormVisible ? (
            <GuestSignUpModalContent userData={userData} isModalOpen={isModalOpen} />
          ) : (
            renderSignIn(isLoginForm)
          )}
        </div>
      </Modal>
    </React.Fragment>
  );
};

ModalSignIn.propTypes = {
  next: PropTypes.string,
};

ModalSignIn.defaultProps = {
  next: '',
};

export default ModalSignIn;

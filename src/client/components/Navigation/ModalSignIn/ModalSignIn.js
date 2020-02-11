import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon, Modal } from 'antd';
import { batch, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import SteemConnect from '../../../steemConnectAPI';
import { busyLogin, login } from '../../../auth/authActions';
import { isUserRegistered } from '../../../../waivioApi/ApiClient';
import { getFollowing, getFollowingObjects, getNotifications } from '../../../user/userActions';
import { getRate, getRewardFund } from './../../../app/appActions';
import { getRebloggedList } from './../../../app/Reblog/reblogActions';
import GuestSignUpForm from '../GuestSignUpForm/GuestSignUpForm';
import '../ModalSignUp/ModalSignUp.less';

const ModalSignIn = ({ next }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [isFormVisible, setIsFormVisible] = useState(false);

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
            dispatch(getRewardFund());
            dispatch(getRebloggedList());
            dispatch(getRate());
          });
        });
      } else {
        setUserData({ ...response, image: response.w3.Paa, socialNetwork: 'google' });
        setIsFormVisible(true);
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
            dispatch(getRewardFund());
            dispatch(getRebloggedList());
            dispatch(getRate());
          });
        });
      } else {
        setUserData({ ...response, image: response.picture.data.url, socialNetwork: 'facebook' });
        setIsFormVisible(true);
      }
    }
  };

  const renderSignIn = () => (
    <React.Fragment>
      <h2 className="ModalSignUp__title">
        <FormattedMessage id="login" defaultMessage="Log in" />
      </h2>
      <a role="button" href={SteemConnect.getLoginURL(next)} className="ModalSignUp__signin">
        <img src="/images/icons/steemit.svg" alt="steemit" className="ModalSignUp__icon-steemit" />
        <FormattedMessage id="signin_with_steemIt" defaultMessage="SteemConnect" />
      </a>
      <div className="ModalSignUp__social">
        <GoogleLogin
          buttonText="Google"
          clientId="623736583769-qlg46kt2o7gc4kjd2l90nscitf38vl5t.apps.googleusercontent.com"
          onSuccess={responseGoogle}
          cookiePolicy={'single_host_origin'}
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
    </React.Fragment>
  );

  const onModalClose = () => {
    setIsModalOpen(false);
    setIsFormVisible(false);
  };

  return (
    <React.Fragment>
      <a role="presentation" onClick={() => setIsModalOpen(true)}>
        <FormattedMessage id="signin" defaultMessage="Log in" />
      </a>
      <Modal width={416} title="" visible={isModalOpen} onCancel={onModalClose} footer={null}>
        <div className="ModalSignUp">
          {isFormVisible ? (
            <GuestSignUpForm userData={userData} isModalOpen={isModalOpen} />
          ) : (
            renderSignIn()
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

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Icon } from 'antd';
import { useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { login } from '../../../auth/authActions';
import './ModalSignUp.less';

const ModalSignUp = ({ isButton }) => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const responseGoogle = async response => {
    dispatch(login(response.accessToken, 'google'));
  };

  const responseFacebook = async response => {
    dispatch(login(response.accessToken, 'facebook'));
  };

  const getSignUpInfo = (
    <div className="SignUpCard">
      <div className="SignUpCard__line">
        <a href={process.env.SIGNUP_URL}>
          <img
            alt="linkLogo"
            src="https://cdn.steemitimages.com/DQmernVC8CUupAFckxvE62oMYVJNAsK8YDLmyBzJnNLzH7S/steemit.png"
          />
        </a>
      </div>
      <div className="SignUpCard__line">
        <FormattedMessage id="newSteemAcc" defaultMessage="New Steem Account" />
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
      {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
      <Modal
        width={600}
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
              <FormattedMessage id="or_sign_up_with" defaultMessage="Or sign up with" />
            </div>
            <GoogleLogin
              clientId="623736583769-qlg46kt2o7gc4kjd2l90nscitf38vl5t.apps.googleusercontent.com"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={'single_host_origin'}
              className="ModalSignUp__social-btn"
            />
            <FacebookLogin
              appId="754038848413420"
              autoLoad={false}
              fields="name,email,picture"
              callback={responseFacebook}
              textButton="Sign In with Facebook"
              cssClass="ModalSignUp__social-btn ModalSignUp__social-btn--fb"
              icon={<Icon type="facebook" className="ModalSignUp__icon-fb" />}
            />
          </div>
        </div>
      </Modal>
    </React.Fragment>
  );
};

ModalSignUp.propTypes = {
  isButton: PropTypes.bool.isRequired,
};

export default ModalSignUp;

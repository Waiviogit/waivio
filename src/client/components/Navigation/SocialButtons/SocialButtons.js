import React from 'react';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { Icon } from 'antd';
import PropTypes from 'prop-types';

const SocialButtons = ({ responseSocial, className }) => (
  <div className={className}>
    <GoogleLogin
      buttonText="Google"
      clientId="623736583769-qlg46kt2o7gc4kjd2l90nscitf38vl5t.apps.googleusercontent.com"
      onSuccess={response => responseSocial(response, 'google')}
      onFailure={failResponse => responseSocial(failResponse, 'google')}
      cookiePolicy={'single_host_origin'}
      className="ModalSignIn__social-btn"
    />
    <FacebookLogin
      appId="754038848413420"
      autoLoad={false}
      fields="name,email,picture"
      callback={response => responseSocial(response, 'facebook')}
      textButton="Facebook"
      cssClass="ModalSignIn__social-btn ModalSignIn__social-btn--fb"
      icon={<Icon type="facebook" className="ModalSignIn__icon-fb" />}
      disableMobileRedirect
    />
  </div>
);

SocialButtons.propTypes = {
  responseSocial: PropTypes.func,
  className: PropTypes.string,
};

SocialButtons.defaultProps = {
  responseSocial: () => {},
  className: '',
};

export default SocialButtons;

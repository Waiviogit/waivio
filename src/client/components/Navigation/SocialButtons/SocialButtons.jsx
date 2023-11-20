import React from 'react';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { Icon, message } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

const SocialButtons = ({ responseSocial, className, intl, lastError, setLastError }) => {
  const handleFailure = failResponse => {
    if (failResponse.error === 'idpiframe_initialization_failed') {
      setLastError(failResponse.error);
      if (lastError === 'idpiframe_initialization_failed') {
        message.error(
          intl.formatMessage({
            id: 'sign_in_error_not_cookies',
            defaultMessage:
              'You need to disable blocking cookies in incognito mode, in your browser settings',
          }),
        );
      }
    } else {
      responseSocial(failResponse, 'google');
    }
  };

  return (
    <div className={className}>
      <GoogleLogin
        buttonText="Google"
        clientId="623736583769-qlg46kt2o7gc4kjd2l90nscitf38vl5t.apps.googleusercontent.com"
        onSuccess={response => responseSocial(response, 'google')}
        onFailure={handleFailure}
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
};

SocialButtons.propTypes = {
  responseSocial: PropTypes.func,
  className: PropTypes.string,
  intl: PropTypes.shape().isRequired,
  lastError: PropTypes.string,
  setLastError: PropTypes.string,
};

SocialButtons.defaultProps = {
  responseSocial: () => {},
  setLastError: () => {},
  className: '',
  lastError: '',
};

export default injectIntl(SocialButtons);
